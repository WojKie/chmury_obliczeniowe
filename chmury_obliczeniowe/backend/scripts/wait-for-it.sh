#!/bin/bash
# Wait for the DB to be ready
wait-for-it.sh db:5432

# Run migrations
python co_proj/manage.py migrate

# Start server
python co_proj/manage.py runserver 0.0.0.0:8000