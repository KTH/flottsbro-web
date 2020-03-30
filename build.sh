#!/bin/sh

npm audit fix
npm install
npm run build
npm prune --production