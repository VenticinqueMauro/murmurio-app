export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  streak_count: number;
  last_session_date: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  prompt: string;
  raw_text: string | null;
  duration_seconds: number | null;
  mood_before: number | null;
  mood_after: number | null;
  created_at: string;
}

export interface LatencyEntry {
  id?: string;
  session_id?: string;
  word: string;
  position_in_text: number;
  latency_ms: number;
  is_hesitation: boolean;
}

export interface Insights {
  id?: string;
  session_id?: string;
  user_id?: string;
  top_words: string[];
  contradictions: string[];
  micro_action: string;
  reflection_questions: string[];
  created_at?: string;
}
