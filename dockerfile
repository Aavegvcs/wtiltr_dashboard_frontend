# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on (Vite defaults to port 5173)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "start"]
