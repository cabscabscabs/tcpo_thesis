import { useState, useEffect } from "react";
import { ExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";
import { supabase } from "@/integrations/supabase/client";
import { getRecommendations as getRecs, getRandomRecommendations } from "@/lib/recommendations";

/**
 * Transform an admin_patents row into an ExtendedPortfolioItem
 */
function transformAdminPatent(patent: any): ExtendedPortfolioItem {
  return {
    id: patent.id,
    title: patent.title || "Untitled Patent",
    slug: patent.title ? patent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `patent-${patent.id}`,
    description: patent.description || patent.abstract || `Patent in ${patent.field || 'Unknown Field'}`,
    image_url: patent.image_url || "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: patent.field || "General",
    tags: [patent.field, patent.status, 'USTP Patent'].filter(Boolean),
    published: true,
    published_at: new Date().toISOString(),
    created_at: patent.created_at,
    updated_at: patent.updated_at,
    inventors: patent.inventors || "Dr. USTP Researcher",
    field: patent.field || "General",
    status: patent.status || "Pending",
    year: patent.year || new Date().getFullYear().toString(),
    abstract: patent.abstract || `Patent abstract for ${patent.title || 'Untitled Patent'}`,
    licensing: patent.status === 'Licensed' ? 'Already Licensed' : 'Available for licensing',
    applications: [patent.field, 'Innovation', 'Research'].filter(Boolean),
    contact: "tpco@ustp.edu.ph",
    inventor: null,
    patent_status: null,
    patent_number: patent.patent_number || null,
    filing_date: null,
    grant_date: patent.grant_date || null,
    assignee: null,
    ipc_codes: null,
    cpc_codes: null,
    application_number: null,
    priority_date: null,
    expiration_date: null,
    claims: null,
    jurisdictions: null,
    family_members: null,
    legal_status: null,
    citations: null,
    citations_patents: null,
    cited_by: null,
    cited_by_patents: null,
    family_size: null,
    priority_claims: null,
    technology_fields: patent.technology_fields || null,
    ipc_classes: null,
    cpc_classes: null,
    files: patent.files || null,
  };
}

/**
 * Fetch published portfolio items from admin_patents (single source of truth).
 * Falls back gracefully if the table is unavailable.
 */
async function fetchPublishedItems(): Promise<ExtendedPortfolioItem[]> {
  try {
    const { data, error } = await supabase
      .from('admin_patents' as any)
      .select('*')
      .eq('published', true)
      .neq('status', 'Draft');

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(transformAdminPatent);
    }
  } catch (err) {
    console.error("Error fetching portfolio items from admin_patents:", err);
  }
  return [];
}

export const useRecommendations = (currentItem: ExtendedPortfolioItem | null, limit: number = 3) => {
  const [recommendations, setRecommendations] = useState<ExtendedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentItem) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const allItems = await fetchPublishedItems();
        
        if (allItems.length === 0) {
          setRecommendations([]);
          return;
        }
        
        // Get recommendations
        const recs = getRecs(currentItem, allItems, limit);
        
        // If no recommendations found, get random ones
        if (recs.length === 0) {
          setRecommendations(getRandomRecommendations(currentItem, allItems, limit));
        } else {
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [currentItem, limit]);
  
  return { recommendations, loading, error };
};

// Hook for getting general recommendations for the portfolio page
export const usePortfolioRecommendations = (limit: number = 3) => {
  const [recommendations, setRecommendations] = useState<ExtendedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allItems = await fetchPublishedItems();
        
        // If we have items, pick a random one as the base for recommendations
        if (allItems.length > 0) {
          const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
          const recs = getRecs(randomItem, allItems, limit);
          
          // If no recommendations found, get random ones
          if (recs.length === 0) {
            setRecommendations(getRandomRecommendations(randomItem, allItems, limit));
          } else {
            setRecommendations(recs);
          }
        }
      } catch (err) {
        console.error("Error fetching portfolio recommendations:", err);
        setError("Failed to load recommendations");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [limit]);
  
  return { recommendations, loading, error };
};