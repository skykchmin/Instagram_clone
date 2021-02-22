module.exports = function(app){
    const user = require('../controllers/userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // app.route('/app/signUp').post(user.signUp);
    // app.route('/app/signIn').post(user.signIn);

    app.post('/login', user.signIn);

    app.post('/signup', user.signUp);
    app.get('/signup-emails/:userEmails', user.userEmailCheck);
    app.get('/signup-nicknames/:userNickNames', user.userNickNameCheck);
    
    app.patch('/users/:userIdx/profiles', user.patchUserProfiles); // 프로필 편집
    app.patch('/users/:userIdx/details', user.patchUserDetails); // 개인정보 변경
    app.patch('/users/:userIdx/profiles/img', user.patchProfilesPicture); // 프로필 사진 수정

    // app.get('/selectfromFollowerIdx', user.selectfromFollowerIdx); // 팔로우할 번호 가져오기
    app.get('/selectfromFollowerIdx/:touserIdx', user.selectfromFollowerIdx); // 팔로우할 번호 가져오기
    // app.get('/search', user.followSearch);
    app.get('/search/:touserIdx', user.followSearch); // 검색
    app.get('/users/:userIdx/profiles', user.selectUserProfiles); // 프로필 조회

    app.get('/check', jwtMiddleware, user.check);
};