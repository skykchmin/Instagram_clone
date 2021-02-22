module.exports = function(app){
    const story = require('../controllers/storyController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/stories', story.insertStory); // 스토리 생성
    app.patch('/stories/:userIdx', story.patchStory); // 스토리 삭제
    // app.get('/check', jwtMiddleware, user.check);

    app.post('/stories-histories', story.insertStoryHistory); //스토리본기록생성
    app.get('/stories-histories/:storyIdx',story.getStoryHistory); //스토리본 유저목록
    app.get('/stories-feeds/:userNickNameIdx',story.getStoryFeed); //피드화면스토리조회
    app.get('/stories/:userNickNameIdx',story.getStory);//유저별 스토리조회

    app.patch('/stories-highLight', story.patchHighlight); // 하이라이트 생성
    app.get('/stories-highLight/:highLightIdx',story.getHighlight); // 하이라이트 조회
    app.delete('/stories-highLight/:highLightIdx', story.deleteHighlight) // 하이라이트 삭제
};