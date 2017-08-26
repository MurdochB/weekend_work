# Node image for dummy_service

FROM node:8.4.0

COPY package.json .
RUN npm i
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
