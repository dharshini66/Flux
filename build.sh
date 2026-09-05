#!/usr/bin/env bash
# exit on error
set -o errexit

echo ">>> Building React frontend..."
cd frontend
npm install
npm run build
cd ..

echo ">>> Installing backend dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt
