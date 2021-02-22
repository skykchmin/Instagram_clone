module.exports = function(app){
    const feed = require('../controllers/feedController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/feeds',feed.getfeeds);
    app.get('/feeds/:userIdx',feed.getuserfeeds);
    app.post('/feeds',feed.insertfeed);
    app.delete('/feeds/:feedIdx',feed.deletefeed);
    app.patch('/feeds/:feedIdx',feed.patchfeeds);
    app.post('/testfeeds',feed.testfeeds);



    app.get('/feeds/:feedIdx/mediaurl',feed.getmediaurl);

};