# Use Bun as the base image
FROM oven/bun:1.2.2-slim AS base

# Set the working directory
WORKDIR /app

# Copy package.json, bun.lock and install dependencies
COPY package.json bun.lock ./
RUN bun install --production

# Copy the entire app (including server.ts)
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the Express server
CMD ["bun", "server.ts"]
