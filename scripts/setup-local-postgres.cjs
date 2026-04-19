/**
 * Local PostgreSQL Setup Script
 * 
 * This script helps set up a local PostgreSQL database with the same schema as Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || 'tcpo_local';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations', 'local-postgres');

function runCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      env: { ...process.env, PGPASSWORD: DB_PASSWORD }
    });
    console.log('  ✓ Success');
    return result;
  } catch (err) {
    console.error('  ✗ Failed:', err.message);
    throw err;
  }
}

function createDatabase() {
  console.log('\n=== Creating Local PostgreSQL Database ===');
  
  try {
    // Check if database exists
    const checkDb = `psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -lqt | cut -d \| -f 1 | grep -w ${DB_NAME}`;
    try {
      execSync(checkDb, { env: { ...process.env, PGPASSWORD: DB_PASSWORD } });
      console.log(`Database ${DB_NAME} already exists`);
    } catch {
      // Database doesn't exist, create it
      runCommand(
        `createdb -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} ${DB_NAME}`,
        `Creating database ${DB_NAME}`
      );
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  }
}

function applySchema() {
  console.log('\n=== Applying Schema ===');
  
  const schemaFile = path.join(MIGRATIONS_DIR, '01-schema.sql');
  if (!fs.existsSync(schemaFile)) {
    console.error('Schema file not found. Run migrate-to-local-postgres.cjs first.');
    process.exit(1);
  }
  
  runCommand(
    `psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -f "${schemaFile}"`,
    'Applying schema from migrations'
  );
}

function importData() {
  console.log('\n=== Importing Data ===');
  
  const dataFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.startsWith('02-data-') && f.endsWith('.sql'))
    .sort();
  
  if (dataFiles.length === 0) {
    console.log('No data files found to import');
    return;
  }
  
  for (const file of dataFiles) {
    const tableName = file.replace('02-data-', '').replace('.sql', '');
    runCommand(
      `psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -f "${path.join(MIGRATIONS_DIR, file)}"`,
      `Importing data for ${tableName}`
    );
  }
}

function createEnvFile() {
  console.log('\n=== Creating Local Environment Configuration ===');
  
  const envContent = `# Local PostgreSQL Configuration
# Database Connection
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# For direct PostgreSQL queries in backend
PGHOST=${DB_HOST}
PGPORT=${DB_PORT}
PGDATABASE=${DB_NAME}
PGUSER=${DB_USER}
PGPASSWORD=${DB_PASSWORD}

# Supabase configuration (keep for reference)
VITE_SUPABASE_URL=https://pwtmtnvedemabvwamllq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dG10bnZlZGVtYWJ2d2FtbGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzQ2OTYsImV4cCI6MjA4NzQ1MDY5Nn0.VxV6nlUlrEiNHeI0JXBH2dvmYGVJ9FyIU6e0AZigflk
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dG10bnZlZGVtYWJ2d2FtbGxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg3NDY5NiwiZXhwIjoyMDg3NDUwNjk2fQ.E2K3kIOwwTZuqHqEpJUKyQhUPA3z7A6CLu1M0ujIk8A

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Production Domain
VITE_APP_URL=https://ustp-tpco.ddns.net
`;
  
  const envLocalFile = path.join(__dirname, '..', '.env.local');
  fs.writeFileSync(envLocalFile, envContent);
  console.log('  ✓ Created .env.local with local database configuration');
}

function printNextSteps() {
  console.log('\n=== Setup Complete ===');
  console.log('\nNext steps:');
  console.log('1. Update your application to use the local database');
  console.log('2. For backend: Use DATABASE_URL environment variable');
  console.log('3. For frontend: You may need to create a local API layer');
  console.log('\nTo connect to your local database:');
  console.log(`  psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME}`);
  console.log('\nEnvironment file created: .env.local');
}

async function main() {
  console.log('=== Local PostgreSQL Setup ===');
  console.log(`Database: ${DB_NAME}`);
  console.log(`Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`User: ${DB_USER}`);
  
  try {
    createDatabase();
    applySchema();
    importData();
    createEnvFile();
    printNextSteps();
  } catch (err) {
    console.error('\nSetup failed:', err.message);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node setup-local-postgres.cjs [options]

Options:
  --db-name <name>     Database name (default: tcpo_local)
  --db-user <user>     Database user (default: postgres)
  --db-password <pass> Database password (default: postgres)
  --db-host <host>     Database host (default: localhost)
  --db-port <port>     Database port (default: 5432)
  --schema-only        Only apply schema, don't import data
  --data-only          Only import data, don't apply schema
  -h, --help           Show this help message

Examples:
  node setup-local-postgres.cjs
  node setup-local-postgres.cjs --db-name mydb --db-password mypass
  node setup-local-postgres.cjs --schema-only
`);
  process.exit(0);
}

// Parse arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--db-name':
      process.env.DB_NAME = args[++i];
      break;
    case '--db-user':
      process.env.DB_USER = args[++i];
      break;
    case '--db-password':
      process.env.DB_PASSWORD = args[++i];
      break;
    case '--db-host':
      process.env.DB_HOST = args[++i];
      break;
    case '--db-port':
      process.env.DB_PORT = args[++i];
      break;
  }
}

main();
