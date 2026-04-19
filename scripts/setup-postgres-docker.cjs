/**
 * PostgreSQL Docker Setup Script
 * 
 * This script sets up PostgreSQL using Docker, which is easier than
 * installing PostgreSQL directly on Windows.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description, options = {}) {
  console.log(`\n${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    console.log('  ✓ Success');
    return result;
  } catch (err) {
    if (!options.ignoreError) {
      console.error('  ✗ Failed:', err.message);
      throw err;
    }
    return null;
  }
}

function checkDocker() {
  console.log('Checking Docker installation...');
  try {
    execSync('docker --version', { stdio: 'pipe' });
    console.log('  ✓ Docker is installed');
    return true;
  } catch {
    console.error('  ✗ Docker is not installed');
    return false;
  }
}

function checkDockerCompose() {
  console.log('Checking Docker Compose...');
  try {
    execSync('docker compose version', { stdio: 'pipe' });
    console.log('  ✓ Docker Compose is available');
    return true;
  } catch {
    try {
      execSync('docker-compose --version', { stdio: 'pipe' });
      console.log('  ✓ Docker Compose (legacy) is available');
      return true;
    } catch {
      console.error('  ✗ Docker Compose is not available');
      return false;
    }
  }
}

function setupPostgres() {
  console.log('\n=== Setting up PostgreSQL with Docker ===\n');
  
  const composeFile = path.join(__dirname, '..', 'docker-compose.postgres.yml');
  
  if (!fs.existsSync(composeFile)) {
    console.error('Docker compose file not found:', composeFile);
    process.exit(1);
  }
  
  // Check if containers are already running
  console.log('Checking existing containers...');
  try {
    const output = execSync('docker ps -q -f name=tcpo-postgres', { encoding: 'utf8' });
    if (output.trim()) {
      console.log('  PostgreSQL container is already running');
      console.log('  Use "docker compose -f docker-compose.postgres.yml down" to stop it first');
      return;
    }
  } catch {}
  
  // Start containers
  runCommand(
    `docker compose -f "${composeFile}" up -d`,
    'Starting PostgreSQL and pgAdmin containers'
  );
  
  // Wait for PostgreSQL to be ready
  console.log('\nWaiting for PostgreSQL to be ready...');
  let retries = 30;
  while (retries > 0) {
    try {
      execSync('docker exec tcpo-postgres pg_isready -U postgres', { stdio: 'pipe' });
      console.log('  ✓ PostgreSQL is ready!');
      break;
    } catch {
      retries--;
      if (retries === 0) {
        console.error('  ✗ PostgreSQL failed to start');
        process.exit(1);
      }
      process.stdout.write('.');
      execSync('sleep 1');
    }
  }
  
  // Check if data was imported
  console.log('\nChecking database...');
  try {
    const tables = execSync(
      'docker exec tcpo-postgres psql -U postgres -d tcpo_local -t -c "SELECT tablename FROM pg_tables WHERE schemaname = \'public\';"',
      { encoding: 'utf8' }
    );
    const tableCount = tables.trim().split('\n').filter(t => t.trim()).length;
    console.log(`  ✓ Found ${tableCount} tables in database`);
  } catch (err) {
    console.warn('  Could not verify tables:', err.message);
  }
}

function createEnvFile() {
  console.log('\n=== Creating Environment Configuration ===');
  
  const envContent = `# Local PostgreSQL Configuration (Docker)
# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tcpo_local

# For direct PostgreSQL queries in backend
PGHOST=localhost
PGPORT=5432
PGDATABASE=tcpo_local
PGUSER=postgres
PGPASSWORD=postgres

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
  console.log('  ✓ Created .env.local with Docker PostgreSQL configuration');
}

function printNextSteps() {
  console.log('\n=== Setup Complete ===');
  console.log('\nPostgreSQL is running in Docker:');
  console.log('  Host: localhost');
  console.log('  Port: 5432');
  console.log('  Database: tcpo_local');
  console.log('  Username: postgres');
  console.log('  Password: postgres');
  console.log('\npgAdmin (Web UI) is available at:');
  console.log('  http://localhost:5050');
  console.log('  Email: admin@tcpo.local');
  console.log('  Password: admin');
  console.log('\nUseful commands:');
  console.log('  docker compose -f docker-compose.postgres.yml logs -f    # View logs');
  console.log('  docker compose -f docker-compose.postgres.yml stop       # Stop containers');
  console.log('  docker compose -f docker-compose.postgres.yml down       # Remove containers');
  console.log('  docker compose -f docker-compose.postgres.yml down -v    # Remove containers and data');
  console.log('\nEnvironment file created: .env.local');
}

async function main() {
  console.log('=== PostgreSQL Docker Setup ===\n');
  
  if (!checkDocker()) {
    console.error('\nDocker is not installed. Please install Docker first:');
    console.error('  https://docs.docker.com/get-docker/');
    process.exit(1);
  }
  
  if (!checkDockerCompose()) {
    console.error('\nDocker Compose is not available. Please install Docker Desktop which includes Compose.');
    process.exit(1);
  }
  
  try {
    setupPostgres();
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
Usage: node setup-postgres-docker.cjs [options]

Options:
  -h, --help    Show this help message

This script sets up PostgreSQL using Docker, which is the easiest way
to run PostgreSQL locally without installing it directly on your system.

Requirements:
  - Docker Desktop installed and running

What this script does:
  1. Starts PostgreSQL 16 in a Docker container
  2. Imports your Supabase data automatically
  3. Starts pgAdmin web UI for database management
  4. Creates .env.local with connection settings
`);
  process.exit(0);
}

main();
