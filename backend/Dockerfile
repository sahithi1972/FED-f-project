FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY dist ./dist

# Create uploads directory
RUN mkdir -p uploads/temp

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]