FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN yarn build

EXPOSE 3002

RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]