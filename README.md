# Push Stars

:octocat: :star: Get Push Notification for your github repo stars.

[![npm](https://img.shields.io/npm/v/push-stars.svg?style=flat-square)](https://www.npmjs.com/package/push-stars)

*\- When someone stared at your repo, this tool will send a [Pushbullet](https://www.pushbullet.com/) notification.*

## Install
```
$ sudo npm install -g push-stars
```

## Run
```bash
# set PUSHBULLET_APIKEY env variable with your Pushbullet Access Token.
$ export PUSHBULLET_APIKEY=xxxxxx

# set GITHUB_NAME env varible with your Github name
$ export GITHUB_NAME=mnpk

# run on background
$ nohup push-stars >> push-stars.log &
```
