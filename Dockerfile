FROM kthse/kth-nodejs:12.0.0

RUN mkdir -p /npm && \
    mkdir -p /application


# We do this to avoid npm install when we're only changing code
WORKDIR /npm

COPY ["package.json", "package.json"]

RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python && \
    npm install --quiet node-gyp -g &&\
    npm install --quiet && \
    apk del native-deps && \
    apk add --no-cache --virtual .gyp \
        python2 \
        python2-dev \
        build-base \
        make \
        .gyp \
        g++ && \
    npm install --production --no-optional && \
    apk del .gyp g++ gcc libgcc libstdc++ linux-headers make python python2 python2-dev build-base

# Add the code and copy over the node_modules-catalog
WORKDIR /application
RUN cp -a /npm/node_modules /application && \
    rm -rf /npm

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

ENV NODE_PATH /application

EXPOSE 3000

CMD ["node", "app.js"]
