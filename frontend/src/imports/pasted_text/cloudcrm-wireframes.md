Create a set of low fidelity wireframes for a web and mobile 
application called CloudCRM — a marketing analytics dashboard 
for a digital agency and their clients. Use grey boxes, simple 
labels, no colors, no icons, no styling. Black and white only.

Generate the following 5 screens:

────────────────────────────────────────
SCREEN 1 — Login Page (Desktop + Mobile)
────────────────────────────────────────

Single login page for both user types. No signup link anywhere.

Desktop:
- Centered card on a plain background
- CloudCRM logo placeholder at top
- Toggle at the top of the card with two options:
  "I'm from the Agency" and "I'm a Client"
  Only one can be selected at a time.
- Label: "Welcome back"
- Email input field
- Password input field with show/hide toggle
- "Login" button full width
- Small text below: "Forgot password?"
- No sign up link

Mobile:
- Same layout, full screen card
- Toggle is full width with two large tap targets
- Larger input fields and button

────────────────────────────────────────────────────────────
SCREEN 2 — First Login — Change Password (Desktop + Mobile)
────────────────────────────────────────────────────────────

Shown to any user logging in for the first time.

Desktop:
- Centered card
- Label: "Set your password"
- Subtext: "This is your first login. Please set a new password 
  before continuing."
- New password input field
- Confirm password input field
- "Set Password and Continue" button full width

Mobile:
- Same layout full screen

────────────────────────────────────────────────────────────
SCREEN 3 — Agency Admin Dashboard (Desktop + Mobile)
────────────────────────────────────────────────────────────

Used by Riya, an agency manager handling 12+ clients across 
Google Ads, Meta Ads, and Mailchimp. Technically advanced. 
Information density is fine. Speed and scannability matter most.

Show an empty state banner at the top when a client has been 
added but no platform credentials are connected yet:
"Client setup incomplete — connect platform accounts to start 
seeing data" with a "Complete Setup" button.

Desktop:
- Top navbar: logo left, client switcher dropdown center, 
  notification bell right, avatar right
- Left sidebar: Dashboard, Clients, Campaigns, Reports, 
  Sync Status, Settings
- Main content area:
  - Page title "Agency Overview"
  - 4 summary cards: Total Spend, Avg ROAS, 
    Active Clients, Total Campaigns
  - Table: Client Performance — columns: Client Name, 
    Total Spend, ROAS, Leads, Active Campaigns, 
    Budget Status, Setup Status
  - Bar chart placeholder: Spend by Platform
  - Bottom right: "Last synced: today 9:42am"

Mobile:
- Top bar: hamburger left, logo center, avatar right
- Empty state banner if applicable
- 4 summary cards stacked full width
- Client cards: Name, Spend, Setup Status
- Platform spend horizontal bar chart placeholder

────────────────────────────────────────────────────────────
SCREEN 4 — Add Client + Connect Platform Accounts
────────────────────────────────────────────────────────────

3 step onboarding flow for adding a new client.

Step 1 — Client Details:
- Input: Client Business Name
- Input: Industry
- Input: Monthly Budget
- Input: Client Login Email
- Note: "A temporary password will be generated after this step"
- "Next" button

Step 2 — Connect Platforms:
- Three rows: Google Ads, Meta Ads, Mailchimp
- Each row: platform name, API key input, "Test Connection" button
- Manual / CSV upload toggle as alternative
- "Connect and Continue" button

Step 3 — Done:
- Label: "Client added successfully"
- Temporary password in a box with a "Copy" button
- Instruction: "Share this with your client. They will be asked 
  to change it on first login."
- "Go to Client Dashboard" and "Add Another Client" buttons

────────────────────────────────────────────────────────────
SCREEN 5 — Client Dashboard (Desktop + Mobile)
────────────────────────────────────────────────────────────

Used by client representatives aged 30 to 40 who work at or 
own businesses that the agency manages. They are comfortable 
with charts, graphs, and marketing data. They want visual proof 
that their ad spend is working. The dashboard should feel 
professional, data-rich, and visually informative — similar 
to what you would expect from Google Analytics or Meta Ads 
Manager but cleaner and focused only on their own data.

Labels stay in plain English but depth of data increases.

Desktop:
- Top navbar only, no sidebar. Logo left, business name center, 
  avatar and logout right.
- Page title "Campaign Overview"
- Date range selector top right: This Week / This Month / 
  Last 3 Months / Custom

- Row of 4 summary cards:
  Money Spent, Leads Generated, People Reached, Cost per Lead.
  Each card: label top, large number center, percentage change 
  vs previous period below with up or down arrow.

- Two charts side by side below the cards:
  Left: Line chart placeholder titled 
  "Performance Over Time" — shows Spend, Leads, Reach 
  as separate lines over the selected date range.
  Right: Donut chart placeholder titled 
  "Spend by Platform" — Google Ads, Meta Ads, Mailchimp 
  as segments with legend below.

- Campaign table below the charts with columns:
  Campaign Name, Platform, Money Spent, Leads, 
  People Reached, Cost per Lead, Status (Active / Paused).
  Each row has a coloured status dot.

- Button at bottom: "Download Monthly Report"

Mobile:
- Top bar: logo left, avatar right
- Date range selector below top bar full width
- 4 summary cards stacked full width with percentage change visible
- Line chart placeholder full width: Performance Over Time
- Donut chart placeholder full width: Spend by Platform
- Campaign list as stacked cards:
  Campaign name, platform, key metrics, status dot
- "Download Monthly Report" pinned full width at bottom

────────────────────────────────────────
LAYOUT NOTES
────────────────────────────────────────

- Show desktop and mobile side by side for every screen
- Low fidelity only — grey boxes and labels, no color, no icons
- Agency dashboard is information dense with sidebar navigation
- Client dashboard is visually rich with charts and a clean 
  professional layout — no sidebar
- Login toggle clearly separates the two user entry points
- Label every frame: Login, First Login, Agency Dashboard, 
  Add Client, Client Dashboard