# movie-finder-srikar

A modern, highly interactive, and premium movie discovery application built using **Next.js 16.2.9**, **React 19**, **Tailwind CSS v4**, and **TypeScript**. Powered by the TMDB API.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18.x or later) installed on your system.

### 2. Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/srikar9246/movie-finder-srikar.git
cd movie-finder-srikar
```
*(Note: Please ensure your remote repository name is set to `movie-finder-srikar` to satisfy the assignment requirements).*

### 3. Install Dependencies
Install all the project dependencies:
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of the project:
*(You can replace the API key above with your personal TMDB v3 API key if needed).*

### 5. Start Development Server
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Build for Production
To create an optimized production build of the project:
```bash
npm run build
npm run start
```

---

## 🛠️ Core Features

1. **Browse**: Responsive grid displaying movie posters/backdrops, titles, release years, and average ratings.
2. **Live Search**: Real-time debounced search by movie title as you type.
3. **Details Modal**: Interactive backdrop-themed details modal showing the full overview, release date, and ratings.
4. **Favorites Manager**: Save or remove movies to/from a favorites list. Persisted locally via `localStorage`.
5. **Interactive UI States**: Loading animations (spinners), descriptive error alerts, and clean empty states for both tabs.

---

## 📋 Specific Assignment Requirements

- **R1 (Pagination)**: Implemented Next/Prev pagination delivering exactly 12 results per page (with no infinite scroll) on both the Browse (TMDB API) and Favorites (local state) tabs.
- **R2 (Project Naming)**: Project renamed to `movie-finder-srikar` (all lowercase) in the configurations.
- **R3 (AI Log File)**: Created `AI_LOG.md` in the root folder containing the tools used, strongest prompts, and list of manual improvements.
- **R4 (Footer text)**: Homepage footer displays the exact text: `Built for Jeevan — Srikar`.
