// webapp/src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PredictionCard from './components/PredictionCard';
import DateNavigator from './components/DateNavigator';
import HitRate from './components/HitRate';
import ThemeSwitcher from './components/ThemeSwitcher'; // Import ThemeSwitcher
import { getPredictionsByDate, getPredictionReportByDate, SupabasePredictionReport } from '../../lib/supabase';

interface Prediction { // <--- RESTORING THIS INTERFACE
  fixture_id: number;
  prediction_date: string;
  league_name: string;
  league_country: string; // Added for grouping
  home_team_name: string;
  away_team_name: string;
  prediction_selection: string;
  prediction_raw_advice: string;
  prediction_confidence: string;
  outcome: string | null;
  home_team_logo?: string;
  away_team_logo?: string;
}

export default function Home() {
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hitRate, setHitRate] = useState<number | null>(null);
  
  // State to hold grouped predictions
  const [groupedPredictions, setGroupedPredictions] = useState<Record<string, Prediction[]>>({});

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      setHitRate(null);
      setGroupedPredictions({}); // Clear previous groups
      try {
        console.log('Fetching predictions for date:', selectedDate);
        const fetchedPredictions = await getPredictionsByDate(selectedDate);
        const predictionsWithOutcomes: Prediction[] = fetchedPredictions || [];

        if (fetchedPredictions) {
          const report: SupabasePredictionReport | null = await getPredictionReportByDate(selectedDate);
          if (report && report.summary_statistics) {
            if (report.summary_statistics.hit_rate) {
              setHitRate(parseFloat(report.summary_statistics.hit_rate));
            }
          }
        }
        setPredictions(predictionsWithOutcomes);

        // Group predictions by Country - League
        const groups: Record<string, Prediction[]> = predictionsWithOutcomes.reduce((acc, prediction) => {
          const groupKey = `${prediction.league_country} - ${prediction.league_name}`;
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(prediction);
          return acc;
        }, {} as Record<string, Prediction[]>);
        setGroupedPredictions(groups);

      } catch (err) {
        console.error('Failed to fetch predictions:', err);
        setError('Failed to load predictions.');
      }
 finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight

  const selectedDateObject = new Date(selectedDate);
  selectedDateObject.setHours(0, 0, 0, 0); // Normalize selectedDate to midnight

  const isPastDate = selectedDateObject < today;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Football Predictions</h1>
        <ThemeSwitcher />
      </div>
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {loading && <p className="text-center">Loading predictions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <HitRate hitRate={hitRate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && predictions.length === 0 && <p className="col-span-full text-center">No predictions for this date.</p>}
        {Object.entries(groupedPredictions).map(([groupKey, predsInGroup]) => (
          <div key={groupKey} className="col-span-full">
            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">{groupKey}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predsInGroup.map((prediction) => (
                <PredictionCard
                  key={prediction.fixture_id}
                  prediction={prediction}
                  showOutcome={isPastDate && prediction.outcome !== null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}