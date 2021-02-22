module.exports = function(app){
    const auth = require('../controllers/authController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

   // app.get('/app', jwtMiddleware, index.default);
   app.get('/naverlogin', function (req, res) {
    var express = require('express');
    var app = express();
    var client_id = 'jCjLGnrWkHAEXr_Hv0M4';
    var client_secret = 'mpMq84Jqio';
    var state = "RAMDOM_STATE";
    var redirectURI = encodeURI("http://127.0.0.1:3000/auth/naver");
    var api_url = "";
    api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
     res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
     res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
   });
   app.get('/callback', function (req, res) {
      code = req.query.code;
      state = req.query.state;
      api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
       + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
      var request = require('request');
      var options = {
          url: api_url,
          headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
       };
      request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          res.end(body);
        } else {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      });
  
  
  });
  app.get('/auth/naver/user', auth.naver);
};
