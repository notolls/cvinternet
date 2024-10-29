# Use the official Nginx image as base image
FROM nginx:alpine

# Copy Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy static files to Nginx web root
COPY public /usr/share/nginx/html

# Expose port 80 to allow external access
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]