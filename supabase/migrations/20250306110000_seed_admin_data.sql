-- Seed data for admin tables

-- 1. Seed homepage content
INSERT INTO public.admin_homepage_content (hero_title, hero_subtitle, patents_count, partners_count, startups_count, technologies_count)
VALUES ('Accelerating Innovation Through Technology Transfer', 'Bridging the gap between research and commercialization...', 24, 50, 15, 8);

-- 2. Seed technologies
INSERT INTO public.admin_technologies (title, description, field, status, inventors, year, abstract, featured, published) VALUES
('Smart Irrigation System', 'IoT-based irrigation system that reduces water usage by 40% while optimizing crop yields.', 'Agriculture', 'Licensed', 'Dr. Maria Santos, Dr. Juan dela Cruz', '2024', 'Revolutionary smart irrigation technology using AI-powered sensors.', true, true),
('Bio-plastic Innovation', 'Biodegradable plastic made from agricultural waste that decomposes within 6 months.', 'Materials Science', 'Available', 'Dr. Roberto Mendez, Dr. Anna Garcia', '2023', 'Sustainable packaging solution using local agricultural byproducts.', true, true),
('Food Processing Tech', 'Advanced food preservation method that extends shelf life by 300% naturally.', 'Food Technology', 'Pending', 'Dr. Carmen Reyes, Dr. Luis Torres', '2024', 'Natural preservation technology combining traditional methods with modern science.', true, true);

-- 3. Seed news
INSERT INTO public.admin_news (title, excerpt, content, category, author, status, date, published) VALUES
('TPCO-CET Convergence 2025 Announced', 'Join us for the premier technology commercialization event in Northern Mindanao.', 'The TPCO-CET Convergence 2025 will bring together researchers, industry partners, and innovators...', 'Events', 'Admin', 'Published', '2024-01-15', true),
('New Patent Filing Workshop Series', 'Learn the fundamentals of patent filing and intellectual property protection.', 'Our comprehensive workshop series covers all aspects of patent filing...', 'Education', 'Dr. Maria Santos', 'Draft', '2024-01-10', false),
('Industry Partnership with ABC Corp', 'Exciting new partnership opens doors for technology commercialization.', 'We are pleased to announce our strategic partnership with ABC Corp...', 'Partnerships', 'Admin', 'Published', '2024-01-08', true);

-- 4. Seed patents
INSERT INTO public.admin_patents (title, patent_number, inventors, field, abstract, status, year, published) VALUES
('Smart Irrigation System', 'PH-2024-001', 'Dr. Maria Santos, Dr. Juan dela Cruz', 'Agriculture', 'Revolutionary smart irrigation technology using AI-powered sensors.', 'Granted', '2024', true),
('Bio-degradable Packaging', 'PH-2024-002', 'Dr. Roberto Mendez, Dr. Anna Garcia', 'Materials Science', 'Sustainable packaging solution using local agricultural byproducts.', 'Pending', '2024', true),
('Food Preservation Method', 'PH-2023-003', 'Dr. Carmen Reyes, Dr. Luis Torres', 'Food Technology', 'Natural preservation technology combining traditional methods with modern science.', 'Granted', '2023', true);

-- 5. Seed events
INSERT INTO public.admin_events (title, type, date, location, status, attendees_count, registration_open, published) VALUES
('Morning with IP Workshop', 'workshop', '2024-02-15', 'TPCO Training Center', 'Upcoming', 45, true, true),
('Technology Showcase 2024', 'showcase', '2024-03-20', 'University Gymnasium', 'Planning', 120, true, true),
('Innovation Forum', 'forum', '2024-01-20', 'Conference Hall', 'Completed', 85, false, true);

-- 6. Seed dashboard stats
INSERT INTO public.admin_dashboard_stats (total_patents, patents_this_month, published_news, news_this_week, upcoming_events, next_event_date, service_requests_count, pending_requests)
VALUES (24, 3, 18, 5, 6, 'Feb 15', 12, 8);
