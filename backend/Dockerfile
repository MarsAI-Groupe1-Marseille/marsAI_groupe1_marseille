# 1. On part d'une image Node.js stable
# Utilisation de Node 20 (version stable pour tes dépendances)
FROM node:20-alpine

# 2. On définit le dossier de travail dans le container
WORKDIR /app

# 3. On copie les fichiers de dépendances
COPY package*.json ./

# 4. Installation des dépendances (y compris bcrypt et mysql2)
RUN npm install

# 5. On copie tout le reste du code source dans le container
COPY . .

# 6. On expose le port que notre serveur utilise (ex: 3000, d'après ton server.js)
EXPOSE 3000

# 7. La commande pour lancer le serveur
CMD ["npm", "start"]