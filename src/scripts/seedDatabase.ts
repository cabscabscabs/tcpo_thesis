import { supabase } from "@/integrations/supabase/client";

export const seedDatabase = async () => {
  try {
    console.log("Seeding database with sample portfolio items...");
    
    // Use only the base fields that are guaranteed to exist
    const sampleItems = [
      {
        title: "Advanced Battery Technology",
        slug: "advanced-battery-technology",
        description: "Next-generation lithium-ion batteries with 3x longer lifespan and faster charging capabilities.",
        category: "Energy",
        tags: ["Battery", "Energy", "Sustainability"],
        published: true
        // Omit extended fields that might not be in the schema yet
      },
      {
        title: "Smart Agriculture Sensor Network",
        slug: "smart-agriculture-sensor-network",
        description: "IoT-based sensor network for precision agriculture with real-time monitoring capabilities.",
        category: "Agriculture",
        tags: ["IoT", "Agriculture", "Sensors"],
        published: true
        // Omit extended fields that might not be in the schema yet
      },
      {
        title: "Biodegradable Packaging Material",
        slug: "biodegradable-packaging-material",
        description: "Eco-friendly packaging solution made from agricultural waste with complete biodegradability.",
        category: "Materials",
        tags: ["Sustainability", "Packaging", "Biodegradable"],
        published: true
        // Omit extended fields that might not be in the schema yet
      }
    ];

    // Insert the sample items
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert(sampleItems)
      .select();

    if (error) {
      console.error("Error inserting sample items:", error);
      throw error;
    }

    console.log("Successfully inserted sample items:", data);
    return data;
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};