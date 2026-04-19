# Local PostgreSQL Migration Instructions

## Overview

This migration exports data from your Supabase cloud database to a local PostgreSQL instance for development or backup purposes.

## Prerequisites

1. **Install PostgreSQL** (version 14 or higher recommended)
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Ensure PostgreSQL is running** and you have the `psql` and `createdb` commands available

3. **Node.js** installed (for running the export script)

## Quick Start (Automated)

### Step 1: Export Data from Supabase

The data has already been exported. Check the `migrations/local-postgres/` directory for:
- `01-schema.sql` - Database schema
- `02-data-*.sql` - Data for each table
- `00-complete-migration.sql` - Complete migration (schema + data)

### Step 2: Setup Local PostgreSQL

Run the automated setup script:

```powershell
# On Windows PowerShell
node scripts/setup-local-postgres.cjs --db-password your_postgres_password

# With custom options
node scripts/setup-local-postgres.cjs --db-name tcpo_local --db-user postgres --db-password yourpassword
```

### Step 3: Manual Setup (Alternative)

If the automated script doesn't work:

1. **Create database:**
   ```powershell
   createdb -U postgres tcpo_local
   ```

2. **Apply schema:**
   ```powershell
   psql -U postgres -d tcpo_local -f migrations/local-postgres/01-schema.sql
   ```

3. **Import data:**
   ```powershell
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-user_profiles.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-activity_logs.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-resources.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-services.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-admin_patents.sql
   psql -U postgres -d tcpo_local -f migrations/local-postgres/02-data-event_registrations.sql
   ```

## Update Application Configuration

A `.env.local` file has been created with local database configuration. To use it:

### Option 1: Use .env.local (Recommended for development)

Rename or copy the file:
```powershell
copy .env.local .env
```

### Option 2: Manual Configuration

Update your `.env` file:

```env
# Local PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tcpo_local
PGHOST=localhost
PGPORT=5432
PGDATABASE=tcpo_local
PGUSER=postgres
PGPASSWORD=yourpassword

# Keep Supabase config for reference
VITE_SUPABASE_URL=https://pwtmtnvedemabvwamllq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Connecting to Local Database

### Using psql command line:
```powershell
psql -U postgres -d tcpo_local
```

### Using pgAdmin (GUI):
1. Open pgAdmin
2. Create new server connection
3. Host: localhost
4. Port: 5432
5. Database: tcpo_local
6. Username: postgres
7. Password: yourpassword

## Re-export Data (If Needed)

If you need to refresh the data from Supabase:

```powershell
# Set environment variables
$env:VITE_SUPABASE_URL="https://pwtmtnvedemabvwamllq.supabase.co"
$env:VITE_SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run export script
node scripts/migrate-to-local-postgres.cjs
```

## Important Notes

### What's Included
- ✅ Database schema (tables, indexes, constraints)
- ✅ Row Level Security (RLS) policies
- ✅ Table data (user_profiles, activity_logs, resources, services, etc.)

### What's NOT Included (Supabase-specific features)
- ❌ Realtime subscriptions (need alternative implementation)
- ❌ Supabase Auth (need local auth solution)
- ❌ Storage buckets (files not migrated)
- ❌ Edge Functions (need alternative implementation)
- ❌ Database webhooks/triggers specific to Supabase

### Tables Successfully Exported
- `user_profiles` (2 rows)
- `activity_logs` (120 rows)
- `event_registrations` (2 rows)
- `resources` (32 rows)
- `services` (4 rows)
- `admin_patents` (3 rows)

### Tables Not Found (May Not Exist in Supabase)
- `news`
- `events`
- `technologies`
- `patents`
- `ip_applications` and related tables
- `admin_users`
- `service_requests`
- `notifications`

## Troubleshooting

### "psql is not recognized"
Add PostgreSQL bin directory to your PATH:
- Windows: `C:\Program Files\PostgreSQL\14\bin`

### "Connection refused"
Ensure PostgreSQL service is running:
- Windows: Services app → PostgreSQL → Start
- Mac/Linux: `sudo service postgresql start`

### Authentication failed
Check your PostgreSQL password in pg_hba.conf or use trust authentication for local development.

### Schema errors
Some Supabase-specific syntax may need manual adjustment. Check the error messages and modify the SQL files accordingly.
