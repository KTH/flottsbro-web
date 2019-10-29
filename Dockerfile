FROM kthse/kth-nodejs:12.0.0

# Copy files used by Gulp.
COPY ["public", "public"]
COPY ["i18n", "i18n"]
COPY ["gulpfile.js", "gulpfile.js"]
COPY ["package-lock.json", "package-lock.json"]
COPY ["package.json", "package.json"]
RUN npm run docker

# Copy source files, so changes does not trigger gulp.
COPY ["config", "config"]
COPY ["app.js", "app.js"]
COPY ["server", "server"]

EXPOSE 3000

CMD ["node", "app.js"]
