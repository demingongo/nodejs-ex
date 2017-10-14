FROM node
RUN npm install
ENTRYPOINT exec npm start
