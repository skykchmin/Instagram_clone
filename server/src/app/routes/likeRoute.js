module.exports = function(app){
    const like = require('../controllers/likeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/feeds/:feedIdx/likes',like.insertlikes);
    app.get('/feeds/:feedIdx/likes',like.getfeedlikes);
    app.patch('/feeds/:feedIdx/likes',like.patchlikes);


    app.get('/feeds/comments/:commentIdx/likes',like.getlikecomments);
    app.post('/feeds/comments/:commentIdx/likes',like.insertlikescomments);
    app.patch('/feeds/comments/:commentIdx/likes',like.patchlikescomments);
};