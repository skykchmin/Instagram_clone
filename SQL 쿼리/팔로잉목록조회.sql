
-- 팔로잉하고 있는 사람들 목록을 보여준다
select fromUserIdx
from User
inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
where toUserIdx = ? and followStatus ='N';

-- 이런식으로 where 조건만 바꿔준다
select userNickNameIdx, userNickName, userIntroduce, userProfilePicture
from User
where userNickNameIdx = 1
;