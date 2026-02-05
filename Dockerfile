# Sử dụng Node.js alpine nhẹ
FROM node:20-alpine

# Tạo folder app trong container
WORKDIR /app

# Copy package.json và package-lock.json, cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build NestJS từ TypeScript sang JavaScript
RUN npm run build

# Expose port 3000 (gateway)
EXPOSE 3000

# Lệnh chạy khi container start
CMD ["node", "dist/main.js"]
