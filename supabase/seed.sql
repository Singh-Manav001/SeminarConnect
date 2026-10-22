-- ==============================================================================
-- SeminarConnect Initial Seed Data
-- ==============================================================================

-- 1. Insert 12 Categories
INSERT INTO categories (id, name, slug, description, icon_name, display_order, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'C and C++ Programming', 'c-cpp-programming', 'Systems programming, memory management, data structures, pointers, and modern C++ standards.', 'Terminal', 1, true),
('c1000000-0000-0000-0000-000000000002', 'HTML, CSS, JavaScript, and Web Development', 'web-development', 'Modern responsive web development, React, Next.js, frontend tooling, and full-stack architecture.', 'Globe', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Python, Java, and App Development', 'python-java-app-dev', 'Enterprise Java, Python scripting, OOP paradigms, Android/iOS mobile development.', 'Code', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Artificial Intelligence and Machine Learning', 'ai-machine-learning', 'Deep learning, LLMs, neural networks, computer vision, and applied ML for real-world solutions.', 'Cpu', 4, true),
('c1000000-0000-0000-0000-000000000005', 'Data Science and Cybersecurity', 'data-science-cybersecurity', 'Statistical computing, Big Data, ethical hacking, network defense, and zero-trust security.', 'Shield', 5, true),
('c1000000-0000-0000-0000-000000000006', 'Robotics and Internet of Things', 'robotics-iot', 'Microcontrollers (Arduino, ESP32, Raspberry Pi), sensor integration, autonomous robotics.', 'Bot', 6, true),
('c1000000-0000-0000-0000-000000000007', 'Science and Mathematics', 'science-mathematics', 'Vedic math, olympiad preparation, physics demonstrations, calculus intuition, and STEM pedagogy.', 'Atom', 7, true),
('c1000000-0000-0000-0000-000000000008', 'Career Guidance and Interview Preparation', 'career-guidance', 'Tech interview coding rounds, resume crafting, campus placement readiness, and corporate expectations.', 'Compass', 8, true),
('c1000000-0000-0000-0000-000000000009', 'Communication and Personality Development', 'communication-personality', 'Public speaking, debate mastery, body language, executive presence, and business English.', 'MessageSquare', 9, true),
('c1000000-0000-0000-0000-000000000010', 'Entrepreneurship and Financial Literacy', 'entrepreneurship-finance', 'Student startup ideation, pitching, personal budgeting, taxation basics, and venture funding.', 'TrendingUp', 10, true),
('c1000000-0000-0000-0000-000000000011', 'Digital Marketing and Design', 'digital-marketing-design', 'UI/UX design principles, Figma, SEO optimization, social media storytelling, and content strategy.', 'Palette', 11, true),
('c1000000-0000-0000-0000-000000000012', 'Other Custom Topics', 'custom-topics', 'Specialized academic, research, creative arts, and multidisciplinary educational sessions.', 'Sparkles', 12, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Platform Settings
INSERT INTO platform_settings (key, value, description) VALUES
('platform_commission_percent', '10', 'Platform revenue commission percentage charged on completed bookings'),
('tax_rate_gst', '18', 'Standard GST rate applied to platform convenience services'),
('minimum_booking_lead_days', '2', 'Minimum advance notice required for booking a seminar'),
('cancellation_cutoff_hours', '48', 'Hours before seminar start time for full principal refund')
ON CONFLICT (key) DO NOTHING;
