FROM node:20.9.0
WORKDIR /opt/NPA
COPY . .
RUN npm install
EXPOSE 9080
CMD [ "node", "app.js", "--port", "9080", "--application", "test" ]