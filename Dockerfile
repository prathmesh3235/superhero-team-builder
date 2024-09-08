FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chgrp -R 0 /app && chmod -R g=u /app && chmod -R 777 /app/.next

USER 1001

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "dev"]
