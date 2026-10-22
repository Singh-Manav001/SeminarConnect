# SeminarConnect 🎓
> Educational Seminar & Workshop Marketplace connecting School Principals, Colleges, and Higher Education Institutions with Verified Subject Matter Experts and Guest Speakers.

---

## 🌟 Overview

**SeminarConnect** is a full-stack educational technology marketplace built to streamline how schools, polytechnics, colleges, and coaching academies discover, evaluate, book, and fund certified guest faculty and workshop trainers.

- **For Institutions (School Principals & Deans)**: Find verified experts mapped to curriculum and NEP-2020 experiential learning tracks, post requests on the Seminar Requirement Board, book with real-time distance calculations, and download official GST tax invoices with escrow payment protection.
- **For Candidate Speakers (Researchers & Trainers)**: Showcase credentials, syllabus packages, and video portfolios; manage availability calendars without double-booking; receive and accept institutional booking requests; and track INR payouts.
- **For Directorate Administrators**: Approve background verifications, oversee bookings, manage 12 curriculum-aligned categories, resolve disputes, and configure platform commissions.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 App Router](https://nextjs.org/) (Server Components & API Routes)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict type safety)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) (Navy blue, Indigo, and Subtle Teal aesthetic)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL 22+ tables, Row Level Security policies, relational indexes) with dual-mode zero-config persistent local fallback store (`.data/seminar_connect_db.json`)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Geocoding & Proximity**: Haversine distance calculator with Indian cities coordinate database
- **Payments**: Indian Rupee (INR ₹) transaction engine with Razorpay escrow support & verified signature test mode
- **Testing**: [Playwright](https://playwright.dev/) End-to-End browser test suite

---

## 👥 Pre-configured Demo Accounts

For fast local testing and demonstration, use the 1-click test buttons on the `/login` screen or the top sandbox switch bar:

| Role | Name & Title | Email | Password |
|---|---|---|---|
| **Principal** | Dr. Rajesh Sharma (Principal, DPS R.K. Puram) | `principal@dps-delhi.edu` | `Password123!` |
| **Principal** | Dr. Meenakshi Sundaram (Dean, National College) | `dean@national-college.edu` | `Password123!` |
| **Speaker** | Dr. Ananya Roy (Lead AI Researcher, Ex-IISc) | `ananya.ai@seminarconnect.com` | `Password123!` |
| **Speaker** | Vikramaditya Verma (Robotics & IoT Expert, IITD) | `vikram.iot@seminarconnect.com` | `Password123!` |
| **Speaker** | Priya Nair (Executive Career Strategist, XLRI) | `priya.career@seminarconnect.com` | `Password123!` |
| **Admin** | Central Directorate (Marketplace Administrator) | `admin@seminarconnect.com` | `AdminSecret2026!` |

---

## 🗄️ Database Design & Supabase Migrations

The complete database schema is located in `supabase/migrations/20261022000001_seminarconnect_schema.sql` and includes 22 normalized tables:

1. `profiles`
2. `institutions`
3. `candidate_profiles`
4. `categories`
5. `skills` & `candidate_skills`
6. `seminar_offerings`
7. `qualifications`
8. `verification_documents`
9. `service_locations`
10. `availability_slots`
11. `seminar_requirements`
12. `bookings` (with candidate double-booking concurrency index)
13. `booking_status_history`
14. `payments`
15. `refunds`
16. `payouts`
17. `conversations` & `messages`
18. `notifications`
19. `favorites`
20. `reviews`
21. `disputes`
22. `platform_settings` & `admin_audit_logs`

### 12 Database-Backed Categories:
- C and C++ Programming
- HTML, CSS, JavaScript, and Web Development
- Python, Java, and App Development
- Artificial Intelligence and Machine Learning
- Data Science and Cybersecurity
- Robotics and Internet of Things
- Science and Mathematics
- Career Guidance and Interview Preparation
- Communication and Personality Development
- Entrepreneurship and Financial Literacy
- Digital Marketing and Design
- Other Custom Topics

---

## 🚀 Getting Started

### 1. Installation

```bash
cd seminar-connect
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 3. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Run Playwright End-to-End Tests

```bash
npx playwright test
```

---

## 💳 Indian Payments & Escrow Model

1. **Fee Calculation**: Base Seminar Fee + Travel Allowance (if offline, calculated via distance × per-km rate) + 10% Platform Escrow Fee + 18% GST on platform services = Total Payable.
2. **Escrow Guarantee**: Funds remain in escrow until the host principal marks the seminar delivered.
3. **Cancellation Policy**: Full 100% refund up to 48 hours prior to seminar start time.
4. **GST Tax Invoices**: Printable official invoice with SAC code 999293 and GSTIN.
