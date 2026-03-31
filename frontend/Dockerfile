# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Use a separate image for production serving
FROM node:18-alpine

WORKDIR /app

# Copy the built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]
