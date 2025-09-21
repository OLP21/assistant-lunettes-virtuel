FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install
RUN cd backend && npm install

COPY . .

EXPOSE 3000 5173

CMD ["npm", "run", "dev"]