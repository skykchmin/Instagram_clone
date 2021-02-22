
-- 팔로우할 사람을 뽑아낸다
select fromUserIdx
from User
inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
where toUserIdx = ?;


-- 이런 식으로 where 문만 바뀌면 된다

select userNickNameIdx, userNickName, userIntroduce, userProfilePicture
from User
where userNickNameIdx = 1
;

select userNickNameIdx, userNickName, userIntroduce, userProfilePicture
from User
where userNickNameIdx = 2
;

