FROM kthse/kth-nodejs:12.0.0

RUN apk --no-cache add python3 make

COPY ["public", "public"]
COPY ["i18n", "i18n"]
COPY ["gulpfile.js", "gulpfile.js"]

COPY ["config", "config"]
COPY ["app.js", "app.js"]
COPY ["server", "server"]

COPY ["package.json", "package.json"]
COPY ["build.sh", "build.sh"]

RUN ["npm", "run", "docker"]

EXPOSE 3000

CMD ["npm", "start"]

