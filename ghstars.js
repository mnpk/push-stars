#! /usr/bin/env node

var https = require('https')
var url = require('url')
var PushBullet = require('pushbullet')
var pusher = new PushBullet(process.env.PUSHBULLET_APIKEY)
var util = require('util')

var get_repos = function(host, path, r, done) {
  console.log('getting...', path)
  var options = {
    method: 'GET',
    host: host,
    path: path,
    headers: {'User-Agent': 'github-stars'}
  }
  https.get(options, function(res) {
    buffer = ''
    res.on('data', function(data) {
      buffer += data
    })
    res.on('end', function() {
      var repos = JSON.parse(buffer)
      var total_count = r['total_count']
      for (i in repos) {
        total_count += repos[i].stargazers_count
        r[repos[i].full_name] = repos[i].stargazers_count
      }
      r['total_count'] = total_count
      if (res.headers.link) {
        var next = res.headers.link.match(/<([^>]*)>; rel="next"/)
        if (next) {
          var parsed_url = url.parse(next[1])
          get_repos(parsed_url.host, parsed_url.path, r, done)
        } else {
          done(r)
        }
      }
    })
    res.on('error', function(err) {
      console.log(err)
    })
  })
}

var username = 'mnpk'
var host = 'api.github.com'
var path = '/users/%/repos'.replace('%', username)
var last = {}

var fetch = function() {
  console.log(new Date().toLocaleString(), 'fetching...')
  var r = {
    total_count: 0,
  }
  get_repos(host, path, r, function(res) {
    console.log("total stars:", res['total_count'])
    if (last.total_count && (res.total_count > last.total_count)) {
      for (name in res) {
        if (name == 'total_count') continue
        if (res[name] > last[name]) {
          var msg_title = 'New Github Stars! (' + name + ')'
          var msg_body = util.format("New stars on https://github.com/%s. Total %d stars.", name, res.total_count)
          console.log(msg_body)
          pusher.note('', msg_title, msg_body, function(err, res) {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    }
    last = res
  })
}

// update every 5 min
setInterval(function() {
  fetch()
}, 5 * 60 * 1000) 
fetch()

