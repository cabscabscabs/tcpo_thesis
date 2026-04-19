# PostgreSQL Local Setup Guide

This guide will help you set up a local PostgreSQL database and migrate your Supabase data.

## Option 1: Docker (Recommended - Easiest)

### Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Setup Steps

1. **Install Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop
   - Run the installer and follow the prompts
   - Start Docker Desktop

2. **Run the Docker setup script:**
   ```powershell
   cd c:\Users\JODIE\Desktop\React\tcpo_thesis
   node scripts/setup-postgres-docker.cjs
   ```

3. **Verify the setup:**
   - PostgreSQL will be available at `localhost:5432`
   - pgAdmin web UI at http://localhost:5050 (login: admin@tcpo.local / admin)
   - Database: `tcpo_local` with your Supabase data imported

4. **Connect to your database:**
   ```powershell
   docker exec -it tcpo-postgres psql -U postgres -d tcpo_local
   ```

### Docker Commands Reference

```powershell
# Start containers
docker compose -f docker-compose.postgres.yml up -d

# Stop containers
docker compose -f docker-compose.postgres.yml stop

# View logs
docker compose -f docker-compose.postgres.yml logs -f

# Remove containers (keeps data)
docker compose -f docker-compose.postgres.yml down

# Remove containers and data (start fresh)
docker compose -f docker-compose.postgres.yml down -v
```

---

## Option 2: Direct PostgreSQL Installation

### Prerequisites
- Windows PowerShell with Administrator privileges

### Setup Steps

1. **Run the automated installer:**
   ```powershell
   # Open PowerShell as Administrator
   cd c:\Users\JODIE\Desktop\React\tcpo_thesis
   .
   
   # Run the installation script
   .\scripts\install-postgres-windows.ps1
   ```

   Or install manually:
   - Download from https://www.postgresql.org/download/windows/
   - Run the installer with default settings
   - Set password to `postgres` (or remember what you set)
   - Keep the default port 5432

2. **Restart your terminal** after installation

3. **Run the setup script:**
   ```powershell
   cd c:\Users\JODIE\Desktop\React\tcpo_thesis
   node scripts/setup-local-postgres.cjs --db-password postgres
   ```

4. **Verify the setup:**
   ```powershell
   psql -U postgres -h localhost -p 5432 -d tcpo_local
   ```

---

## Option 3: Using an Existing PostgreSQL Installation

If you already have PostgreSQL installed:

1. **Create the database:**
   ```powershell
   createdb -U postgres tcpo_local
   ```

2. **Import the schema and data:**
   ```powershell
   psql -U postgres -d tcpo_local -f migrations/local-postgres/00-complete-migration.sql
   ```

3. **Or import step by step:**
   ```powershell
   # Schema only
   psql -U postgres -d tcpo_local -f migrations/local-postgres/01-schema.sql
   
   # Data for each table
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-user_profiles.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-activity_logs.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-resources.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-services.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-admin_patents.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-event_registrations.sql
   ```

---

## Verification

After setup, verify your migration:

### 1. Check Database Connection
```powershell
# Using psql
psql -U postgres -h localhost -p 5432 -d tcpo_local -c "\dt"

# Using Docker
docker exec tcpo-postgres psql -U postgres -d tcpo_local -c "\dt"
```

### 2. Check Table Counts
```sql
-- Connect to database and run:
SELECT 
    schemaname,
    tablename,
    (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM %I.%I', schemaname, tablename), FALSE, TRUE, '')))[1]::text::int AS row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 3. Sample Data Check
```sql
-- Check user_profiles
SELECT * FROM user_profiles LIMIT 5;

-- Check activity_logs
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5;

-- Check resources
SELECT * FROM resources LIMIT 5;
```

---

## Update Application to Use Local Database

### 1. Copy the environment file
```powershell
copy .env.local .env
```

### 2. Or manually update your `.env` file:
```env
# Local PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tcpo_local
PGHOST=localhost
PGPORT=5432
PGDATABASE=tcpo_local
PGUSER=postgres
PGPASSWORD=postgres

# Keep Supabase config for reference
VITE_SUPABASE_URL=https://pwtmtnvedemabvwamllq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=https://ustp-tpco.ddns.net
```

---

## Troubleshooting

### "psql is not recognized"
**Solution:** Add PostgreSQL to your PATH
```powershell
# Find your PostgreSQL installation
$pgPath = "C:\Program Files\PostgreSQL\16\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$pgPath", "Machine")
# Restart PowerShell
```

### "Connection refused"
**Solution:** Check if PostgreSQL service is running
```powershell
# Check service status
Get-Service -Name "postgresql*"

# Start the service
Start-Service -Name "postgresql-x64-16"
```

### "Database tcpo_local does not exist"
**Solution:** Create the database manually
```powershell
createdb -U postgres tcpo_local
```

### Docker "port is already allocated"
**Solution:** Port 5432 is in use. Stop the existing PostgreSQL service:
```powershell
Stop-Service -Name "postgresql-x64-16"
# Or change the port in docker-compose.postgres.yml to 5433
```

### Migration fails with syntax errors
**Solution:** Some Supabase-specific features may not work in standard PostgreSQL. Edit the SQL files to remove:
- `auth.uid()` references (replace with actual UUIDs)
- `storage.*` references
- Supabase-specific extensions

---

## What's Migrated

### ✅ Successfully Exported Tables
- `user_profiles` - 2 rows
- `activity_logs` - 120 rows  
- `event_registrations` - 2 rows
- `resources` - 32 rows
- `services` - 4 rows
- `admin_patents` - 3 rows

### ❌ Not Exported (Tables may not exist in Supabase)
- `news`, `events`, `technologies`
- `patents`, `ip_applications`
- `admin_users`, `service_requests`, `notifications`

### ❌ Supabase-Specific Features (Not Available Locally)
- Realtime subscriptions
- Supabase Auth
- Storage buckets
- Edge Functions
- Some database triggers

---

## Next Steps

1. **Choose an installation method** (Docker recommended)
2. **Install the prerequisites**
3. **Run the setup script**
4. **Verify the migration**
5. **Update your application** to use the local database

For help, check the troubleshooting section above or refer to:
- `migrations/local-postgres/README.md` - Detailed migration docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
