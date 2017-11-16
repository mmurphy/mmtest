FROM node:carbon-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 4000
CMD ["npm", "start"]
