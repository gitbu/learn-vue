#!/bin/bash

npm run build

cd dist

git init
git add .
git commit -m "deploy"
git push -f https://github.com/gitbu/learn-vue.git master:gh-pages

cd -
