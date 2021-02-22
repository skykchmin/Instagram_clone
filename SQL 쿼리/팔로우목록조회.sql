
-- 팔로잉하고 있는 사람들 목록을 보여준다
select toUserIdx
from User
inner join FollowingFollower on FollowingFollower.fromUserIdx = User.userNickNameIdx
where fromUserIdx = ? and followStatus ='F';

-- 이런식으로 where 조건만 바꿔준다
select userNickNameIdx, userNickName, userIntroduce, userProfilePicture
from User
where userNickNameIdx = 1
;