// Check URL or cookies for refresh token on load and save to localStorage
document.addEventListener('DOMContentLoaded', () => {
    // 1. Try to get from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const rtFromUrl = urlParams.get('refresh_token');

    if (rtFromUrl) {
        localStorage.setItem('refresh_token', rtFromUrl);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log("Refresh token saved to local storage from URL.");
    } else {
        // 2. Try to get from cookie (set by backend on same localhost)
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        const cookieRt = getCookie('_rt');
        if (cookieRt) {
            localStorage.setItem('refresh_token', cookieRt);
            console.log("Refresh token saved to local storage from cookie.");
        }
    }

    // Prepopulate the manual Dev input field if the token exists
    const existingRt = localStorage.getItem('refresh_token');
    if (existingRt) {
        const devRtInput = document.getElementById('dev-rt-input');
        if (devRtInput) devRtInput.value = existingRt;
    }
});

// Handle Manual Save of Dev RT
document.getElementById('save-rt-btn')?.addEventListener('click', () => {
    const devRtInput = document.getElementById('dev-rt-input').value.trim();
    if (devRtInput) {
        localStorage.setItem('refresh_token', devRtInput);
        alert('Refresh Token successfully saved to Local Storage!');
    } else {
        alert('Please enter a valid refresh token.');
    }
});

// Function called by Google Identity Services upon successful authentication
window.handleCredentialResponse = function (response) {
    console.log(response);
    // The response.credential is a base64 encoded JSON Web Token (JWT)
    // We decode it to access the user's profile information
    const responsePayload = jwt_decode(response.credential);

    console.log("Authentication successful!");
    console.log("ID: " + responsePayload.sub);
    console.log("Name: " + responsePayload.name);
    console.log("Email: " + responsePayload.email);

    // Update UI for logged in state
    document.getElementById('main-title').innerText = "Hello, " + responsePayload.given_name;
    document.getElementById('main-subtitle').style.display = "none";
    document.querySelector('.g_id_signin_wrapper').classList.add('hidden');

    // Populate profile details
    document.getElementById('profile-img').src = responsePayload.picture;
    document.getElementById('profile-name').innerText = responsePayload.name;
    document.getElementById('profile-email').innerText = responsePayload.email;

    // Show profile info
    document.getElementById('profile-info').classList.remove('hidden');
}

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    // Disable auto-select so the user isn't instantly prompted again
    if (google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }

    // Reset UI back to logged out state
    document.getElementById('main-title').innerText = "Welcome Back";
    document.getElementById('main-subtitle').style.display = "block";
    document.querySelector('.g_id_signin_wrapper').classList.remove('hidden');
    document.getElementById('profile-info').classList.add('hidden');

    // Clear the refresh token for development testing
    localStorage.removeItem('refresh_token');

    // Note: To completely sign a user out of their Google account requires redirecting to Google's logout endpoint, 
    // but disabling auto-select safely revokes the local prompt state.
});

// Handle Connect Google Ads button
// Fetches the authorization URL from the Flask backend, then redirects to Google's consent screen
document.getElementById('connect-ads-btn').addEventListener('click', async () => {
    const btn = document.getElementById('connect-ads-btn');
    btn.disabled = true;
    btn.textContent = 'Redirecting to Google...';

    try {
        const response = await fetch('http://localhost:5000/auth/url', {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Redirect the user to Google's OAuth2 authorization page
        window.location.href = data.auth_url;
    } catch (err) {
        console.error('Failed to get auth URL:', err);
        btn.disabled = false;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Connect Google Ads Account`;
        alert('Could not reach the Flask server. Make sure it is running at http://localhost:5000');
    }
});

// Load Google Ads Accounts
document.getElementById('fetch-accounts-btn').addEventListener('click', async () => {
    const errorMsg = document.getElementById('ads-error');
    errorMsg.classList.add('hidden');

    try {
        const rt = localStorage.getItem('refresh_token');
        const headers = {};
        if (rt) {
            headers['X-Refresh-Token'] = rt;
        }

        const response = await fetch('http://localhost:5000/api/customers', {
            headers: headers,
            credentials: 'include', // sends the _rt cookie from localhost:5000 if it exists
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch accounts");
        }

        const select = document.getElementById('customer-select');
        select.innerHTML = ''; // Clear existing

        if (data.customers && data.customers.length > 0) {
            data.customers.forEach(cust => {
                const opt = document.createElement('option');
                opt.value = cust.id;
                // Format ID from 1234567890 to 123-456-7890
                opt.textContent = cust.id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                select.appendChild(opt);
            });
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('fetch-accounts-btn').textContent = "Accounts Loaded";
            document.getElementById('connect-ads-btn').classList.add('hidden');
        } else {
            throw new Error("No accessible Google Ads accounts found.");
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
});

// Load Campaigns
document.getElementById('load-campaigns-btn').addEventListener('click', async () => {
    const customerId = document.getElementById('customer-select').value;
    const loading = document.getElementById('loading');
    const tableBody = document.getElementById('campaign-body');
    const campaignList = document.getElementById('campaign-list');
    const errorMsg = document.getElementById('ads-error');

    if (!customerId) return;

    errorMsg.classList.add('hidden');
    campaignList.classList.add('hidden');
    loading.classList.remove('hidden');
    tableBody.innerHTML = '';

    try {
        const rt = localStorage.getItem('refresh_token');
        const headers = {};
        if (rt) {
            headers['X-Refresh-Token'] = rt;
        }

        const response = await fetch(`http://localhost:5000/api/campaigns/${customerId}`, {
            headers: headers,
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch campaigns");
        }

        if (data.campaigns.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No campaigns found.</td></tr>`;
        } else {
            data.campaigns.forEach(camp => {
                // Status badge styling
                let statusColor = '#94a3b8';
                if (camp.status === 'ENABLED') statusColor = '#22c55e';
                if (camp.status === 'PAUSED') statusColor = '#eab308';
                if (camp.status === 'REMOVED') statusColor = '#ef4444';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${camp.name}</td>
                    <td><span style="color:${statusColor}; font-weight:600; font-size:12px;">${camp.status}</span></td>
                    <td>${camp.clicks}</td>
                    <td>${camp.impressions}</td>
                    <td>$${camp.cost.toFixed(2)}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
        campaignList.classList.remove('hidden');
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
});
