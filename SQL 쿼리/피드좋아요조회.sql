use Instagram;

select User.userNickNameIdx,userName,userNickName,userProfilePicture
from User inner join Liked on Liked.userNickNameIdx = User.userNickNameIdx
inner join Feed on Liked.feedIdx = Feed.feedIdx
where Feed.feedIdx =?

#left join FollowingFollower on fromUserIdx = User.userNickNameIdx