# Use official Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy all files into container
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the app using a simple web server (http-server)
RUN npm install -g http-server

# Serve index.html on port 8080
CMD ["http-server", "-p", "8080"]
