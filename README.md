# Football Predictions Frontend

A modern web application for viewing and tracking football match predictions with real-time outcomes and hit rate statistics.

## Features

- **Daily Predictions**: Browse predictions for any date with an intuitive date navigator
- **League Grouping**: Predictions are automatically grouped by country and league for easy browsing
- **Outcome Tracking**: View match outcomes (won ✅ / lost ❌) for past matches with predictions
- **Confidence Scoring**: Visual confidence indicators (green/yellow/red) for each prediction
- **Hit Rate Analytics**: Track overall prediction accuracy with summary statistics
- **Dark Mode**: Built-in theme switcher for comfortable viewing in any lighting condition
- **Responsive Design**: Fully responsive grid layout for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16.1.6 with Turbopack
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

Create an optimized production build:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main predictions page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── components/
│   │   ├── PredictionCard.tsx    # Individual prediction card
│   │   ├── DateNavigator.tsx     # Date selection component
│   │   ├── HitRate.tsx           # Hit rate statistics display
│   │   └── ThemeSwitcher.tsx     # Dark/light mode toggle
│   └── context/
│       └── ThemeContext.tsx      # Theme management
├── lib/
│   └── supabase.ts           # Supabase client and queries
```

## API Integration

The application connects to a Supabase database to fetch:
- `predictions` - Match predictions with metadata
- `prediction_reports` - Aggregated hit rate statistics

## License

MIT
