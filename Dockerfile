FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install
RUN cd server && npm  install

COPY . .

EXPOSE 3000 5173

CMD ["npm", "run", "dev"]