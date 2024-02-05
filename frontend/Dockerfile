FROM node:18-alpine

WORKDIR /react_dev

COPY public/ public/
COPY src/ src/
COPY package.json .
COPY tsconfig.json .

RUN npm install

CMD ["npm", "start"]