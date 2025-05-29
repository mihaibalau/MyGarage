FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NEXT_PUBLIC_IGNORE_ESLINT=1
ENV NEXT_PUBLIC_API_URL=http://backend:3001
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]
