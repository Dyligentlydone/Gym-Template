# Use standard Node image instead of Alpine to avoid musl compatibility issues
FROM node:18

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install dependencies with clean environment
WORKDIR /app/frontend
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install

# Copy frontend source
COPY frontend/ ./

# Build the app
RUN npm run build

# Expose the port
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
