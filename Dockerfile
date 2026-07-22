FROM node:20-bookworm-slim

RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3002

RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]