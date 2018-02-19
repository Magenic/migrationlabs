############################################################
# Dockerfile to build Swagger Compare Node Application 
# container image, based on node image
############################################################
FROM node:latest

LABEL Author="Stuart Williams <stuartw@magenic.com>"
LABEL Version="1.4"

# Variables
ENV PORT 8080
ENV WDIR /usr/src/peoplesvc

# Create app directory
RUN mkdir -p ${WDIR}
WORKDIR ${WDIR}

# Bundle app source
COPY . .

# run NPM install
RUN npm install

# Verify files are there
RUN find ${WDIR} -type f  -follow -print | grep -v ./node_modules

# Port for Web
EXPOSE ${PORT}

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT} || exit 1

# Start the app
CMD [ "npm", "start" ]