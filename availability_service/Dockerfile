# Node image for availability_service

FROM node:8.4.0

COPY package.json .
RUN npm i
COPY . .

EXPOSE 3002

CMD ["npm", "start"]
