FROM node:14.16.1-buster-slim
RUN apt-get update && \
    apt-get install -y 
RUN apt-get install -y tzdata
ENV TZ Asia/Bangkok
    
EXPOSE 3000
WORKDIR /app
COPY . /app
RUN npm install
CMD [ "npm", "start" ]