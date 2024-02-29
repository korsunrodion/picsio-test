FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app
ARG NODE_ENV
ARG MONGO_URI
ARG TEST_MONGO_URI
ARG PORT
ENV NODE_ENV=${NODE_ENV}
ENV MONGO_URI=${MONGO_URI}
ENV TEST_MONGO_URI=${TEST_MONGO_URI}
ENV PORT=${PORT}

RUN apk update

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .

RUN npm install
RUN npm run build --clean

CMD if [ "$NODE_ENV" = "production" ]; then npm run start; else npm run dev; fi

EXPOSE 5000