# 1. Use the official Node.js image
FROM node:18-alpine

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --production

# 4. Bundle app source
COPY . .

# 5. Your app binds to port 5000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5000

# 6. Define the command to run your app
CMD [ "node", "server.js" ]