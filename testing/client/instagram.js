// ---------------------------------------------------------------------------
// Instagram Dashboard Logic
// Completely isolated from app.js (Google Ads)
// ---------------------------------------------------------------------------

const META_API_URL = 'http://localhost:5000';

function getMetaToken() {
    return localStorage.getItem('meta_access_token') || '';
}

function metaHeaders() {
    const headers = {};
    const token = getMetaToken();
    if (token) {
        headers['X-Meta-Token'] = token;
    }
    return headers;
}

// ---------------------------------------------------------------------------
// Save Meta Token
// ---------------------------------------------------------------------------
document.getElementById('save-meta-token-btn')?.addEventListener('click', () => {
    const input = document.getElementById('dev-meta-token-input').value.trim();
    if (input) {
        localStorage.setItem('meta_access_token', input);
        alert('Meta Access Token saved to Local Storage!');
        updateInstagramConnectState();
    } else {
        alert('Please enter a valid Meta Access Token.');
    }
});

// ---------------------------------------------------------------------------
// Update connect/disconnect state
// ---------------------------------------------------------------------------
function updateInstagramConnectState() {
    const token = getMetaToken();
    const connectPrompt = document.getElementById('ig-connect-prompt');
    const igDashContent = document.getElementById('ig-dashboard-content');

    if (token) {
        connectPrompt?.classList.add('hidden');
        igDashContent?.classList.remove('hidden');
    } else {
        connectPrompt?.classList.remove('hidden');
        igDashContent?.classList.add('hidden');
    }

    // Prepopulate input
    const devInput = document.getElementById('dev-meta-token-input');
    if (devInput && token) {
        devInput.value = token;
    }
}

// ---------------------------------------------------------------------------
// Load Instagram Campaigns
// ---------------------------------------------------------------------------
document.getElementById('load-ig-data-btn')?.addEventListener('click', async () => {
    const igError = document.getElementById('ig-error');
    const igLoading = document.getElementById('ig-loading');
    const igCampaignList = document.getElementById('ig-campaign-list');
    const igBody = document.getElementById('ig-campaign-body');

    igError.classList.add('hidden');
    igCampaignList.classList.add('hidden');
    igLoading.classList.remove('hidden');
    igBody.innerHTML = '';

    try {
        // Fetch campaigns and insights in parallel
        const [campRes, insightsRes] = await Promise.all([
            fetch(`${META_API_URL}/api/instagram/campaigns`, { headers: metaHeaders() }),
            fetch(`${META_API_URL}/api/instagram/insights`, { headers: metaHeaders() }),
        ]);

        const campData = await campRes.json();
        const insightsData = await insightsRes.json();

        if (!campRes.ok) throw new Error(campData.error || 'Failed to fetch campaigns');
        if (!insightsRes.ok) throw new Error(insightsData.error || 'Failed to fetch insights');

        // Populate summary cards
        const ins = insightsData.insights || {};
        document.getElementById('ig-stat-impressions').textContent = (ins.impressions || 0).toLocaleString();
        document.getElementById('ig-stat-reach').textContent = (ins.reach || 0).toLocaleString();
        document.getElementById('ig-stat-clicks').textContent = (ins.clicks || 0).toLocaleString();
        document.getElementById('ig-stat-spend').textContent = `$${(ins.spend || 0).toFixed(2)}`;
        document.getElementById('ig-stat-ctr').textContent = `${(ins.ctr || 0).toFixed(2)}%`;
        document.getElementById('ig-stat-roas').textContent = `${(ins.roas || 0).toFixed(2)}x`;

        document.getElementById('ig-summary-cards').classList.remove('hidden');

        // Populate campaigns table
        const campaigns = campData.campaigns || [];
        if (campaigns.length === 0) {
            igBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No Instagram campaigns found.</td></tr>`;
        } else {
            campaigns.forEach(camp => {
                let statusColor = '#94a3b8';
                if (camp.status === 'ACTIVE') statusColor = '#22c55e';
                if (camp.status === 'PAUSED') statusColor = '#eab308';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${camp.name}</td>
                    <td><span style="color:${statusColor}; font-weight:600; font-size:12px;">${camp.status}</span></td>
                    <td>${camp.impressions.toLocaleString()}</td>
                    <td>${camp.reach.toLocaleString()}</td>
                    <td>${camp.clicks.toLocaleString()}</td>
                    <td>${camp.ctr.toFixed(2)}%</td>
                    <td>$${camp.spend.toFixed(2)}</td>
                `;
                igBody.appendChild(tr);
            });
        }
        igCampaignList.classList.remove('hidden');

    } catch (err) {
        igError.textContent = err.message;
        igError.classList.remove('hidden');
    } finally {
        igLoading.classList.add('hidden');
    }
});

// ---------------------------------------------------------------------------
// Load Instagram Profile Stats
// ---------------------------------------------------------------------------
async function loadInstagramProfile() {
    try {
        const res = await fetch(`${META_API_URL}/api/instagram/account`, { headers: metaHeaders() });
        const data = await res.json();

        if (!res.ok) return; // Silently skip if profile not available

        const profile = data.profile || {};
        const profileSection = document.getElementById('ig-profile-section');

        if (profile.username) {
            document.getElementById('ig-profile-username').textContent = `@${profile.username}`;
            document.getElementById('ig-profile-followers').textContent = (profile.followers_count || 0).toLocaleString();
            document.getElementById('ig-profile-posts').textContent = (profile.media_count || 0).toLocaleString();
            document.getElementById('ig-profile-visits').textContent = (profile.profile_views_30d || 0).toLocaleString();

            if (profile.profile_picture_url) {
                document.getElementById('ig-profile-pic').src = profile.profile_picture_url;
            }

            profileSection?.classList.remove('hidden');
        }
    } catch (e) {
        console.warn('Could not load Instagram profile:', e);
    }
}

// ---------------------------------------------------------------------------
// Platform Switcher Logic
// ---------------------------------------------------------------------------
document.getElementById('switch-google')?.addEventListener('click', () => {
    document.getElementById('google-ads-view').classList.remove('hidden');
    document.getElementById('instagram-view').classList.add('hidden');
    document.getElementById('switch-google').classList.add('active');
    document.getElementById('switch-instagram').classList.remove('active');
    localStorage.setItem('active_platform', 'google');
});

document.getElementById('switch-instagram')?.addEventListener('click', () => {
    document.getElementById('google-ads-view').classList.add('hidden');
    document.getElementById('instagram-view').classList.remove('hidden');
    document.getElementById('switch-google').classList.remove('active');
    document.getElementById('switch-instagram').classList.add('active');
    localStorage.setItem('active_platform', 'instagram');
    updateInstagramConnectState();
    loadInstagramProfile();
});

// On page load, restore last selected platform
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('active_platform');
    if (saved === 'instagram') {
        document.getElementById('switch-instagram')?.click();
    }
});
