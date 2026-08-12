# PrimeInfraStudio — Full-Stack MERN Website

A premium, responsive construction & interior design company website, built with the MERN stack.

**Company:** PrimeInfraStudio · President: Akhilesh Yadav · Pune, Maharashtra, India
**Tagline:** "Crafting Spaces. Creating Experiences."

---

## What's inside

```
primeinfrastudio/
├── backend/     Node.js + Express + MongoDB API (JWT auth, CRUD, uploads, email, PDF)
└── frontend/    React + Vite + Tailwind CSS + Framer Motion
```

## Tested status (read this first)

This project was built and verified in a sandboxed environment:

- ✅ All backend dependencies install cleanly (`npm install`)
- ✅ Every backend `.js` file passes a Node syntax check
- ✅ Core logic unit-tested directly: bcrypt hashing, JWT sign/verify, PDF generation (valid PDF output), slugify
- ✅ The Express server boots cleanly and was live-tested: health check, 404 handling, express-validator validation errors, JWT-protected routes correctly returning 401 without a token, and CORS headers all verified working
- ✅ The frontend installs cleanly and **`npm run build` succeeds** producing an optimized, code-split production bundle
- ✅ The production build was served and loaded correctly (correct HTML/meta tags, static assets returning 200)
- ⚠️ **Not tested**: live MongoDB Atlas connectivity and real email delivery via Nodemailer. The sandbox this was built in cannot reach `mongodb.net` or SMTP ports, so end-to-end DB reads/writes and outgoing email must be verified on your machine/server, using your own credentials. Everything is wired correctly on the code side (models, routes, auth) — you just need to supply real connection strings.

## Quick Start

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env: set your MongoDB Atlas URI, JWT secret, and SMTP credentials
npm install
npm run seed     # creates the first admin user + sample services/projects/testimonials
npm run dev       # starts on http://localhost:5000
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173, proxies /api to localhost:5000
```

Visit `http://localhost:5173` for the public site, and `http://localhost:5173/admin/login` for the admin dashboard (login with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`, after running `npm run seed`).

## Environment variables (backend/.env)

See `backend/.env.example` for the full list. The important ones:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `SMTP_HOST/PORT/USER/PASS` | Email credentials (e.g. Gmail App Password) for contact/quote emails |
| `ADMIN_EMAIL/ADMIN_PASSWORD` | Used once by `npm run seed` to create your first admin login |
| `COMPANY_EMAIL` | Where contact/quote notification emails are sent (defaults to the company inbox) |

If SMTP credentials are left blank, the backend will log emails to the console instead of failing — so contact/quote forms still work end-to-end during local development, they just won't send real emails until you add credentials.

## Deploying to production

1. **Database**: Create a free/paid cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), whitelist your server IP, and paste the connection string into `MONGO_URI`.
2. **Backend**: Deploy `backend/` to any Node host (Render, Railway, an EC2/VPS, etc). Set all env vars there. Make sure the `uploads/` folder is either persisted or swapped for cloud storage (S3, Cloudinary) for production durability.
3. **Frontend**: Run `npm run build` inside `frontend/`, then deploy the generated `dist/` folder to any static host (Vercel, Netlify, S3+CloudFront). Set `VITE_API_URL` to your deployed backend URL before building.
4. **Email**: Use a real transactional email provider (SendGrid, Mailgun, AWS SES, or Gmail with an App Password) for reliable delivery.

## Google Sign-In setup

Customers can register/log in with **"Continue with Google"** on `/login` and `/register`, in addition to email/password. This requires a one-time setup:

1. Go to https://console.cloud.google.com/apis/credentials (create a project if you don't have one)
2. Click **Create Credentials → OAuth Client ID**
3. Application type: **Web application**
4. Under **Authorized JavaScript origins**, add every URL you'll run the frontend from, e.g.:
   - `http://localhost:5173` (local dev)
   - `https://yourdomain.com` (production)
5. You do **not** need to add Authorized redirect URIs — this uses Google's newer token-based sign-in flow, not a redirect flow.
6. Copy the generated **Client ID** (looks like `xxxxx.apps.googleusercontent.com`)
7. Add it to **both**:
   - `backend/.env` → `GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com` (create `frontend/.env` by copying `frontend/.env.example` if it doesn't exist yet)
8. Restart both servers

If `VITE_GOOGLE_CLIENT_ID` isn't set, the Google button gracefully shows a small "not configured yet" notice instead of breaking the page — email/password login still works either way.

**How account linking works:** if someone signs up with email/password first and later clicks "Continue with Google" using the same email, their existing account is automatically linked to their Google identity (no duplicate accounts). New Google sign-ins with no matching email create a fresh account automatically — this one button handles both sign-up and sign-in.

## Customer accounts (separate from admin login)

The site now has two independent login systems:

1. **Admin/Editor login** (`/admin/login`) — for your team, managing content via the dashboard.
2. **Customer login** (`/login`, `/register`, `/account`) — for website visitors. Customers can create a free account, then:
   - Submit quote requests and contact messages while logged in, so those submissions are automatically linked to their account
   - View their own quote request history and status (`/account` → "My Quote Requests")
   - View their own message history (`/account` → "My Messages")
   - Update their profile and password

These are backed by a separate `Customer` model/collection (not the `User` model used for admin/editor), a separate JWT auth flow (`/api/customer-auth/*`), and separate token storage in the browser (`pis_customer_token` vs `pis_token`), so an admin login and a customer login can coexist in the same browser without conflict.

Guests can still submit the Get a Quote and Contact forms without any account — logging in is optional and only adds the ability to track submission history.

## Admin Dashboard features

- Analytics overview (projects, services, blogs, testimonials, quotes, messages, applications)
- Full CRUD for Projects, Services, Gallery, Blogs, Testimonials
- Quote request inbox with status tracking + one-click PDF re-download
- Contact message inbox with read/unread tracking
- Career application tracker with resume links and status pipeline
- Profile settings (update name/email, change password)

## Notes on placeholders

- **AI Chatbot**: `frontend/src/components/ChatbotWidget.jsx` is a working UI shell with canned demo replies. Wire it to a real LLM API (Anthropic/OpenAI) through a backend proxy endpoint to make it live.
- **Images**: Sample content uses Unsplash URLs. Replace with your own photography via the admin dashboard's image URL fields (or extend the `/api/upload` endpoint to your own asset pipeline).
- **Google Maps**: `frontend/src/utils/constants.js` has a placeholder `mapEmbedSrc`. Replace with your real embed URL from Google Maps ("Share" → "Embed a map").

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Axios, react-hot-toast, lucide-react
**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, Multer, Nodemailer, PDFKit, express-validator, Helmet, express-rate-limit
