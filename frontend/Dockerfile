# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and config files
COPY . .

# Debug: Show current directory structure
RUN echo "=== Current directory structure ===" && \
    ls -la

# Build the application
RUN npm run build

# Debug: List contents of build directory
RUN echo "=== Contents of dist/frontend/browser ===" && \
    ls -la dist/frontend/browser && \
    echo "=== Contents of dist/frontend/browser/assets ===" && \
    ls -la dist/frontend/browser/assets || true

# Production stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Debug: List contents of nginx html directory
RUN echo "=== Contents of /usr/share/nginx/html ===" && \
    ls -la /usr/share/nginx/html && \
    echo "=== Contents of /usr/share/nginx/html/assets ===" && \
    ls -la /usr/share/nginx/html/assets || true

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Debug: Show nginx configuration
RUN echo "=== Nginx Configuration ===" && \
    cat /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 