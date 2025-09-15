# 🏡  Buyers Hub 

A mini CRM-like app to **capture, list, and manage buyer leads** with validation, search/filter, and CSV import/export.  
Built as part of the assignment using **React.js (frontend)**, **Node.js + Express + Prisma (backend)**, and **PostgreSQL**.

---

## ✨ Features

### Core
- Agent/Admin authentication (signup & login).
- CRUD operations for **Buyers (Leads)**.
- Server-side pagination (10 per page).
- Filtering and search by name, phone, email, city, propertyType, etc.
- CSV **Export** (filtered list) and **Import** (with per-row validation).
- **Buyer History**: logs last 5 field changes (old → new, who, when).
- Validation rules with **Zod** (both client & server).
- Ownership checks:  
  - Agents can only edit/delete their own leads.  
  - Admin (optional) can edit all.

### Bonus
- Animated UI using **Framer Motion**.
- Toast notifications for feedback.
- Optimistic concurrency with `updatedAt`.

---

## 🛠️ Tech Stack

- **Frontend:** React.js + TailwindCSS + Axios + Framer Motion  
- **Backend:** Node.js + Express + Prisma ORM  
- **Database:** PostgreSQL (works with Supabase too)  
- **Validation:** Zod  
- **Auth:** Simple email/password (JWT)  


---

## 🗂️ Data Model

### buyers
- `id` (uuid)  
- `fullName` (string, 2–80)  
- `email` (optional)  
- `phone` (string, 10–15; required)  
- `city` (`Chandigarh|Mohali|Zirakpur|Panchkula|Other`)  
- `propertyType` (`Apartment|Villa|Plot|Office|Retail`)  
- `bhk` (`1|2|3|4|Studio`, optional)  
- `purpose` (`Buy|Rent`)  
- `budgetMin` / `budgetMax` (int, optional; `budgetMax ≥ budgetMin`)  
- `timeline` (`0-3m|3-6m|>6m|Exploring`)  
- `source` (`Website|Referral|Walk-in|Call|Other`)  
- `status` (`New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped`) – default `New`  
- `notes` (≤ 1,000 chars)  
- `tags` (string[])  
- `ownerId` (user id)  
- `updatedAt` (timestamp)  

### buyer_history
- `id`  
- `buyerId`  
- `changedBy`  
- `changedAt`  
- `diff` (JSON: `{ field: { old, new } }`)  

---

## 🚀 Clone & Run Locally

1. Clone the repo
   ```bash
     git clone https://github.com/SatynarayanMaurya/Buyers-Hub.git
     cd Buyers-Hub
    ```
2. Setup Backend
   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   npx prisma generate
    ```
3. Setup Frontend
   ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
4. 📌 Backend → backend/.env
   ```bash
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/buyerdb?schema=public"
    JWT_SECRET="supersecretkey"
    PORT=4000
    NODE_ENV ="development"
    FRONTEND_URL = "http://localhost:5173"
    ```
5. 📌 Frontend → frontend/.env
   ```bash
    VITE_BACKEND_URL = "http://localhost:4000"
    ```

---

This way, when someone clones the repo, they’ll know **exactly what to do step by step**.  

Do you also want me to **generate `.env.example` files** for both frontend and backend so users know which env variables are required?

