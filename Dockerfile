FROM node:18 as build
WORKDIR /usr/src/app

ARG REACT_APP_BASE_URL
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

RUN echo $REACT_APP_BASE_URL
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build

FROM nginx:1.21.1-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
