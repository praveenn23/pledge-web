# 🚦 Road Safety Pledge Website
### A full-stack pledge portal modeled after MyGov India

---

## 🗂️ Project Structure

```
pledge-website/
├── client/          ← React + Vite + Tailwind CSS
├── server/          ← Node.js + Express backend
└── supabase_schema.sql  ← Database schema
```

---

## ⚡ Quick Start

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Open **SQL Editor** and paste contents of `supabase_schema.sql` → Run
3. Copy your **Project URL** and **service role key** from Settings → API

### 2. Configure Backend

Edit `server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OTP_PROVIDER=demo    # Use 'demo' for testing
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Backend

```bash
cd server
npm run dev
```

### 4. Start Frontend

```bash
cd client
npm run dev
```

Open → http://localhost:5173

---

## 🔐 OTP Providers

| Provider | Config | Notes |
|----------|--------|-------|
| **demo** | `OTP_PROVIDER=demo` | Use OTP **123456** for testing |
| **Twilio** | Set Twilio env vars | Best for international |
| **Fast2SMS** | Set `FAST2SMS_API_KEY` | Best for India (₹) |

---

## 🎯 User Flow

```
Home → PledgeForm → ReadPledge → OTPVerification → Certificate
  1         2            3              4               5
```

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pledge/register` | Register pledge + save to Supabase |
| POST | `/api/otp/send` | Send OTP to mobile |
| POST | `/api/otp/verify` | Verify OTP + generate certificate |
| POST | `/api/pledge/complete` | Mark pledge complete |
| GET | `/api/certificate/:id` | Fetch certificate data |
| POST | `/api/certificate/send-mobile` | Send cert link via SMS |
| POST | `/api/certificate/send-email` | Send cert via email |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express  
- **Database**: Supabase (PostgreSQL)
- **PDF**: jsPDF + html2canvas
- **SMS**: Demo / Twilio / Fast2SMS
- **Email**: Nodemailer (Gmail SMTP)
- **QR Code**: qrcode npm package

---

## 📧 Email Setup (optional)

For email sending, generate a **Gmail App Password**:
1. Google Account → Security → 2-Step Verification → App passwords
2. Generate password for "Mail"
3. Set `EMAIL_USER` and `EMAIL_PASS` in `.env`

---

## 🚀 Production Deployment

- **Frontend**: Deploy `client/` to Vercel/Netlify
- **Backend**: Deploy `server/` to Railway/Render
- Update `CLIENT_URL` in server `.env`
- Update Vite proxy target in `vite.config.js`
