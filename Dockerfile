# Usar una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias necesarias para React
# En este caso, evitamos conflictos futuros con permisos al instalar globalmente
RUN npm install -g npm@10.8.2

# Copiar los archivos del proyecto (excepto node_modules)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto que usará Vite para desarrollo
EXPOSE 3000

# Comando para iniciar el servidor de desarrollo de React con hot reload
CMD ["npm", "run", "dev"]
