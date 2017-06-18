FROM node
RUN apt-get install libcairo2-dev libjpeg-dev libgif-dev
RUN npm install
ENTRYPOINT exec npm start
