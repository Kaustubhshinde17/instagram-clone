FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Generate prisma artifacts if schema exists
RUN npx prisma generate --schema=prisma/schema.prisma || true
EXPOSE 4000
CMD ["npm", "run", "start"]
