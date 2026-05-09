"""
Instagram (Meta Marketing API) routes.
Completely isolated from the Google Ads routes in app.py.
"""

import os
import requests
from flask import Blueprint, request, jsonify

instagram_bp = Blueprint("instagram", __name__)

META_API_BASE = "https://graph.facebook.com/v19.0"


def _get_meta_token():
    """Get Meta access token from request header or .env fallback."""
    return (
        request.headers.get("X-Meta-Token")
        or os.environ.get("META_ACCESS_TOKEN", "")
    )


def _get_ad_account_id():
    return os.environ.get("META_AD_ACCOUNT_ID", "")


def _get_ig_user_id():
    return os.environ.get("INSTAGRAM_USER_ID", "")


def _meta_request(endpoint, params=None):
    """
    Make a request to the Meta Graph API.
    Returns (data_dict, error_string_or_None, http_status_code).
    """
    token = _get_meta_token()
    if not token:
        return None, "No Meta access token provided. Please connect your Instagram account first.", 401

    if params is None:
        params = {}
    params["access_token"] = token

    url = f"{META_API_BASE}/{endpoint}"
    try:
        resp = requests.get(url, params=params, timeout=15)
        data = resp.json()

        # Handle Meta API errors
        if "error" in data:
            err = data["error"]
            code = err.get("code", 0)
            msg = err.get("message", "Unknown Meta API error")

            # Rate limit errors
            if code in (17, 613):
                return None, f"Rate limit exceeded. Please wait a moment and try again. (Code {code})", 429

            return None, f"Meta API Error: {msg} (Code {code})", 500

        return data, None, 200

    except requests.exceptions.Timeout:
        return None, "Meta API request timed out.", 504
    except Exception as e:
        return None, f"Failed to reach Meta API: {str(e)}", 500


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@instagram_bp.route("/api/instagram/campaigns")
def get_instagram_campaigns():
    """Fetch all ad campaigns from the Meta Ad Account."""
    ad_account_id = _get_ad_account_id()
    if not ad_account_id:
        return jsonify({"error": "META_AD_ACCOUNT_ID not configured in .env"}), 500

    data, error, status = _meta_request(
        f"{ad_account_id}/campaigns",
        params={
            "fields": "name,status,objective,daily_budget,lifetime_budget,created_time,"
                      "insights.date_preset(last_30d){impressions,reach,clicks,ctr,cpc,cpm,spend}",
            "limit": 50,
        },
    )

    if error:
        return jsonify({"error": error}), status

    campaigns = []
    for camp in data.get("data", []):
        insights_data = {}
        if "insights" in camp and "data" in camp["insights"] and camp["insights"]["data"]:
            insights_data = camp["insights"]["data"][0]

        campaigns.append({
            "id": camp.get("id", ""),
            "name": camp.get("name", ""),
            "status": camp.get("status", "UNKNOWN"),
            "objective": camp.get("objective", ""),
            "impressions": int(insights_data.get("impressions", 0)),
            "reach": int(insights_data.get("reach", 0)),
            "clicks": int(insights_data.get("clicks", 0)),
            "ctr": round(float(insights_data.get("ctr", 0)), 2),
            "cpc": round(float(insights_data.get("cpc", 0)), 2),
            "cpm": round(float(insights_data.get("cpm", 0)), 2),
            "spend": round(float(insights_data.get("spend", 0)), 2),
        })

    return jsonify({"campaigns": campaigns})


@instagram_bp.route("/api/instagram/insights")
def get_instagram_insights():
    """Fetch account-level ad insights (aggregate metrics)."""
    ad_account_id = _get_ad_account_id()
    if not ad_account_id:
        return jsonify({"error": "META_AD_ACCOUNT_ID not configured in .env"}), 500

    data, error, status = _meta_request(
        f"{ad_account_id}/insights",
        params={
            "fields": "impressions,reach,clicks,ctr,cpc,cpm,spend,actions",
            "date_preset": "last_30d",
        },
    )

    if error:
        return jsonify({"error": error}), status

    insights = {}
    if data.get("data"):
        raw = data["data"][0]
        insights = {
            "impressions": int(raw.get("impressions", 0)),
            "reach": int(raw.get("reach", 0)),
            "clicks": int(raw.get("clicks", 0)),
            "ctr": round(float(raw.get("ctr", 0)), 2),
            "cpc": round(float(raw.get("cpc", 0)), 2),
            "cpm": round(float(raw.get("cpm", 0)), 2),
            "spend": round(float(raw.get("spend", 0)), 2),
        }

        # Extract ROAS from actions if available
        actions = raw.get("actions", [])
        purchase_value = 0
        for action in actions:
            if action.get("action_type") == "omni_purchase":
                purchase_value = float(action.get("value", 0))
                break
        spend = insights["spend"]
        insights["roas"] = round(purchase_value / spend, 2) if spend > 0 else 0

    return jsonify({"insights": insights})


@instagram_bp.route("/api/instagram/account")
def get_instagram_account():
    """Fetch Instagram profile insights (followers, profile views, etc.)."""
    ig_user_id = _get_ig_user_id()
    if not ig_user_id:
        return jsonify({"error": "INSTAGRAM_USER_ID not configured in .env"}), 500

    # Fetch profile info
    profile_data, error, status = _meta_request(
        ig_user_id,
        params={"fields": "username,name,profile_picture_url,followers_count,media_count,biography"},
    )

    if error:
        return jsonify({"error": error}), status

    # Fetch profile insights (last 30 days)
    insights_data, error2, status2 = _meta_request(
        f"{ig_user_id}/insights",
        params={
            "metric": "impressions,reach,profile_views",
            "period": "day",
            "since": "",  # Will use default recent window
        },
    )

    profile = {
        "username": profile_data.get("username", ""),
        "name": profile_data.get("name", ""),
        "profile_picture_url": profile_data.get("profile_picture_url", ""),
        "followers_count": profile_data.get("followers_count", 0),
        "media_count": profile_data.get("media_count", 0),
        "biography": profile_data.get("biography", ""),
    }

    # Parse insights if available
    if insights_data and "data" in insights_data:
        for metric in insights_data["data"]:
            metric_name = metric.get("name", "")
            values = metric.get("values", [])
            if values:
                # Sum the last 30 daily values
                total = sum(v.get("value", 0) for v in values)
                profile[f"{metric_name}_30d"] = total

    return jsonify({"profile": profile})
