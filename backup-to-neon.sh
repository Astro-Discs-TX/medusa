#!/bin/bash

# Colors for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function for logging with timestamps
log() {
  echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

success() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

warning() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Load environment variables from .env file
if [ -f .env ]; then
  log "Loading database credentials from .env file"
  export $(grep -v '^#' .env | xargs)
else
  error ".env file not found. Please create one with LOCAL_DB_URL and NEON_DB_URL variables."
  exit 1
fi

# Check if required environment variables are set
if [ -z "$LOCAL_DB_URL" ]; then
  error "LOCAL_DB_URL is not set in .env file"
  exit 1
fi

if [ -z "$NEON_DB_URL" ]; then
  error "NEON_DB_URL is not set in .env file"
  exit 1
fi

# Extract database names for logging
LOCAL_DB_NAME=$(echo $LOCAL_DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
NEON_DB_NAME=$(echo $NEON_DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create a timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="medusa_backup_${TIMESTAMP}.sql"

log "Starting database backup process..."
log "Source: Local PostgreSQL database ($LOCAL_DB_NAME)"
log "Destination: Neon DB ($NEON_DB_NAME)"
log "Backup file: $BACKUP_FILE"

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    error "pg_dump is not installed. Please install PostgreSQL client tools."
    exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    error "psql is not installed. Please install PostgreSQL client tools."
    exit 1
fi

# Step 1: Dump the local database
log "Dumping local database to $BACKUP_FILE..."
pg_dump "$LOCAL_DB_URL" -v -F c -f "$BACKUP_FILE" 2> dump_errors.log

if [ $? -ne 0 ]; then
    error "Failed to dump local database. Check dump_errors.log for details."
    cat dump_errors.log
    exit 1
fi

success "Local database dumped successfully!"
log "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Step 2: Check if we can connect to Neon DB
log "Testing connection to Neon DB..."
if ! psql "$NEON_DB_URL" -c "SELECT 1" > /dev/null 2>&1; then
    error "Failed to connect to Neon DB. Please check your connection string."
    exit 1
fi

success "Successfully connected to Neon DB!"

# Step 3: Confirm before proceeding
echo ""
warning "This will overwrite data in your Neon DB ($NEON_DB_NAME)."
read -p "Are you sure you want to continue? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Backup process cancelled by user."
    exit 0
fi

# Step 4: Restore to Neon DB
log "Restoring backup to Neon DB..."
log "This may take some time depending on the database size..."

# First, drop all connections to the database
psql "$NEON_DB_URL" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();" > /dev/null 2>&1

# Restore the database
pg_restore --clean --if-exists --no-owner --no-privileges --verbose --dbname="$NEON_DB_URL" "$BACKUP_FILE" 2> restore_errors.log

if [ $? -ne 0 ]; then
    # pg_restore often returns non-zero even on successful restores with warnings
    warning "Restore completed with warnings. Check restore_errors.log for details."
    cat restore_errors.log
else
    success "Database restored successfully to Neon DB!"
fi

# Step 5: Verify the restore by counting tables
log "Verifying restore by comparing table counts..."

LOCAL_TABLES=$(psql "$LOCAL_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d '[:space:]')
NEON_TABLES=$(psql "$NEON_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d '[:space:]')

log "Local database table count: $LOCAL_TABLES"
log "Neon database table count: $NEON_TABLES"

if [ "$LOCAL_TABLES" == "$NEON_TABLES" ]; then
    success "Table count verification passed!"
else
    warning "Table count mismatch. This doesn't necessarily mean the backup failed, but you should verify the data manually."
fi

# Step 6: Cleanup
read -p "Do you want to keep the backup file ($BACKUP_FILE)? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Removing backup file..."
    rm "$BACKUP_FILE"
    log "Backup file removed."
else
    log "Backup file kept at: $(pwd)/$BACKUP_FILE"
fi

echo ""
success "Backup and restore process completed!"
log "Local database: $LOCAL_DB_NAME"
log "Neon database: $NEON_DB_NAME"
echo "" 