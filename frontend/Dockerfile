FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Port par défaut de Vite
EXPOSE 5173

# On lance en mode dev pour garder le HMR (Hot Module Replacement)
CMD ["npm", "run", "dev", "--", "--host"]