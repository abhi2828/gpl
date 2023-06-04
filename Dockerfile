
FROM node:14.17.3 as builder

RUN mkdir /app

WORKDIR /app

# Only copy the package.json file to cache dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Copy the rest of the files
COPY . .

RUN ls /app/nginx

RUN cat /app/nginx/default.conf

ARG ACTIVE_PROFILE

RUN npm run build-$ACTIVE_PROFILE


# Stage 2

FROM nginx:1.17.1-alpine

#!/bin/sh

COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]