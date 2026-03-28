FROM node:22

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build 

CMD ["node", "dist/server.js"]


