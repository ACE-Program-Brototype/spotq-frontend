# SpotQ Frontend: Cloudflare Pages + AWS Backend Guide

> **Quick Summary:**  
> - **Frontend:** React 19 + Vite hosted on **Cloudflare Pages** (Global CDN, super fast static files).  
> - **Backend:** Microservices hosted on **AWS** (API Gateway / ALB / EC2 / ECS).  
> - **Secrets & Env:** Managed by **Infisical**.  
> - **You:** The Frontend Lead managing everything on the frontend side.

---

## 1. The Big Picture (How Everything Works Together)

```
[ User Browser ]
       |
       +---> 1. Loads HTML/CSS/JS (Static files) ---> [ Cloudflare Pages Edge ]
       |
       +---> 2. Makes API calls (Ky client) ---------> [ AWS API Gateway ] ---> [ Backend Services ]
       |                                                                            | (Users, Orders,
       +---> 3. Realtime WebSockets (Socket.io) -----> [ AWS ALB / Gateway ]        |  Queue, Payments)
```

### Important Rule to Remember:
Cloudflare Pages is a **Static Host** for Vite. There is **no Node.js server running in production** on Cloudflare Pages.  
- In local dev (`vite.config.ts`), Vite proxies `/api/v1` to `localhost:3000`, `3001`, etc.  
- In production, your browser calls the **AWS API URL directly** (`https://api.spotq.com/api/v1`).

---

## 2. Step-by-Step Setup on Cloudflare Pages

### Step 1: Connect Git Repository
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** -> **Create application** -> **Pages** tab -> **Connect to Git**.
3. Select your repository (or frontend repo).

### Step 2: Configure Build Settings
Fill in these exact settings:

| Setting | Value | Why? |
| :--- | :--- | :--- |
| **Framework preset** | `Vite` | Cloudflare optimizes settings for Vite |
| **Root directory** | `frontend` | Because SpotQ has a multi-repo/monorepo folder structure |
| **Build command** | `pnpm run build` | Runs TypeScript check (`tsc -b`) and bundles files (`vite build`) |
| **Build output directory** | `dist` | Where Vite places the ready-to-serve files |

### Step 3: Set Build Environment Variables
In Cloudflare Pages -> **Settings** -> **Environment variables**:

Add these build system variables for both **Production** and **Preview**:
- `NODE_VERSION` = `20.18.0` (or `20`)
- `PNPM_VERSION` = `9`

---

## 3. How Infisical Works with Frontend & Cloudflare Pages

### The Golden Rule of Vite Env Variables:
> ⚠️ **Vite embeds `VITE_*` variables into JavaScript files AT BUILD TIME.**  
> They are **NOT** fetched live from Infisical when a customer opens the website.  
> If you change an env variable, **you must re-deploy/rebuild** the frontend!

### How to Connect Infisical to Cloudflare Pages (Choose 1 method):

#### Method A: Infisical Native Integration (Best & Automatic)
1. Open your [Infisical Dashboard](https://app.infisical.com/).
2. Select your project -> Go to **Integrations**.
3. Choose **Cloudflare Pages**.
4. Authenticate your Cloudflare account and select your project name.
5. Map environments:
   - Infisical `prod` ➡️ Cloudflare Pages `Production`
   - Infisical `dev` or `staging` ➡️ Cloudflare Pages `Preview`
6. Click **Sync**. Now, whenever anyone updates an env variable in Infisical, it automatically updates Cloudflare Pages!

#### Method B: Manual Copy (If integration is not setup)
1. Go to Cloudflare Pages -> **Settings** -> **Environment variables**.
2. Copy values from Infisical and paste them under `Production` and `Preview`.

### SpotQ Frontend Environment Variables List:

| Variable Name | Example Value (Production) | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.spotq.com/api/v1` | Public AWS API Gateway entry point |
| `VITE_WS_URL` | `wss://api.spotq.com` | WebSocket server URL (**must start with `wss://`**) |
| `VITE_CDN_BASE_URL` | `https://spotq-restaurant-files.s3.ap-south-1.amazonaws.com` | AWS S3 Bucket / CDN for restaurant images |
| `VITE_GOOGLE_CLIENT_ID` | `your-google-oauth-client-id` | Google Login Client ID |
| `VITE_LOCATIONIQ_ACCESS_TOKEN` | `your-locationiq-token` | Maps / Address search token |
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | Firebase Web Push Notifications |
| `VITE_FIREBASE_AUTH_DOMAIN` | `spotq-app.firebaseapp.com` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `spotq-app` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `spotq-app.appspot.com` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1234567890` | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:1234567890:web:...` | Firebase App ID |
| `VITE_FIREBASE_VAPID_KEY` | `B...` | Firebase Web Push VAPID Key |

> 🔒 **Security Notice:**  
> Any variable starting with `VITE_` is **public to the world**.  
> **NEVER** put database passwords, AWS secret access keys, JWT secret keys, or payment secret keys in the frontend!

---

## 4. Situation Handling: Real Issues & Exact Solutions

Here are the exact issues you will face in production, why they happen, and how to fix them immediately.

---

### Situation 1: 404 Error when refreshing or opening any page (e.g. `/restaurants` or `/queue/123`)

- **What you see:** Page works fine when clicking around, but if you refresh or send the link to someone, Cloudflare shows `404 | Page Not Found`.
- **Why it happens:** React Router is a Single Page App (SPA). There is only one real HTML file: `index.html`. Cloudflare looks for a real file named `/restaurants/index.html` on the server and cannot find it.
- **The Solution:**
  We added a `_redirects` file in `frontend/public/_redirects` with this single line:
  ```text
  /*    /index.html   200
  ```
  When Vite builds, this file is copied to `dist/_redirects`. Cloudflare Pages reads this and routes all URLs back to `index.html` with status `200`.

---

### Situation 2: Red CORS Errors in Browser Console (`Access to fetch blocked`)

- **What you see:** Red errors in browser DevTools:
  `Access to fetch at 'https://api.spotq.com/api/v1/users' from origin 'https://spotq.pages.dev' has been blocked by CORS policy`.
- **Why it happens:** The frontend domain (`spotq.pages.dev` or `app.spotq.com`) is different from the AWS backend domain (`api.spotq.com`). Browsers block cross-domain requests unless the backend explicitly approves the frontend domain.
  Also, our frontend API client has `credentials: "include"` (for cookies/tokens). With credentials, the backend **cannot** use wildcard `Access-Control-Allow-Origin: *`.
- **The Solution:**
  1. The AWS backend (API Gateway or Load Balancer) must return these exact headers:
     ```http
     Access-Control-Allow-Origin: https://app.spotq.com
     Access-Control-Allow-Credentials: true
     Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
     Access-Control-Allow-Headers: Content-Type, Authorization, Accept
     ```
  2. The AWS backend must respond to `OPTIONS` (preflight request) with status `200` or `204`.
  3. *If you need the backend team to fix this, copy the Jira Bug Card in Section 5 below.*

---

### Situation 3: User logs in, but session is lost on refresh (Cookies not saving)

- **What you see:** Login says "Success", but immediately redirecting to dashboard throws `401 Unauthorized`. User is never logged in.
- **Why it happens:** Cross-Site Cookie Blocking!  
  If frontend is on `spotq.pages.dev` and backend is on `xxxx.amazonaws.com`, modern browsers (Safari, Chrome, iOS) block 3rd-party cookies by default.
- **The Solution (Custom Domains):**
  Frontend and Backend **must share the same parent domain**:
  - Frontend: `https://app.spotq.com` (or `https://spotq.com`)
  - Backend: `https://api.spotq.com`
  - In AWS backend auth response, set cookie domain to `.spotq.com`:
    ```http
    Set-Cookie: refreshToken=xyz; Domain=.spotq.com; Path=/; Secure; HttpOnly; SameSite=Lax
    ```
  Now the browser considers cookies "first-party" and never blocks them.

---

### Situation 4: Real-time Queue updates or WebSockets fail / disconnect

- **What you see:** Live queue number doesn't update, or disconnects every 60 seconds.
- **Why it happens:**
  1. **Mixed Content:** Cloudflare Pages is on `https://`. If `VITE_WS_URL` is set to `http://` or `ws://`, browser blocks it instantly.
  2. **AWS ALB 60-second Timeout:** AWS Application Load Balancers close idle TCP connections after 60 seconds by default.
- **The Solution:**
  1. Make sure `VITE_WS_URL` uses secure protocol:
     - `wss://api.spotq.com` (NOT `ws://` or `http://`).
  2. In AWS ALB settings, ask the DevOps/Backend engineer to increase **Idle Timeout** from `60` seconds to `300` seconds.
  3. Ensure Socket.IO client has ping/pong heartbeat active (SpotQ's `socket.io-client` does this automatically every 25s if backend accepts it).

---

### Situation 5: I changed an env variable in Infisical, but live website didn't change!

- **What you see:** You updated `VITE_API_BASE_URL` in Infisical or Cloudflare Pages, but checking the network tab in the browser shows it still calls the old URL.
- **Why it happens:** Vite compiles variables directly into the `.js` files during build time. Changing the setting doesn't rewrite already compiled JS files.
- **The Solution:**
  1. Go to Cloudflare Pages -> **Deployments**.
  2. On the latest production deployment, click the **Three Dots (...)** on the right.
  3. Click **Retry deployment**.
  4. Cloudflare will run `pnpm run build` again and bake the new variables into the new files.

---

### Situation 6: Cloudflare build fails with TypeScript error (`tsc -b failed`)

- **What you see:** Cloudflare build log fails at `pnpm run build` with type errors in `src/...`.
- **Why it happens:** The build command in `frontend/package.json` is `"build": "tsc -b && vite build"`. TypeScript compiler blocks the build if there are any type discrepancies.
- **The Solution:**
  Before pushing code to your Git branch, always verify the build passes:
  ```bash
  cd frontend
  pnpm run build
  ```
  If there is a type error, fix it locally before pushing to git.

---

### Situation 7: Cloudflare build fails: `pnpm: command not found`

- **What you see:** Build terminates early with command not found.
- **Why it happens:** Cloudflare Pages build image did not enable pnpm automatically.
- **The Solution:**
  In Cloudflare Pages -> **Settings** -> **Environment variables**, make sure these are set:
  - `PNPM_VERSION` = `9`
  - `NODE_VERSION` = `20`
  Or in build command, use:
  ```bash
  corepack enable && pnpm run build
  ```

---

### Situation 8: Pull Request (Preview) deployment breaks while Production works

- **What you see:** When you open a PR, Cloudflare creates a preview link (e.g. `https://branch-123.spotq.pages.dev`), but API calls fail.
- **Why it happens:**
  1. Preview environment variables are empty in Cloudflare Pages.
  2. AWS Backend CORS only allows `https://app.spotq.com`, so it blocks the preview URL `*.pages.dev`.
- **The Solution:**
  1. In Cloudflare Pages -> **Settings** -> **Environment variables**, make sure the **Preview** tab has the same variables filled in (pointing to your Staging or Dev AWS backend).
  2. In AWS Staging API Gateway, allow CORS for `https://*.pages.dev` so preview builds can talk to staging.

---

## 5. Non-Frontend Bug Handling: Jira Bug Card Template

Per project standards, if an issue is in AWS (API Gateway, ALB, CORS, Cookies, Microservices), **do NOT try to hack the frontend to work around backend flaws**. Create a Jira Bug card using this exact format:

```markdown
### [BUG] AWS API Gateway: Enable CORS & Credentials for Cloudflare Pages

* **Service:** `spotq-api-gateway` / `spotq-user-service`
* **Severity:** High (Blocks Production Frontend Deployment)
* **Environment:** Staging / Production

#### Context
SpotQ frontend is hosted on Cloudflare Pages (`https://app.spotq.com` and `https://*.pages.dev`). The frontend API client makes cross-origin requests with `credentials: "include"`.

#### Problem / Root Cause
Requests to `https://api.spotq.com/api/v1/*` are rejected by the browser due to missing or invalid CORS headers. 
Wildcard `*` cannot be used when `credentials: true`.

#### Reproduction Steps
1. Open `https://app.spotq.com` or `https://<preview>.spotq.pages.dev`.
2. Attempt login or call any authenticated endpoint.
3. Open DevTools Console -> Observe CORS policy block error.

#### Acceptance Criteria
* [ ] API Gateway returns `Access-Control-Allow-Origin: https://app.spotq.com` (and allowed preview origins).
* [ ] API Gateway returns `Access-Control-Allow-Credentials: true`.
* [ ] API Gateway returns `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`.
* [ ] API Gateway returns `Access-Control-Allow-Headers: Content-Type, Authorization, Accept`.
* [ ] HTTP `OPTIONS` preflight requests return HTTP `200` or `204`.
* [ ] Cookies set with `Domain=.spotq.com; SameSite=Lax; Secure; HttpOnly`.
```

---

## 6. Daily Frontend Lead Cheatsheet

### 1. Working Locally
```bash
cd frontend
infisical run -- pnpm dev
```
Runs Vite dev server with proxy to local services or AWS staging.

### 2. Ready to Deploy
1. Check that your local build passes:
   ```bash
   cd frontend
   pnpm run build
   ```
2. Commit your code and push to `development` or `main`.
3. Cloudflare Pages automatically detects the push and starts the build.

### 3. If Something Breaks on Live Site:
1. **404 on page refresh?** ➡️ Check that `public/_redirects` exists in `frontend/public/_redirects`.
2. **Red API errors in console?** ➡️ Check CORS in AWS and check that `VITE_API_BASE_URL` in Cloudflare Pages matches your AWS API URL.
3. **Socket disconnected?** ➡️ Check `VITE_WS_URL` starts with `wss://`.
4. **Env changed in Infisical but not updating?** ➡️ Go to Cloudflare Pages -> Deployments -> Click **Retry deployment**.
