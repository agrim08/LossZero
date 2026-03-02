# LossZero

<div align="center">
  <img src="public/Screenshot 2026-03-03 022350.png" width="600" height="400" alt="LossZero Logo" style="border-radius: 20px" />
  <h1>MINIMIZE LOSS. MAXIMIZE LEARNING.</h1>
  <p>An AI-powered progression tracker for serious Machine Learning practitioners.</p>
</div>

---

## 🚀 The Vision

**LossZero** is not just another task tracker. It's a specialized intelligence system designed to keep you on the steep path of Machine Learning mastery. Built with a data-dense, minimalist aesthetic, it mirrors the intensity of the field it tracks.

## ✨ Core Features

### 🧠 AI-Powered Intelligence

- **Automated Study Briefings**: Every time you mark a topic as complete, the system's **Gemini-Flash** integration generates a high-level technical summary (~300 words) tailored to your progress.
- **Dynamic Hints**: The AI analyzes your completed work and suggests the optimal next objective, ensuring you stay within your zone of proximal development.

### 📊 Advanced Visualization

- **Chrono-Streak Heatmap**: A custom GitHub-style activity grid that flows from **left to right**.
- **Data-Dense Dashboard**: Real-time metrics on your current streak, longest streak, and EOD (End of Day) AI summaries.
- **Interactive Tech Stack**: Premium UI components with scanner effects, glassmorphism, and framer-motion animations.

### 🛠 Flexible Curriculum

- **Custom Modules**: Beyond any standard mastery path, you can deploy your own custom modules directly from the dashboard.
- **Precise Control**: Mark topics as complete, delete irrelevant ones, and manage your learning pipeline with a single click.
- **Expansive Notes**: A dedicated "Daily Notes" section with a "Memory Block" aesthetic and expandable technical insights.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Intelligence**: [Google Gemini API](https://ai.google.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Auth**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (Atlas or local)
- Clerk account for authentication
- Gemini API Key

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/losszero.git
   cd losszero
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/src/app`: Next.js App Router (Routes & Layouts)
- `/src/components`: Reusable UI components (Heatmap, TopicCards, etc.)
- `/src/lib`: Logic & Third-party integrations (Gemini, Streak logic, DB models)
- `/src/api`: Backend API handlers

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><b>LossZero Intelligence Systems v1.2.0-stable</b></p>
</div>
