import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the interface for the prediction report data structure from Supabase
// This matches the summary_statistics JSONB column structure
export interface SupabasePredictionReport {
  summary_statistics: {
    hit_rate: string | null; // Allow null as it can be null if not calculated
    correct_predictions: number;
    total_predictions_with_outcome: number;
  };
  report_date: string; // The report date column
}

// Define the interface for a Prediction with flattened fixture data for frontend display
// This should be kept in sync with the Python backend's prediction object and what's
// flattened from fixtures.
export interface Prediction {
  fixture_id: number;
  prediction_date: string;
  league_name: string;
  league_country: string; // Now expected to come from fixtures and be flattened
  home_team_name: string;
  away_team_name: string;
  prediction_selection: string;
  prediction_raw_advice: string;
  prediction_confidence: string;
  outcome: string | null;
  home_team_logo?: string; // Flattened from fixtures
  away_team_logo?: string; // Flattened from fixtures
  goals_home_result?: string | number | null;
  goals_away_result?: string | number | null;
}


export async function getPredictionsByDate(date: string): Promise<Prediction[] | null> {
  const { data, error } = await supabase
    .from('predictions')
    // Select all prediction fields, and then related fixture data for league_country and logos
    // The 'fixtures' table columns are aliased to match the Prediction interface
    .select(`
      *,
      fixtures (
        league_country,
        home_team_name,
        away_team_name,
        home_team_logo,
        away_team_logo,
        goals_home,
        goals_away
      )
    `)
    .eq('prediction_date', date);

  if (error) {
    console.error('Error fetching predictions:', JSON.stringify(error, null, 2));
    return null;
  }

  // Flatten the data for easier use in frontend
  const flattenedData: Prediction[] = data.map((prediction: any) => ({
    ...prediction,
    // Promote fixture data to top level
    league_country: prediction.fixtures?.league_country || prediction.league_country,
    home_team_name: prediction.fixtures?.home_team_name || prediction.home_team_name,
    away_team_name: prediction.fixtures?.away_team_name || prediction.away_team_name,
    home_team_logo: prediction.fixtures?.home_team_logo || prediction.home_team_logo,
    away_team_logo: prediction.fixtures?.away_team_logo || prediction.away_team_logo,
    // Use prediction-level result fields when present, otherwise fixture goals
    // `goals_home_result` / `away_goals_result` may contain string values
    goals_home: (
      prediction.goals_home_result ?? prediction.goals_home ?? prediction.fixtures?.goals_home ?? null
    ),
    goals_away: (
      prediction.away_goals_result ?? prediction.away_goals ?? prediction.fixtures?.goals_away ?? null
    )
    // Remove the nested fixtures object as it's flattened
    // delete prediction.fixtures // Optional, if you want to clean up the object
  }));

  return flattenedData;
}

export async function getPredictionReportByDate(date: string): Promise<SupabasePredictionReport | null> {
  const { data, error } = await supabase
    .from('prediction_reports')
    .select('report_date, summary_statistics') // Select specific columns to match interface
    .eq('report_date', date)
    .maybeSingle(); // Expecting a single report per date
  
  if (error) {
    console.error('Error fetching prediction report:', JSON.stringify(error, null, 2));
    return null;
  }
  return data as SupabasePredictionReport;
}
