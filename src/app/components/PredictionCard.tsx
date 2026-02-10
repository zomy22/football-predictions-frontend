import React from 'react';
import Image from 'next/image';

interface Prediction {
  fixture_id: number;
  league_name: string;

  home_team_name: string;
  away_team_name: string;
  home_team_logo?: string;
  away_team_logo?: string;

  kickoff_time?: string; // "19:45"
  status?: 'NS' | 'LIVE' | 'FT';

  goals_home?: number | null;
  goals_away?: number | null;

  prediction_selection: string;
  prediction_raw_advice: string;
  prediction_confidence: string;

  outcome: string | null; // ✅ ❌ null
}

interface PredictionCardProps {
  prediction: Prediction;
  showOutcome?: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, showOutcome = true }) => {
  const {
    league_name,
    home_team_name,
    away_team_name,
    home_team_logo,
    away_team_logo,
    kickoff_time,
    status = 'NS',
    goals_home,
    goals_away,
    prediction_selection,
    prediction_confidence,
    outcome
  } = prediction;

  const confidenceValue = parseFloat(prediction_confidence);

  const confidenceColor =
    confidenceValue >= 80
      ? 'bg-green-600'
      : confidenceValue >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const statusLabel =
    status === 'LIVE'
      ? 'LIVE'
      : status === 'FT'
      ? 'FT'
      : kickoff_time || '--:--';

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">

      {/* Outcome badge (controlled by showOutcome prop) */}
      {showOutcome && outcome && (
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full
          ${
            outcome === '✅'
              ? 'bg-green-100 text-green-700'
              : outcome === '❌'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700' // Neutral for PENDING
          }`}
        >
          {outcome === '✅' ? 'WON' : outcome === '❌' ? 'LOST' : 'PENDING'}
        </span>
      )}

      {/* Status row */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span
          className={`font-medium ${
            status === 'LIVE' ? 'text-red-600 animate-pulse' : ''
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Match row */}
      <div className="grid grid-cols-3 items-center text-center my-3">
        <div className="flex items-center justify-end gap-2">
          <Image
            src={home_team_logo || '/globe.svg'}
            alt={home_team_name}
            width={28}
            height={28}
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {home_team_name}
          </span>
        </div>

        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {(goals_home != null || goals_away != null)
            ? `${goals_home ?? 0} – ${goals_away ?? 0}`
            : 'vs'}
        </div>

        <div className="flex items-center justify-start gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {away_team_name}
          </span>
          <Image
            src={away_team_logo || '/globe.svg'}
            alt={away_team_name}
            width={28}
            height={28}
          />
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-2" />

      {/* Prediction row */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Pick</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {prediction_selection}
          </p>
        </div>

        {!isNaN(confidenceValue) && (
          <span
            className={`text-xs text-white px-2 py-1 rounded ${confidenceColor}`}
          >
            {confidenceValue}%
          </span>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;