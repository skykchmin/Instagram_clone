module.exports = function(app){
    const comment = require('../controllers/commentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/feeds/:feedIdx/comments',comment.insertcomments);
    app.get('/feeds/:feedIdx/comments',comment.getcomments);
    //app.patch('/feeds/:feedIdx/likes',like.patchlikes);
    app.post('/feeds/:feedIdx/replies',comment.insertreplies);
    app.delete('/feeds/comments/:commentIdx',comment.deletecomments);
};