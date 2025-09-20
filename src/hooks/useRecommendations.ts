import { useState, useEffect } from "react";
import { ExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";
import { supabase } from "@/integrations/supabase/client";
import { transformToExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";
import { getRecommendations as getRecs, getRandomRecommendations } from "@/lib/recommendations";

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
        
        // Fetch all published items
        const { data, error: fetchError } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("published", true);
        
        if (fetchError) throw fetchError;
        
        // Transform data
        const allItems = data.map(item => transformToExtendedPortfolioItem(item));
        
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
        
        // Fetch all published items
        const { data, error: fetchError } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("published", true);
        
        if (fetchError) throw fetchError;
        
        // Transform data
        const allItems = data.map(item => transformToExtendedPortfolioItem(item));
        
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