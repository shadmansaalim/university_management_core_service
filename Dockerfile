FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3002

RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]