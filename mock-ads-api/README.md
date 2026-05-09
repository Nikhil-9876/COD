# Mock Ads API Server

A local mock REST API server simulating **Google Ads**, **Meta Ads (Facebook/Instagram)**, **LinkedIn Ads**, and **Twitter/X Ads** APIs with exact real API response structures.

## Setup

```bash
cd mock-ads-api
npm install
npm run dev
```

Server starts on `http://localhost:4000` (configurable via `.env`).

---

## Endpoints

### Health Check
```
GET /api/health
```

### Google Ads — `/api/google-ads`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/google-ads/campaigns` | List all campaigns |
| GET | `/api/google-ads/campaigns/:id` | Get campaign by ID |
| GET | `/api/google-ads/adgroups` | List all ad groups |
| GET | `/api/google-ads/adgroups/:id` | Get ad group by ID |
| GET | `/api/google-ads/analytics` | Get analytics data |

### Meta Ads — `/api/meta-ads`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/meta-ads/campaigns` | List all campaigns |
| GET | `/api/meta-ads/campaigns/:id` | Get campaign by ID |
| GET | `/api/meta-ads/adsets` | List all ad sets |
| GET | `/api/meta-ads/adsets/:id` | Get ad set by ID |
| GET | `/api/meta-ads/analytics` | Get insights data |

### LinkedIn Ads — `/api/linkedin-ads`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/linkedin-ads/campaigns` | List all campaigns |
| GET | `/api/linkedin-ads/campaigns/:id` | Get campaign by URN/ID |
| GET | `/api/linkedin-ads/creatives` | List all creatives |
| GET | `/api/linkedin-ads/creatives/:id` | Get creative by URN/ID |
| GET | `/api/linkedin-ads/analytics` | Get analytics data |

### Twitter/X Ads — `/api/twitter-ads`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/twitter-ads/campaigns` | List all campaigns |
| GET | `/api/twitter-ads/campaigns/:id` | Get campaign by ID |
| GET | `/api/twitter-ads/line-items` | List all line items |
| GET | `/api/twitter-ads/line-items/:id` | Get line item by ID |
| GET | `/api/twitter-ads/analytics` | Get stats data |

---

## Query Parameters

All analytics routes support:
- `?clientId=` — Filter by client/account ID
- `?campaignId=` — Filter by campaign ID
- `?startDate=YYYY-MM-DD` — Start of date range
- `?endDate=YYYY-MM-DD` — End of date range

All routes support:
- `?simulate=error` — Return the platform-specific error response

---

## Example Curl Commands

### Google Ads
```bash
# List campaigns
curl http://localhost:4000/api/google-ads/campaigns

# Get analytics for a specific client
curl "http://localhost:4000/api/google-ads/analytics?clientId=1234567890&startDate=2024-07-01&endDate=2024-07-07"

# Simulate error
curl "http://localhost:4000/api/google-ads/campaigns?simulate=error"
```

### Meta Ads
```bash
# List campaigns
curl http://localhost:4000/api/meta-ads/campaigns

# Get insights for an account
curl "http://localhost:4000/api/meta-ads/analytics?clientId=act_987654321"
```

### LinkedIn Ads
```bash
# List campaigns
curl http://localhost:4000/api/linkedin-ads/campaigns

# Get analytics
curl "http://localhost:4000/api/linkedin-ads/analytics?clientId=urn:li:sponsoredAccount:789012"
```

### Twitter/X Ads
```bash
# List campaigns
curl http://localhost:4000/api/twitter-ads/campaigns

# Get stats for an account
curl "http://localhost:4000/api/twitter-ads/analytics?clientId=abc123"
```

---

## Error Simulation — `?simulate=error`

Append `?simulate=error` to **any** route to receive the platform's real error response format:

- **Google Ads** → `GoogleAdsFailure` with `errorCode`, `message`, `requestId`
- **Meta Ads** → `OAuthException` with `code`, `error_subcode`, `fbtrace_id`
- **LinkedIn Ads** → `status`, `serviceErrorCode`, `code`, `message`
- **Twitter/X** → `errors[]` array with `code`, `message`, `label`

This lets you test your frontend error handling without needing real API credentials.

---

## Replacing with Real APIs

When you're ready to swap mock data for real API calls:

### Google Ads
- **Base URL:** Replace `http://localhost:4000/api/google-ads` with `https://googleads.googleapis.com/v18`
- **Auth:** Add `Authorization: Bearer <access_token>` and `developer-token: <token>` headers
- **Response structure:** Identical — `{ results: [...] }` with `GoogleAdsRow` objects

### Meta Ads
- **Base URL:** Replace `http://localhost:4000/api/meta-ads` with `https://graph.facebook.com/v21.0`
- **Auth:** Add `?access_token=<token>` query param or `Authorization: Bearer <token>` header
- **Response structure:** Identical — `{ data: [...], paging: { cursors: {...} } }`

### LinkedIn Ads
- **Base URL:** Replace `http://localhost:4000/api/linkedin-ads` with `https://api.linkedin.com/rest`
- **Auth:** Add `Authorization: Bearer <token>` and `LinkedIn-Version: 202401` headers
- **Response structure:** Identical — `{ elements: [...], paging: { start, count, total } }`

### Twitter/X Ads
- **Base URL:** Replace `http://localhost:4000/api/twitter-ads` with `https://ads-api.twitter.com/12`
- **Auth:** Add OAuth 1.0a headers
- **Response structure:** Identical — `{ data: [...], total_count, request: { params } }`

**No frontend changes required** — the response shapes are identical between mock and real.
