FROM node:16

# Select the main app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you're running a production build - use
# RUN npm ci --only=production
# It allows for only production packages to
# be installed

# Copy app source code
COPY . .

# Expose the communication port of the dockerfile
EXPOSE 3000

# Finally run the application
CMD [ "node", "index.js" ]