// Extended types for portfolio items with patent/IP data
export interface ExtendedPortfolioItem {
  // Original portfolio item fields
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  category: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Extended fields for patent/IP data (may not exist in all database records)
  inventors: string | null;
  field: string | null;
  status: string | null;
  year: string | null;
  abstract: string | null;
  licensing: string | null;
  applications: string[] | null;
  contact: string | null;
  
  // Database-specific fields
  patent_number: string | null;
  patent_status: string | null;
  filing_date: string | null;
  grant_date: string | null;
  inventor: string | null;
  assignee: string | null;
  ipc_codes: string[] | null;
  cpc_codes: string[] | null;
  application_number: string | null;
  priority_date: string | null;
  expiration_date: string | null;
  claims: string | null;
  jurisdictions: string[] | null;
  family_members: string[] | null;
  legal_status: string | null;
  citations: number | null;
  citations_patents: string[] | null;
  cited_by: number | null;
  cited_by_patents: string[] | null;
  family_size: number | null;
  priority_claims: string[] | null;
  technology_fields: string[] | null;
  ipc_classes: string[] | null;
  cpc_classes: string[] | null;
}

// Define a type for the raw database data from Supabase
interface RawPortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Patent-specific fields (all optional since they may not exist in all records)
  patent_number?: string | null;
  patent_status?: string | null;
  filing_date?: string | null;
  grant_date?: string | null;
  inventor?: string | null;
  assignee?: string | null;
  ipc_codes?: string[] | null;
  cpc_codes?: string[] | null;
  application_number?: string | null;
  priority_date?: string | null;
  expiration_date?: string | null;
  abstract?: string | null;
  claims?: string | null;
  jurisdictions?: string[] | null;
  family_members?: string[] | null;
  legal_status?: string | null;
  citations?: number | null;
  citations_patents?: string[] | null;
  cited_by?: number | null;
  cited_by_patents?: string[] | null;
  family_size?: number | null;
  priority_claims?: string[] | null;
  technology_fields?: string[] | null;
  ipc_classes?: string[] | null;
  cpc_classes?: string[] | null;
}

// Define interface for database items that include the extended fields
interface DatabasePortfolioItem extends RawPortfolioItem {
  inventors?: string | null;
  field?: string | null;
  status?: string | null;
  year?: string | null;
  licensing?: string | null;
  applications?: string[] | null;
  contact?: string | null;
}

// Helper function to transform database data to ExtendedPortfolioItem
export function transformToExtendedPortfolioItem(data: RawPortfolioItem): ExtendedPortfolioItem {
  // Cast to DatabasePortfolioItem to access extended fields
  const dbData = data as DatabasePortfolioItem;
  
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    image_url: data.image_url,
    link_url: data.link_url,
    category: data.category,
    tags: data.tags || [],
    published: data.published,
    published_at: data.published_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    // Map database fields to extended fields
    inventors: dbData.inventor || null,
    field: data.category || null,
    status: dbData.patent_status || null,
    year: dbData.grant_date ? new Date(dbData.grant_date).getFullYear().toString() : null,
    abstract: dbData.abstract || null,
    licensing: "Available for licensing through TPCO Technologies",
    applications: dbData.technology_fields || null,
    contact: "ip@tpco.com",
    // Database-specific fields
    patent_number: dbData.patent_number || null,
    patent_status: dbData.patent_status || null,
    filing_date: dbData.filing_date || null,
    grant_date: dbData.grant_date || null,
    inventor: dbData.inventor || null,
    assignee: dbData.assignee || null,
    ipc_codes: dbData.ipc_codes || null,
    cpc_codes: dbData.cpc_codes || null,
    application_number: dbData.application_number || null,
    priority_date: dbData.priority_date || null,
    expiration_date: dbData.expiration_date || null,
    claims: dbData.claims || null,
    jurisdictions: dbData.jurisdictions || null,
    family_members: dbData.family_members || null,
    legal_status: dbData.legal_status || null,
    citations: dbData.citations || null,
    citations_patents: dbData.citations_patents || null,
    cited_by: dbData.cited_by || null,
    cited_by_patents: dbData.cited_by_patents || null,
    family_size: dbData.family_size || null,
    priority_claims: dbData.priority_claims || null,
    technology_fields: dbData.technology_fields || null,
    ipc_classes: dbData.ipc_classes || null,
    cpc_classes: dbData.cpc_classes || null
  };
}