FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY . .

CMD ["npx", "prisma", "studio", "--port", "5555", "--browser", "none"]
