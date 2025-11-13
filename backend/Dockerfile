FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3001

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "run", "dev"]
