'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config.json');

const KEY = config.key;
const TOKEN = config.token;

let trelloRegex = /{{(.*)}}/gi;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  let body = req.body;
  // let 
  if(body && body.commits){
    body.commits.forEach(function(commit){
      let trelloCardId = commit.message.match(trelloRegex);
      if(trelloCardId && trelloCardId[0]){
        trelloCardId = trelloCardId[0].replace(/{/gi, '').replace(/}/gi, '');
      }
      request.post({url: `https://api.trello.com/1/cards/${trelloCardId}/attachments?key=${KEY}&token=${TOKEN}&url=${commit.url}`}, function(err){
        if(err){
          console.error('error sending to trello', err);
        }
      });
    });
  }
  res.status(200).send();
});

module.exports = router;
