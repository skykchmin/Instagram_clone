module.exports = function(app){
    const follow = require('../controllers/followController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // app.route('/app/signUp').post(user.signUp);
    
    // app.patch('/users/:userIdx/profiles', user.patchUserProfiles); // 프로필 편집
    // app.patch('/follow/touser/:touserIdx/fromuser/:fromuserIdx', follow.patchCreateFollow); // 팔로우생성
    app.get('/following/selectfromFollowingStatusIdx/:touserIdx', follow.selectfromFollowingStatusIdx); // 팔로우할 번호 가져오기
    app.get('/following/:touserIdx', follow.followingUser);
    app.get('/follower/selectfromFollowerStatusIdx/:fromuserIdx', follow.selectfromFollowerStatusIdx); // 팔로우할 번호 가져오기
    app.get('/follower/:fromuserIdx', follow.followerUser);

    app.patch('/follow/private/send/:touserIdx/:fromuserIdx', follow.sendPrivateFollowing); // 비공개 유저일 때 전송

    app.patch('/follow/private/acceptance/:touserIdx/:fromuserIdx', follow.patchAcceptFollowing) // 비공개 유저일 때 수락
    app.patch('/follow/private/denial/:touserIdx/:fromuserIdx', follow.patchDenialFollowing) // 비공개 유저일 때 수락

    app.patch('/follow/:touserIdx/:fromuserIdx', follow.patchFollowUnfollow) // 팔로우,언팔로우

    app.get('/follow/private/search/:fromuserIdx', follow.selectPrivateSearch); // 비공개 유저 공개범위 찾기

    
    
};