 
## Authentication — Replicate Real API Auth Per Platform
 
Each platform uses a **different authentication mechanism** in the real world. The mock server must replicate each platform's exact auth method — same header names, same token prefixes, same error responses when auth fails. The actual token values are stored in `.env` and the middleware validates incoming requests against them.
 
---
 
### `.env` File
 
Add all four platform tokens to `.env`:
 
```env
PORT=5000
 
GOOGLE_ADS_ACCESS_TOKEN=mock_google_access_token_abc123
META_ADS_ACCESS_TOKEN=mock_meta_access_token_def456
LINKEDIN_ADS_ACCESS_TOKEN=mock_linkedin_access_token_ghi789
TWITTER_ADS_ACCESS_TOKEN=mock_twitter_access_token_jkl012
TWITTER_ADS_ACCESS_TOKEN_SECRET=mock_twitter_token_secret_xyz
```
 
---
 
### Directory Changes
 
Add one auth middleware file per platform inside `src/middleware/auth/`:
 
```
src/
└── middleware/
    ├── logger.js
    ├── errorHandler.js
    └── auth/
        ├── googleAdsAuth.js
        ├── metaAdsAuth.js
        ├── linkedinAdsAuth.js
        └── twitterAdsAuth.js
```
 
Each auth file exports an Express middleware function. Apply it in the platform's `routes/<platform>/index.js` as the first middleware before all routes — so every single route under that platform is protected.
 
---
 
### Platform 1 — Google Ads Auth
 
**Real mechanism:** OAuth 2.0 Bearer token passed in the `Authorization` header, plus a mandatory `developer-token` header.
 
**Mock implementation:**
- Read `Authorization` header
- Must be in format: `Bearer <token>`
- Extract the token and compare it against `process.env.GOOGLE_ADS_ACCESS_TOKEN`
- Also require a `developer-token` header to be present (any non-empty value is accepted in mock)
- If `Authorization` header is missing or not in `Bearer <token>` format → return HTTP `401`
- If token does not match → return HTTP `401`
- If `developer-token` header is missing → return HTTP `403`
**Unauthorized error response** (matches Google's real auth error shape):
```json
{
  "error": {
    "code": 401,
    "message": "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.",
    "status": "UNAUTHENTICATED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "ACCESS_TOKEN_INVALID",
        "domain": "googleapis.com",
        "metadata": {}
      }
    ]
  }
}
```
 
**Missing developer-token error response:**
```json
{
  "error": {
    "code": 403,
    "message": "The caller does not have permission.",
    "status": "PERMISSION_DENIED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "DEVELOPER_TOKEN_NOT_APPROVED",
        "domain": "googleapis.com",
        "metadata": {}
      }
    ]
  }
}
```
 
**Example valid request header:**
```
Authorization: Bearer mock_google_access_token_abc123
developer-token: any-non-empty-value
```
 
---
 
### Platform 2 — Meta Ads Auth
 
**Real mechanism:** OAuth 2.0 access token passed as a query parameter `access_token` in the URL. Meta does NOT use the `Authorization` header — the token goes in the query string.
 
**Mock implementation:**
- Read `access_token` from `req.query`
- Compare it against `process.env.META_ADS_ACCESS_TOKEN`
- If `access_token` query param is missing → return HTTP `400`
- If token does not match → return HTTP `401`
**Missing token error response:**
```json
{
  "error": {
    "message": "An access token is required to request this resource.",
    "type": "OAuthException",
    "code": 104,
    "fbtrace_id": "mock-trace-id-missing"
  }
}
```
 
**Invalid token error response:**
```json
{
  "error": {
    "message": "Invalid OAuth access token - Cannot parse access token",
    "type": "OAuthException",
    "code": 190,
    "error_subcode": 460,
    "fbtrace_id": "mock-trace-id-invalid"
  }
}
```
 
**Example valid request:**
```
GET /api/meta-ads/campaigns?access_token=mock_meta_access_token_def456
```
 
---
 
### Platform 3 — LinkedIn Ads Auth
 
**Real mechanism:** OAuth 2.0 Bearer token passed in the `Authorization` header. Additionally LinkedIn requires a `X-Restli-Protocol-Version` header set to `2.0.0` on all requests.
 
**Mock implementation:**
- Read `Authorization` header
- Must be in format: `Bearer <token>`
- Extract token and compare against `process.env.LINKEDIN_ADS_ACCESS_TOKEN`
- Also require `X-Restli-Protocol-Version` header to be present and equal to `2.0.0`
- If `Authorization` header is missing or malformed → return HTTP `401`
- If token does not match → return HTTP `401`
- If `X-Restli-Protocol-Version` is missing or wrong value → return HTTP `400`
**Unauthorized error response** (matches LinkedIn's real auth error shape):
```json
{
  "status": 401,
  "serviceErrorCode": 65600,
  "code": "UNAUTHORIZED",
  "message": "Empty oauth2 access token"
}
```
 
**Invalid token error response:**
```json
{
  "status": 401,
  "serviceErrorCode": 65601,
  "code": "UNAUTHORIZED",
  "message": "The token used in the request has been revoked by the user"
}
```
 
**Missing protocol version error response:**
```json
{
  "status": 400,
  "serviceErrorCode": 0,
  "code": "BAD_REQUEST",
  "message": "X-Restli-Protocol-Version header is missing or invalid. Must be 2.0.0"
}
```
 
**Example valid request headers:**
```
Authorization: Bearer mock_linkedin_access_token_ghi789
X-Restli-Protocol-Version: 2.0.0
```
 
---
 
### Platform 4 — Twitter/X Ads Auth
 
**Real mechanism:** OAuth 1.0a. The real Twitter Ads API uses OAuth 1.0a which means the `Authorization` header contains multiple fields: `oauth_consumer_key`, `oauth_token`, `oauth_signature_method`, `oauth_timestamp`, `oauth_nonce`, `oauth_version`, and `oauth_signature`.
 
**Mock implementation:** Full OAuth 1.0a signature verification is not feasible in a mock. Instead, implement a **simplified check** that mirrors the header structure without verifying the cryptographic signature:
- Read the `Authorization` header
- Must start with `OAuth ` (capital O, not `Bearer`)
- Must contain `oauth_token="<value>"` somewhere in the header string
- Extract the `oauth_token` value and compare it against `process.env.TWITTER_ADS_ACCESS_TOKEN`
- If `Authorization` header is missing → return HTTP `401`
- If header does not start with `OAuth ` → return HTTP `401`
- If `oauth_token` is missing from the header → return HTTP `401`
- If `oauth_token` value does not match → return HTTP `401`
**Unauthorized error response** (matches Twitter's real auth error shape):
```json
{
  "errors": [
    {
      "code": 32,
      "message": "Could not authenticate you.",
      "label": "AUTHENTICATION_ERROR"
    }
  ],
  "request": {
    "params": {}
  }
}
```
 
**Missing header error response:**
```json
{
  "errors": [
    {
      "code": 135,
      "message": "Timestamp out of bounds.",
      "label": "TIMESTAMP_OUT_OF_BOUNDS"
    }
  ],
  "request": {
    "params": {}
  }
}
```
 
**Example valid request header:**
```
Authorization: OAuth oauth_consumer_key="your_consumer_key", oauth_token="mock_twitter_access_token_jkl012", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1696118400", oauth_nonce="mock_nonce_12345", oauth_version="1.0", oauth_signature="mock_signature"
```
 
---
 
### Auth Middleware Rules
 
1. **Apply auth middleware per platform router**, not globally — each platform has its own auth middleware applied in its `routes/<platform>/index.js` before all routes are registered
2. **Auth runs before the random delay** — reject unauthorized requests immediately without simulating network latency
3. **`/api/health` is exempt** from all auth middleware — it must remain publicly accessible
4. **Auth error responses must use the exact platform error shape** defined above — never return a generic `{ "error": "unauthorized" }`
5. **HTTP status codes must match the real API** — use `401` for invalid/missing tokens, `403` for valid token but missing permissions, `400` for malformed headers
6. **Token comparison must use a timing-safe approach** — use Node's `crypto.timingSafeEqual()` to compare tokens, not `===`, to prevent timing attacks even in a mock environment
7. **Never log the token value** in the logger middleware — log only that auth passed or failed
