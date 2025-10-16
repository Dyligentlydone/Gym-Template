#!/bin/bash
echo "Starting Vite development server..."
npm run dev -- --host --port 5000 2>&1 | tee server.log
