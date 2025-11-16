-- Mensthetic Iterative Improvement Database Schema
-- Run this in your Supabase SQL Editor

-- User Sessions for Analytics
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  landing_page TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0
);

-- Page Views and User Behavior
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  page_path TEXT NOT NULL,
  page_title TEXT,
  time_on_page INTEGER,
  scroll_depth DECIMAL(5,2),
  viewport_width INTEGER,
  viewport_height INTEGER,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Interactions and Events
CREATE TABLE user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  event_type TEXT NOT NULL, -- 'click', 'form_submit', 'cta_click', 'scroll', 'hover'
  element_id TEXT,
  element_class TEXT,
  element_text TEXT,
  section_name TEXT, -- 'hero', 'services', 'cta-booking', etc.
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Form Submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  form_variant TEXT DEFAULT 'default', -- for A/B testing
  conversion_source TEXT, -- which CTA led to this
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'scheduled', 'converted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Feedback for Iterative Improvements
CREATE TABLE user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  feedback_type TEXT NOT NULL, -- 'design', 'content', 'usability', 'feature_request'
  section_name TEXT, -- which section the feedback is about
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  user_email TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Variants
CREATE TABLE ab_test_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  variant_config JSONB, -- stores the variant configuration
  is_active BOOLEAN DEFAULT true,
  traffic_percentage DECIMAL(5,2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_name, variant_name)
);

-- A/B Test Assignments
CREATE TABLE ab_test_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, test_name)
);

-- Conversion Goals
CREATE TABLE conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  conversion_type TEXT NOT NULL, -- 'contact_form', 'phone_call', 'email_click'
  conversion_value DECIMAL(10,2), -- potential revenue value
  ab_test_variant TEXT,
  funnel_step INTEGER, -- which step in the conversion funnel
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  metric_name TEXT NOT NULL, -- 'lcp', 'fid', 'cls', 'ttfb'
  metric_value DECIMAL(10,3),
  page_path TEXT,
  device_type TEXT,
  connection_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heat Map Data
CREATE TABLE heatmap_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  page_path TEXT NOT NULL,
  x_coordinate INTEGER,
  y_coordinate INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  event_type TEXT, -- 'click', 'move', 'scroll'
  element_selector TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_created_at ON user_sessions(created_at);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_events_session_id ON user_events(session_id);
CREATE INDEX idx_events_type ON user_events(event_type);
CREATE INDEX idx_events_section ON user_events(section_name);
CREATE INDEX idx_conversions_type ON conversions(conversion_type);
CREATE INDEX idx_feedback_type ON user_feedback(feedback_type);
CREATE INDEX idx_ab_assignments_session ON ab_test_assignments(session_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for analytics
CREATE POLICY "Allow anonymous analytics" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics" ON heatmap_data FOR INSERT WITH CHECK (true);

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_session_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  date DATE,
  sessions BIGINT,
  page_views BIGINT,
  avg_duration DECIMAL,
  bounce_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(s.created_at) as date,
    COUNT(DISTINCT s.session_id) as sessions,
    COUNT(pv.id) as page_views,
    AVG(s.duration_seconds)::DECIMAL as avg_duration,
    (COUNT(CASE WHEN pv_count.views = 1 THEN 1 END)::DECIMAL / COUNT(DISTINCT s.session_id) * 100) as bounce_rate
  FROM user_sessions s
  LEFT JOIN page_views pv ON s.session_id = pv.session_id
  LEFT JOIN (
    SELECT session_id, COUNT(*) as views
    FROM page_views
    GROUP BY session_id
  ) pv_count ON s.session_id = pv_count.session_id
  WHERE s.created_at >= NOW() - INTERVAL '%d days'
  GROUP BY DATE(s.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;