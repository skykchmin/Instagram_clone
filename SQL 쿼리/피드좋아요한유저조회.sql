select userProfilePicture,
       Liked.userNickNameIdx,
       userNickName,
       userName,
       followStatus
from Liked
inner join User on Liked.userNickNameIdx = User.userNickNameIdx
inner join FollowingFollower on fromUserIdx = User.userNickNameIdx
where feedIdx=?;



 SELECT feedIdx,userNickNameIdx
                FROM Feed
                WHERE feedIdx = ? and userNickNameIdx = ?