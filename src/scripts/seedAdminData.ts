import { supabase } from "@/integrations/supabase/client";

/**
 * Seed script for admin tables - migrates default localStorage data to Supabase
 * Run this after applying the migration: npx tsx src/scripts/seedAdminData.ts
 */

const defaultHomepageContent = {
  hero_title: "Accelerating Innovation Through Technology Transfer",
  hero_subtitle: "Bridging the gap between research and commercialization...",
  patents_count: 24,
  partners_count: 50,
  startups_count: 15,
  technologies_count: 8
};

const defaultTechnologies = [
  {
    title: "Smart Irrigation System",
    description: "IoT-based irrigation system that reduces water usage by 40% while optimizing crop yields.",
    field: "Agriculture",
    status: "Licensed",
    inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
    year: "2024",
    abstract: "Revolutionary smart irrigation technology using AI-powered sensors.",
    featured: true,
    published: true
  },
  {
    title: "Bio-plastic Innovation",
    description: "Biodegradable plastic made from agricultural waste that decomposes within 6 months.",
    field: "Materials Science",
    status: "Available",
    inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
    year: "2023",
    abstract: "Sustainable packaging solution using local agricultural byproducts.",
    featured: true,
    published: true
  },
  {
    title: "Food Processing Tech",
    description: "Advanced food preservation method that extends shelf life by 300% naturally.",
    field: "Food Technology",
    status: "Pending",
    inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
    year: "2024",
    abstract: "Natural preservation technology combining traditional methods with modern science.",
    featured: true,
    published: true
  }
];

const defaultNews = [
  {
    title: "TPCO-CET Convergence 2025 Announced",
    excerpt: "Join us for the premier technology commercialization event in Northern Mindanao.",
    content: "The TPCO-CET Convergence 2025 will bring together researchers, industry partners, and innovators...",
    category: "Events",
    author: "Admin",
    status: "Published",
    date: "2024-01-15",
    published: true
  },
  {
    title: "New Patent Filing Workshop Series",
    excerpt: "Learn the fundamentals of patent filing and intellectual property protection.",
    content: "Our comprehensive workshop series covers all aspects of patent filing...",
    category: "Education",
    author: "Dr. Maria Santos",
    status: "Draft",
    date: "2024-01-10",
    published: false
  },
  {
    title: "Industry Partnership with ABC Corp",
    excerpt: "Exciting new partnership opens doors for technology commercialization.",
    content: "We are pleased to announce our strategic partnership with ABC Corp...",
    category: "Partnerships",
    author: "Admin",
    status: "Published",
    date: "2024-01-08",
    published: true
  }
];

const defaultPatents = [
  {
    title: "Smart Irrigation System",
    patent_number: "PH-2024-001",
    inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
    field: "Agriculture",
    abstract: "Revolutionary smart irrigation technology using AI-powered sensors.",
    status: "Granted",
    year: "2024"
  },
  {
    title: "Bio-degradable Packaging",
    patent_number: "PH-2024-002",
    inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
    field: "Materials Science",
    abstract: "Sustainable packaging solution using local agricultural byproducts.",
    status: "Pending",
    year: "2024"
  },
  {
    title: "Food Preservation Method",
    patent_number: "PH-2023-003",
    inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
    field: "Food Technology",
    abstract: "Natural preservation technology combining traditional methods with modern science.",
    status: "Granted",
    year: "2023"
  }
];

const defaultEvents = [
  {
    title: "Morning with IP Workshop",
    type: "workshop",
    date: "2024-02-15",
    status: "Upcoming",
    attendees_count: 45,
    location: "TPCO Training Center",
    registration_open: true,
    published: true
  },
  {
    title: "Technology Showcase 2024",
    type: "showcase",
    date: "2024-03-20",
    status: "Planning",
    attendees_count: 120,
    location: "University Gymnasium",
    registration_open: true,
    published: true
  },
  {
    title: "Innovation Forum",
    type: "forum",
    date: "2024-01-20",
    status: "Completed",
    attendees_count: 85,
    location: "Conference Hall",
    registration_open: false,
    published: true
  }
];

const defaultDashboardStats = {
  total_patents: 24,
  patents_this_month: 3,
  published_news: 18,
  news_this_week: 5,
  upcoming_events: 6,
  next_event_date: "Feb 15",
  service_requests_count: 12,
  pending_requests: 8
};

export const seedAdminData = async () => {
  console.log("Starting admin data seeding...");

  try {
    // 1. Seed homepage content (upsert to handle existing)
    console.log("Seeding homepage content...");
    const { error: homepageError } = await supabase
      .from('admin_homepage_content')
      .upsert(defaultHomepageContent, { onConflict: 'id' });
    
    if (homepageError) {
      console.error("Error seeding homepage content:", homepageError);
    } else {
      console.log("Homepage content seeded successfully");
    }

    // 2. Seed technologies
    console.log("Seeding technologies...");
    const { error: techError } = await supabase
      .from('admin_technologies')
      .insert(defaultTechnologies);
    
    if (techError && !techError.message.includes('duplicate')) {
      console.error("Error seeding technologies:", techError);
    } else {
      console.log("Technologies seeded successfully");
    }

    // 3. Seed news
    console.log("Seeding news...");
    const { error: newsError } = await supabase
      .from('admin_news')
      .insert(defaultNews);
    
    if (newsError && !newsError.message.includes('duplicate')) {
      console.error("Error seeding news:", newsError);
    } else {
      console.log("News seeded successfully");
    }

    // 4. Seed patents
    console.log("Seeding patents...");
    const { error: patentError } = await supabase
      .from('admin_patents')
      .insert(defaultPatents);
    
    if (patentError && !patentError.message.includes('duplicate')) {
      console.error("Error seeding patents:", patentError);
    } else {
      console.log("Patents seeded successfully");
    }

    // 5. Seed events
    console.log("Seeding events...");
    const { error: eventsError } = await supabase
      .from('admin_events')
      .insert(defaultEvents);
    
    if (eventsError && !eventsError.message.includes('duplicate')) {
      console.error("Error seeding events:", eventsError);
    } else {
      console.log("Events seeded successfully");
    }

    // 6. Seed dashboard stats
    console.log("Seeding dashboard stats...");
    const { error: statsError } = await supabase
      .from('admin_dashboard_stats')
      .upsert(defaultDashboardStats, { onConflict: 'id' });
    
    if (statsError) {
      console.error("Error seeding dashboard stats:", statsError);
    } else {
      console.log("Dashboard stats seeded successfully");
    }

    console.log("Admin data seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
};

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  seedAdminData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
