FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true
EXPOSE 3000
CMD ["npm", "run", "start"]
