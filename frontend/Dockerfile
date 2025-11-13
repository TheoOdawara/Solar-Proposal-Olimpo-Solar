FROM node:20-alpine

WORKDIR /app

# Apenas copiar package.json e instalar dependências
# Os arquivos de código virão via volume mount
COPY package.json ./

# Instalar dependências
RUN npm install

# Expor porta
EXPOSE 8080

# Comando padrão
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
