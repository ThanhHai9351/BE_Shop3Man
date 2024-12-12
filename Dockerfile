FROM node:18

WORKDIR /src

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npx ts-node --version

COPY . .

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 3001
CMD ["npx", "nodemon", "--exec", "npx ts-node", "src/index.ts"]
# CMD ["npm", "run", "dev"]