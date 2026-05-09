import os
import secrets
import hashlib
import base64
import json
from flask import Flask, redirect, request, jsonify, make_response, Response
from flask_cors import CORS
from google_auth_oauthlib.flow import Flow
import yaml
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from dotenv import load_dotenv

# Load .env file for Meta API credentials
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Register Instagram Blueprint
from instagram_routes import instagram_bp
app.register_blueprint(instagram_bp)

# Allow CORS from the client origin
CORS(app, origins=["http://localhost:8000", "http://127.0.0.1:8000"], supports_credentials=True)

# Allow HTTP for local development (remove in production)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Path to the client secrets JSON downloaded from Google Cloud Console
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), "client_secret.json")

# The redirect URI must exactly match one of the URIs registered in Google Cloud Console
REDIRECT_URI = "http://localhost:5000/auth/callback"

# Google Ads API scope + basic profile scopes
SCOPES = [
    "https://www.googleapis.com/auth/adwords",  # Full Google Ads API access
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

# ---------------------------------------------------------------------------
# In-memory PKCE store: { state -> code_verifier }
# This avoids all cross-origin session/cookie issues.
# In production, replace with Redis or a database.
# ---------------------------------------------------------------------------
_pkce_store: dict[str, str] = {}


def _generate_pkce_pair() -> tuple[str, str]:
    """Return (code_verifier, code_challenge) using S256 method."""
    code_verifier = secrets.token_urlsafe(96)[:128]
    digest = hashlib.sha256(code_verifier.encode()).digest()
    code_challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
    return code_verifier, code_challenge


def make_flow():
    """Create a new OAuth2 Flow instance from client secrets."""
    return Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/auth/url")
def get_auth_url():
    """
    Generate and return the Google OAuth2 authorization URL.
    We build PKCE ourselves so the code_verifier is never lost between requests.
    """
    code_verifier, code_challenge = _generate_pkce_pair()

    flow = make_flow()
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        include_granted_scopes="false",
        code_challenge=code_challenge,
        code_challenge_method="S256",
    )

    # Store code_verifier server-side keyed by state (no cookies needed)
    _pkce_store[state] = code_verifier

    print(f"\n[auth/url] State: {state}")
    print(f"[auth/url] Code verifier stored (first 10 chars): {code_verifier[:10]}...")

    return jsonify({"auth_url": authorization_url})


@app.route("/auth/callback")
def oauth_callback():
    """
    Handle the OAuth2 redirect from Google.
    Exchanges the authorization code + code_verifier for tokens.
    """
    state = request.args.get("state")
    code_verifier = _pkce_store.pop(state, None)

    print(f"\n[auth/callback] State received: {state}")
    print(f"[auth/callback] Code verifier found: {bool(code_verifier)}")

    if not code_verifier:
        return "Error: OAuth state mismatch or session expired. Please try again.", 400

    flow = make_flow()
    flow.fetch_token(
        authorization_response=request.url,
        code_verifier=code_verifier,
    )

    credentials = flow.credentials

    token_info = {
        "access_token":  credentials.token,
        "refresh_token": credentials.refresh_token,
        "client_id":     credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes":        list(credentials.scopes) if credentials.scopes else SCOPES,
    }

    print("\n" + "=" * 60)
    print(f"✅ REFRESH TOKEN: {token_info['refresh_token']}")
    print("=" * 60 + "\n")

    refresh_display = (
        token_info["refresh_token"]
        or "⚠️ No refresh token returned. Revoke access at myaccount.google.com/permissions and try again."
    )

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>OAuth Success</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }}
            body {{ background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #fff; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }}
            .card {{ background: rgba(255,255,255,0.07); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; max-width: 620px; width: 100%; }}
            h1 {{ color: #22c55e; margin-bottom: 8px; font-size: 24px; }}
            p {{ color: #94a3b8; font-size: 14px; margin-bottom: 24px; }}
            .token-box {{ background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px; margin-bottom: 12px; }}
            .token-label {{ color: #6366f1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }}
            .token-value {{ color: #e2e8f0; font-size: 13px; word-break: break-all; font-family: monospace; }}
            .badge {{ display: inline-block; background: #22c55e20; color: #22c55e; border: 1px solid #22c55e40; border-radius: 100px; padding: 4px 12px; font-size: 12px; margin-bottom: 24px; }}
            .copy-btn {{ margin-top: 8px; padding: 6px 14px; background: #6366f1; border: none; border-radius: 6px; color: #fff; font-size: 12px; cursor: pointer; }}
            .copy-btn:hover {{ background: #4f46e5; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>&#x2705; Authorization Successful!</h1>
            <span class="badge">Google Ads API Connected</span>
            <p>Your refresh token has been generated. Store it securely — never expose it publicly.</p>
            <div class="token-box">
                <div class="token-label">Refresh Token (save this!)</div>
                <div class="token-value" id="rt">{refresh_display}</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('rt').innerText)">Copy</button>
            </div>
            <div class="token-box">
                <div class="token-label">Access Token (short-lived)</div>
                <div class="token-value">{token_info['access_token']}</div>
            </div>
            <div class="token-box">
                <div class="token-label">Client ID</div>
                <div class="token-value">{token_info['client_id']}</div>
            </div>
            <div style="margin-top: 24px; text-align: center;">
                <a href="http://localhost:8000/?refresh_token={token_info['refresh_token']}" style="display: inline-block; background: #22c55e; color: #fff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: background 0.2s;">
                    Return to Dashboard
                </a>
            </div>
        </div>
        <script src="/auth/token.js"></script>
    </body>
    </html>
    """
    response = make_response(html)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src https://fonts.gstatic.com; "
        "script-src 'self';"
    )
    # Store tokens temporarily for /auth/token.js
    response.set_cookie("_rt", token_info["refresh_token"] or "", httponly=False, samesite="Lax")
    response.set_cookie("_at", token_info["access_token"] or "", httponly=False, samesite="Lax")
    return response


@app.route("/auth/token.js")
def token_js():
    """External JS file to console.log the tokens without violating CSP."""
    refresh_token = request.cookies.get("_rt", "")
    access_token  = request.cookies.get("_at",  "")
    js_code = (
        'console.log("%c\U0001f525 OAuth Tokens Received", "color:#6366f1;font-weight:bold;font-size:14px;");\n'
        f'console.log("%cRefresh Token:", "color:#22c55e;font-weight:600", "{refresh_token}");\n'
        f'console.log("%cAccess Token:",  "color:#94a3b8;font-weight:600", "{access_token}");\n'
    )
    res = Response(js_code, mimetype="application/javascript")
    res.headers["Cache-Control"] = "no-store"
    return res


# ---------------------------------------------------------------------------
# Google Ads API Integration Routes
# ---------------------------------------------------------------------------

def get_ads_client(refresh_token: str) -> GoogleAdsClient:
    """Instantiate the Google Ads client dynamically using the passed refresh token."""
    # 1. Load client secrets
    with open(CLIENT_SECRETS_FILE, "r") as f:
        client_secrets = json.load(f)["web"]

    # 2. Load developer token
    yaml_path = os.path.join(os.path.dirname(__file__), "google-ads.yaml")
    with open(yaml_path, "r") as f:
        dev_yaml = yaml.safe_load(f)

    # 3. Construct dictionary for client
    credentials = {
        "developer_token": dev_yaml.get("developer_token", ""),
        "refresh_token": refresh_token,
        "client_id": client_secrets["client_id"],
        "client_secret": client_secrets["client_secret"],
        "use_proto_plus": True
    }

    # 4. Use login_customer_id if populated in yaml (Required for Manager proxying)
    login_cust_id = dev_yaml.get("login_customer_id", "")
    if login_cust_id:
        credentials["login_customer_id"] = str(login_cust_id).replace('-', '')

    return GoogleAdsClient.load_from_dict(credentials)


@app.route("/api/customers")
def get_customers():
    """Fetch the list of Google Ads IDs (accessible customers) for the authenticated user."""
    refresh_token = request.headers.get("X-Refresh-Token") or request.cookies.get("_rt")
    if not refresh_token:
        return jsonify({"error": "No refresh token provided. Please authenticate first."}), 401

    try:
        client = get_ads_client(refresh_token)
        customer_service = client.get_service("CustomerService")
        
        accessible_customers = customer_service.list_accessible_customers()
        customers = [
            {"id": cust.replace("customers/", "")} 
            for cust in accessible_customers.resource_names
        ]
        
        # When acting as a manager, list_accessible_customers usually returns the manager ID.
        # But we also add the quizwhiz client ID statically if it wasn't returned, so the user can easily select it from the dropdown. 
        # (Alternatively, you could run a complex GAQL query to fetch customer_client records.)
        if "8195396629" not in [c["id"] for c in customers]:
            customers.append({"id": "8195396629"})
            
        return jsonify({"customers": customers})
        
    except GoogleAdsException as ex:
        err = f"Google Ads Error: {ex.failure}"
        print(err)
        return jsonify({"error": err}), 500
    except Exception as e:
        print(f"Error fetching customers: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/campaigns/<customer_id>")
def get_campaigns(customer_id):
    """Run GAQL to fetch Campaigns, Impressions, Clicks, and Cost for a specific Customer ID."""
    refresh_token = request.headers.get("X-Refresh-Token") or request.cookies.get("_rt")
    if not refresh_token:
        return jsonify({"error": "No refresh token provided."}), 401

    try:
        client = get_ads_client(refresh_token)
        ga_service = client.get_service("GoogleAdsService")

        query = """
            SELECT
              campaign.id,
              campaign.name,
              campaign.status,
              metrics.clicks,
              metrics.impressions,
              metrics.cost_micros
            FROM campaign
            ORDER BY campaign.id
        """

        response = ga_service.search(customer_id=str(customer_id).replace("-", ""), query=query)

        campaigns = []
        for row in response:
            campaigns.append({
                "id": row.campaign.id,
                "name": row.campaign.name,
                "status": row.campaign.status.name,
                "clicks": row.metrics.clicks,
                "impressions": row.metrics.impressions,
                "cost": round(row.metrics.cost_micros / 1000000.0, 2)  # cost is returned in micros
            })

        return jsonify({"campaigns": campaigns})
        
    except GoogleAdsException as ex:
        err = f"Google Ads Error: {ex.failure}"
        print(err)
        return jsonify({"error": err}), 500
    except Exception as e:
        print(f"Error fetching campaigns: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Flask OAuth2 server running at http://localhost:5000")
    app.run(host="localhost", port=5000, debug=True)
