# Multi-stage build for React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for API URL (passed from Render environment)
# This is required because Create React App embeds env vars at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Create .env file from build arg if provided (fallback for Render)
# This ensures the env var is available during build
RUN if [ -n "$REACT_APP_API_URL" ]; then \
      echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env && \
      echo "Created .env with REACT_APP_API_URL=$REACT_APP_API_URL"; \
    else \
      echo "Warning: REACT_APP_API_URL not set"; \
    fi

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
