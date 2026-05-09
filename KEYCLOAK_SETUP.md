# Keycloak Local Setup

## 1. Create the realm

- Create a realm named `cloudcrm`.

## 2. Create the SPA client

- Create an OpenID Connect client named `cloudcrm-frontend`.
- Set `Client authentication` to `Off` so it is a public SPA client.
- Add valid redirect URIs:
  - `http://localhost:5173/*`
- Add web origins:
  - `http://localhost:5173`

## 3. Create the admin provisioning client

- Create an OpenID Connect client named `cloudcrm-admin`.
- Set `Client authentication` to `On`.
- Enable `Service accounts roles`.
- Generate a client secret and copy it into `KEYCLOAK_ADMIN_CLIENT_SECRET`.
- Grant the service account realm-management permissions needed to manage users and assign realm roles.

## 4. Create realm roles

- Create realm roles:
  - `admin`
  - `manager`
  - `employee`
  - `client`

## 5. Configure first-login password updates

- When creating users through the app, the backend provisions them in Keycloak with a temporary password.
- The backend also assigns Keycloak's `UPDATE_PASSWORD` required action so first login forces a password change.

## 6. Configure Google sign-in for clients

- Add the Google identity provider in the same realm.
- Require client users to sign in with the same email address as their provisioned CloudCRM account.
- Enable account linking or first-broker-login behavior so Google sign-in resolves to the existing Keycloak user instead of creating a separate identity for the same person.

## 7. Configure OTP before password/account changes

- Enable OTP for the realm authentication flow used by your clients.
- If you want password changes to require OTP, configure the relevant browser/account flow in Keycloak rather than in the CloudCRM backend.
- CloudCRM does not change passwords directly anymore; Keycloak owns that flow.

## 8. Add test users

- Existing local users can be linked automatically on first login by matching the Keycloak token email to the local `users.email`.
- New users created from the CloudCRM admin UI are provisioned into both the local app database and Keycloak.

## 9. Configure env vars

Backend `.env` values:

```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=cloudcrm
KEYCLOAK_CLIENT_ID=cloudcrm-frontend
KEYCLOAK_AUDIENCE=cloudcrm-frontend
KEYCLOAK_ISSUER=http://localhost:8080/realms/cloudcrm
KEYCLOAK_JWKS_URL=http://localhost:8080/realms/cloudcrm/protocol/openid-connect/certs
KEYCLOAK_ADMIN_REALM=cloudcrm
KEYCLOAK_ADMIN_CLIENT_ID=cloudcrm-admin
KEYCLOAK_ADMIN_CLIENT_SECRET=change-me
```

Frontend `.env` values:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=cloudcrm
VITE_KEYCLOAK_CLIENT_ID=cloudcrm-frontend
```

## 10. Run the migrations

```bash
cd backend
npm run migrate:keycloak
npm run migrate:manager-role
```

## 11. Optional local development bypass (teammates without Keycloak)

If a teammate wants to run the same project on another PC without setting up Keycloak immediately, you can keep Keycloak code in place and enable a development-only bypass.

Backend `.env`:

```env
NODE_ENV=development
AUTH_DEV_BYPASS=true
# Optional: force a specific local DB user
# DEV_AUTH_EMAIL=admin@yourcompany.com
```

Frontend `.env`:

```env
VITE_AUTH_MODE=dev-bypass
# Optional default user for local sign-in
# VITE_DEV_AUTH_EMAIL=admin@yourcompany.com
```

How it behaves:

- In `dev-bypass`, frontend skips Keycloak redirects and calls backend directly.
- Backend resolves a local DB user (by login email header from frontend, `DEV_AUTH_EMAIL`, or first active user fallback).
- In production (`NODE_ENV=production`), Keycloak is always enforced and bypass is ignored.

## Notes

- CloudCRM still owns business authorization in `scopeGuard.js`.
- Keycloak now owns login, logout, tokens, password reset, and first-login password changes.
- If you need role or user updates to sync back to Keycloak, configure the admin client env vars before using the admin user-management screens.
