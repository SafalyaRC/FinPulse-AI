<p align="center">
  <img src="public/assets/images/logo.svg" alt="FinPulse AI Logo" width="240" height="220" />
</p>

<h1 align="center">FinPulse AI — The Future of Smart Financial Insights</h1>
<p align="center">
  <a href="https://finpulse-ai-app.vercel.app"><img alt="Live Site" src="https://img.shields.io/badge/Live-Demo-6E40C9?style=flat-square&logo=vercel&logoColor=white"></a>
  <a href="https://github.com/SafalyaRC/FinPulse-AI/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/SafalyaRC/NovaSuite-AI?color=purple&style=flat-square"></a>
  <img alt="Maintained" src="https://img.shields.io/badge/Maintained%3F-Yes-44cc11?style=flat-square">
  <img alt="License" src="https://img.shields.io/github/license/SafalyaRC/FinPulse-AI?style=flat-square&color=orange">
</p>

<p align="center">
  FinPulse AI is an intelligent financial monitoring and analytics platform that leverages 
  <b>AI-driven insights</b>, <b>real-time market tracking</b>, and <b>predictive analysis</b> 
  to help users stay ahead of financial trends. 
  With a seamless modern UI and a data-rich experience, FinPulse AI redefines 
  how investors and analysts engage with market intelligence.
</p>

---

## ⚙️ Core Features

### Secure Authentication

- FinPulse-AI implements a robust authentication and authorization layer to ensure enterprise-grade security and data integrity across all user sessions.
- Built on NextAuth.js, leveraging JWT-based authentication with HTTP-only cookies for session persistence.
- Implements middleware-based route protection in the App Router layer to ensure that only authenticated users can access protected routes (e.g., /dashboard, /watchlist).
- Features bcrypt-hashed passwords and secure email/password-based registration flows.
- Ready for multi-provider (OAuth 2.0) expansion (e.g., Google, GitHub) with minimal reconfiguration.
- Session tokens are encrypted and validated server-side via middleware interceptors, preventing unauthorized API calls and CSRF risks.
- Integrated with MongoDB session persistence to maintain consistent state across server restarts and deployments.

### 📊 Personalized Watchlist

- A fully persistent, user-specific stock tracking system that empowers users to curate and monitor their personal portfolios.
- Built atop MongoDB using an object-relational schema design where each user document maintains a dedicated watchlist array.
- Provides real-time updates by syncing with Finnhub’s quote endpoint for dynamic price and market data retrieval.
- The UI layer uses React Server Components + Client Hydration for near-instant rendering and update efficiency.
- Optimistic UI pattern for instant feedback when adding/removing stocks, synchronized asynchronously with backend persistence.
- Leverages SWR (stale-while-revalidate) strategy for seamless caching and background refresh of watchlist data.
- Contextually integrated with each /stocks/[symbol] page — enabling one-click watchlist modification without page reloads.

### ⚡ Real-Time Price Alert System

- An event-driven alerting mechanism enabling users to define custom thresholds on stock prices with automated notifications.
- Users can create alerts using simple conditions such as "Price > $150" or "Price < $120".
- Each alert is stored in MongoDB and monitored by an Inngest background workflow that periodically fetches live prices via the Finnhub API.
- When a trigger condition is met, an event dispatch is raised and processed through Inngest’s queueing system, invoking an email workflow built with Nodemailer.
- Supports automated retries, debounced event handling, and guaranteed delivery for fault-tolerant execution.
- The system is horizontally scalable, with isolated event handlers capable of managing thousands of user alerts concurrently.
- Notification payloads include stock symbol, trigger type, timestamp, and live market snapshot for user context.

### 📈 Comprehensive Stock Analysis

- The /stocks/[symbol] route serves as a fully dynamic financial intelligence workspace, aggregating technical and fundamental data.
- Integrates multiple TradingView widgets, including:
- Candlestick charts (real-time)
- Technical analysis panels (RSI, MACD, Bollinger Bands)
- Company profile and balance sheets
- Baseline and comparative performance charts
- Auto-refreshes every 30 seconds using server-pushed updates from the Finnhub API.
- Displays detailed financial fundamentals including:
-- Market Cap
-- P/E Ratio
-- EPS
-- Dividend Yield
-Yearly and quarterly performance deltas
- Implements suspense boundaries and lazy-loading widgets for data-heavy components.
- Built with error boundaries and fallback loaders, ensuring smooth UX even during API latency.
- Supports direct Watchlist integration with instantaneous add/remove toggle from the same interface.

### 🔍 Advanced Search & Discovery

- A global search command palette that offers high-speed, intelligent stock discovery across thousands of tickers.
- Invoked via keyboard shortcut (Cmd + K / Ctrl + K).
- Utilizes debounced asynchronous queries to the Finnhub Symbol API, minimizing redundant requests and API overhead.
- Results render instantly with progressive enhancement and virtualized lists for optimal performance.
- Supports instant navigation to /stocks/[symbol] and inline “Add to Watchlist” action without breaking user flow.
- Integrated with server caching (Next.js ISR) to prevent rate limit issues on repeated queries.

## 🧠 AI & Data Intelligence

### AI-Powered News Summaries

- FinPulse-AI integrates a fully automated, AI-driven content pipeline for personalized market intelligence.
- Scheduled Inngest workflows trigger daily AI summarization jobs.
- For each user, the system retrieves:
- User’s watchlist tickers.
- Latest relevant news articles from Finnhub News API.
- Passes the compiled dataset into Google Gemini API (via REST interface).
- Gemini then generates personalized market briefings, summarized in human-like tone and formatted in HTML for email dispatch.
- Email delivery is handled asynchronously via Nodemailer SMTP transport, ensuring guaranteed delivery with retry logic.
- The architecture ensures event isolation — each user’s AI summary is an independent, traceable event run.
- Future-ready design allows multi-model fallback (e.g., Gemini → OpenAI → Claude) via dynamic routing.

### 💹 Live Market Dashboard

- A real-time market analytics interface presenting global and sectoral insights at a glance.
- Displays a dynamic performance graph of major indices (S&P 500, NASDAQ 100, etc.) with real-time updates.
- Users can switch timeframes (1D, 1M, 1Y) — powered by stateful UI caching and chart re-render optimization.
- Integrates a sector-wise stock heatmap, generated by aggregating Finnhub data into color-coded visualizations.
- Includes a Top Stories feed, sourcing live financial news articles and filtering by relevance, recency, and sentiment.
- The entire dashboard operates on server-side data fetching, providing SSR-rendered, SEO-optimized content for crawlers.

### ⚙️ Real-Time API Integration

- All market, financial, and company data is fetched via Finnhub’s RESTful APIs.
- Implements response caching and throttling to reduce rate-limit collisions.
- Uses Next.js API routes as proxy layers to sanitize, cache, and compress outgoing responses.
- Data integrity is ensured via schema validation with TypeScript interfaces and runtime checks.
- Integrates incremental static regeneration (ISR) for caching non-volatile company profiles and historical data, improving TTFB (Time to First Byte) significantly.

### 🏗️ Architecture & Performance

- Built on Next.js 14 with the App Router architecture and Server Components, ensuring modern performance benchmarks and scalability.
- Implements SSR (Server-Side Rendering) for SEO-critical routes (e.g., stock pages, company profiles).
- Uses RSC + Client Components hybrid model for real-time reactivity without excessive hydration costs.

### 🧾 Language & Database

- Developed entirely in TypeScript — providing full compile-time type safety across backend and frontend boundaries.
- MongoDB Atlas serves as the persistent datastore, accessed through Mongoose ORM for schema validation and relationship management.
- Connection pooling and retry logic implemented in /database/mongoose.ts ensure stable runtime connectivity under serverless environments.

### 🧭 Event-Driven Workflows

- FinPulse’s backend automation runs on Inngest, an event orchestration framework enabling async, reliable workflows.
- Defined event pipelines include:
- user.created → Trigger welcome email.
- alert.triggered → Send price alert notification.
- daily.news.summary → Generate and email AI summaries.
- Workflows are idempotent, retryable, and observed, ensuring system reliability even in transient API failures.
- Each event function runs with isolated context, maintaining clean separation between user tasks.

### ⚡ Performance Optimization

- Employs dynamic imports and code-splitting to minimize initial payload.
- Debounced API calls prevent redundant network requests during rapid user input (e.g., global search).
- API caching layer for Finnhub endpoints reduces latency by 50–70%.
- Uses Next.js streaming and suspense boundaries for non-blocking UI rendering.
- Implements image optimization and lazy loading for all chart and visualization assets.

### 🔒 Security Model

- Complete input validation on every API endpoint (both client and server).
- Sensitive keys secured via environment variables in .env.local (never exposed to client).
- CSRF-safe authentication flow with secure cookies.
- Rate limiting applied to user input endpoints (e.g., search and alert creation).
- All database operations are user-scoped — no global access patterns.

### 🌑 User Experience (UX/UI)

- Crafted with Tailwind CSS, Shadcn/UI, and Framer Motion for a refined, dark, modern visual language.
- Fully responsive — optimized layouts for desktop, tablet, and mobile.
- Adaptive color contrast and smooth transitions for enhanced readability and engagement.

### 🔄 Interactive Feedback

- Features live toast notifications for CRUD operations (add/remove from watchlist, alert creation, etc.).
- Uses Suspense + skeleton loaders for API-dependent content.
- Includes loading spinners and progress indicators during async operations.
- Clear visual feedback ensures that users always know the app’s state and progress.

### 🧩 Graceful Error Handling

- Centralized error boundary system for UI and API layers.
- Displays human-friendly fallback UI states when APIs fail or data is unavailable.
- Logs critical failures to server console and Inngest function logs for postmortem analysis.
- Ensures that even under network degradation, users retain a seamless and intuitive experience.

--- 

## 🧩 Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | React.js, Next.js 14, TypeScript, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **AI & Data** | Gemini API (AI-based summarization), Cron jobs for market & news updates |
| **Auth** | NextAuth.js (Google + Email Sign-in) |
| **Styling/UI** | ShadCN/UI, Tailwind CSS, Dark Professional Theme |
| **Deployment** | Vercel (Frontend) + Render/Atlas (Backend & Database) |

---

## 🛠️ Setup & Installation

#### 1️⃣ Clone the Repository
```
git clone https://github.com/your-username/FinPulse-AI.git
cd FinPulse-AI
```
#### 2️⃣ Install Dependencies
```
npm install
```
#### 3️⃣ Configure Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER=smtp.yourmailprovider.com
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```
#### 4️⃣ Run the Development Server
```
npm run dev
```
| Your app should now be live at `http://localhost:3000`

---

## 🧠 Architecture Overview

```
FinPulse AI
│
├── Frontend (Next.js + React)
│   ├── Components
│   ├── Pages
│   ├── Styles
│   └── AI Integrations (via server actions)
│
├── Backend (Node.js + Express)
│   ├── Controllers
│   ├── Routes
│   ├── Models
│   └── Cron Jobs
│
├── Database (MongoDB Atlas)
│   └── Users, News, Watchlists, Alerts, and Email logs
│
└── AI Layer
    ├── AI-Based Summarization
    ├── Sentiment Classification
    └── Automated Email Generation
```

---

## 👨‍💻 Developer

- Safalya RC — Full-stack Engineer, focused on AI-driven systems, intelligent automation, and high-performance applications.
- [LinkedIn](https://www.linkedin.com/in/safalyarc/)
- [Email](safalyaroy9463@gmail.com)

---

## 💼 Why FinPulse-AI Matters

FinPulse-AI is more than a project — it’s a demonstration of system design maturity. It integrates live data, AI workflows, real-time UI, and event-driven automation — a combination few projects achieve at this stage.

| 💡 _A true full-stack AI-fintech platform built for production._

---
