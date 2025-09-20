import { ExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";

/**
 * Calculate similarity score between two portfolio items based on:
 * - Field/category matching
 * - Tag overlap
 * - Status similarity
 * - Year proximity
 */
export function calculateSimilarity(
  item1: ExtendedPortfolioItem,
  item2: ExtendedPortfolioItem
): number {
  if (item1.id === item2.id) return 0; // Don't recommend the same item
  
  let score = 0;
  
  // Field/Category matching (highest weight)
  if ((item1.field || item1.category) === (item2.field || item2.category)) {
    score += 30;
  }
  
  // Tag overlap (medium weight)
  if (item1.tags && item2.tags) {
    const commonTags = item1.tags.filter(tag => 
      item2.tags?.includes(tag)
    ).length;
    score += commonTags * 5; // 5 points per common tag
  }
  
  // Status similarity (low weight)
  if (item1.status === item2.status) {
    score += 5;
  }
  
  // Year proximity (low weight)
  if (item1.year && item2.year) {
    const yearDiff = Math.abs(
      parseInt(item1.year) - parseInt(item2.year)
    );
    if (yearDiff <= 2) {
      score += 5; // Within 2 years
    } else if (yearDiff <= 5) {
      score += 2; // Within 5 years
    }
  }
  
  return score;
}

/**
 * Get top N recommended items for a given item
 */
export function getRecommendations(
  currentItem: ExtendedPortfolioItem,
  allItems: ExtendedPortfolioItem[],
  limit: number = 3
): ExtendedPortfolioItem[] {
  // Calculate similarity scores for all items
  const scoredItems = allItems
    .map(item => ({
      item,
      score: calculateSimilarity(currentItem, item)
    }))
    .filter(({ score }) => score > 0) // Only items with some similarity
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit); // Take top N
  
  return scoredItems.map(({ item }) => item);
}

/**
 * Get random recommendations (fallback when no similar items found)
 */
export function getRandomRecommendations(
  currentItem: ExtendedPortfolioItem,
  allItems: ExtendedPortfolioItem[],
  limit: number = 3
): ExtendedPortfolioItem[] {
  // Filter out the current item
  const filteredItems = allItems.filter(item => item.id !== currentItem.id);
  
  // Shuffle array and take first N
  const shuffled = [...filteredItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}