/**
 * Supabase to Local PostgreSQL Migration Script
 * 
 * This script exports all data from Supabase and creates SQL files
 * for importing into a local PostgreSQL database.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pwtmtnvedemabvwamllq.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('Error: SUPABASE_KEY is required. Set VITE_SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY environment variable.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// List of tables to migrate (in dependency order)
const TABLES = [
  // Core tables
  'user_profiles',
  'activity_logs',
  
  // Content tables
  'news',
  'events',
  'event_registrations',
  'resources',
  'services',
  'technologies',
  
  // Patent and IP tables
  'patents',
  'ip_applications',
  'ip_application_attachments',
  'ip_application_claims',
  'ip_application_versions',
  'ip_application_status_history',
  'ip_application_comments',
  
  // Admin tables
  'admin_patents',
  'admin_users',
  'service_requests',
  'notifications',
];

const OUTPUT_DIR = path.join(__dirname, '..', 'migrations', 'local-postgres');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function exportTable(tableName) {
  console.log(`Exporting ${tableName}...`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10000); // Adjust limit as needed
    
    if (error) {
      console.warn(`Warning: Could not export ${tableName}: ${error.message}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log(`  - No data in ${tableName}`);
      return { tableName, count: 0, data: [] };
    }
    
    console.log(`  - Exported ${data.length} rows`);
    return { tableName, count: data.length, data };
  } catch (err) {
    console.warn(`Warning: Error exporting ${tableName}: ${err.message}`);
    return null;
  }
}

function generateInsertSQL(tableName, data) {
  if (!data || data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const columnList = columns.join(', ');
  
  let sql = `-- Data for ${tableName}\n`;
  sql += `TRUNCATE TABLE ${tableName} CASCADE;\n`;
  
  for (const row of data) {
    const values = columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      if (typeof val === 'number') return val;
      if (typeof val === 'object') {
        // Handle JSON/JSONB arrays and objects
        if (Array.isArray(val)) {
          return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
        }
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      }
      // Escape single quotes in strings
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    
    sql += `INSERT INTO ${tableName} (${columnList}) VALUES (${values.join(', ')});\n`;
  }
  
  sql += `\n`;
  return sql;
}

function generateSchemaSQL() {
  // Read the migration files and combine them
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  let schemaSQL = `-- Local PostgreSQL Schema\n`;
  schemaSQL += `-- Generated from Supabase migrations\n\n`;
  schemaSQL += `-- Enable required extensions\n`;
  schemaSQL += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`;
  schemaSQL += `CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n`;
  
  // Read and combine all migration files
  for (const file of migrationFiles) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    schemaSQL += `-- From ${file}\n`;
    schemaSQL += content;
    schemaSQL += `\n\n`;
  }
  
  return schemaSQL;
}

async function main() {
  console.log('=== Supabase to Local PostgreSQL Migration ===\n');
  
  // Export all tables
  const exportedData = {};
  for (const table of TABLES) {
    const result = await exportTable(table);
    if (result) {
      exportedData[table] = result;
    }
  }
  
  // Generate schema SQL
  console.log('\nGenerating schema SQL...');
  const schemaSQL = generateSchemaSQL();
  fs.writeFileSync(path.join(OUTPUT_DIR, '01-schema.sql'), schemaSQL);
  console.log('  - Saved: 01-schema.sql');
  
  // Generate data SQL for each table
  console.log('\nGenerating data SQL files...');
  for (const [tableName, result] of Object.entries(exportedData)) {
    if (result.count > 0) {
      const dataSQL = generateInsertSQL(tableName, result.data);
      const filename = `02-data-${tableName}.sql`;
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), dataSQL);
      console.log(`  - Saved: ${filename} (${result.count} rows)`);
    }
  }
  
  // Generate combined migration file
  console.log('\nGenerating combined migration file...');
  let combinedSQL = schemaSQL;
  combinedSQL += `\n-- Data Migration\n\n`;
  
  for (const [tableName, result] of Object.entries(exportedData)) {
    if (result.count > 0) {
      combinedSQL += generateInsertSQL(tableName, result.data);
    }
  }
  
  fs.writeFileSync(path.join(OUTPUT_DIR, '00-complete-migration.sql'), combinedSQL);
  console.log('  - Saved: 00-complete-migration.sql');
  
  // Generate instructions
  const instructions = `# Local PostgreSQL Migration Instructions

## Prerequisites

1. Install PostgreSQL locally (version 14 or higher recommended)
2. Create a new database

## Migration Steps

### Option 1: Complete Migration (Recommended)

1. Create your local database:
   \`\`\`bash
   createdb tcpo_local
   \`\`\`

2. Run the complete migration:
   \`\`\`bash
   psql -U postgres -d tcpo_local -f migrations/local-postgres/00-complete-migration.sql
   \`\`\`

### Option 2: Step-by-Step Migration

1. Create your local database:
   \`\`\`bash
   createdb tcpo_local
   \`\`\`

2. Create schema:
   \`\`\`bash
   psql -U postgres -d tcpo_local -f migrations/local-postgres/01-schema.sql
   \`\`\`

3. Import data for each table:
   \`\`\`bash
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-user_profiles.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-news.sql
   # ... etc
   \`\`\`

## Update Application Configuration

Update your \`.env\` file to use local PostgreSQL:

\`\`\`env
# Local PostgreSQL Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# Or use direct PostgreSQL connection for backend
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tcpo_local
\`\`\`

## Notes

- Some Supabase-specific features (like realtime, storage) may need alternative implementations
- Row Level Security (RLS) policies are included but may need adjustment for local use
- Authentication will need to be reconfigured for local development
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), instructions);
  console.log('  - Saved: README.md');
  
  console.log('\n=== Migration Complete ===');
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review the generated SQL files');
  console.log('2. Install PostgreSQL locally if not already installed');
  console.log('3. Run the migration using the instructions in README.md');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
