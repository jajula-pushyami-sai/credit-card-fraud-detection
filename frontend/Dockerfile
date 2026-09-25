# ---------------------------------------------------------
# Stage 1: Build React/Vite App
# ---------------------------------------------------------
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build for production
RUN npm run build

# ---------------------------------------------------------
# Stage 2: Serve via Nginx
# ---------------------------------------------------------
FROM nginx:1.25-alpine

# Copy the compiled Vite dist folder to the Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
