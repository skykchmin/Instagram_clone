use Instagram;
select userProfilePicture,
       Story.userNickNameIdx

from User
inner join FollowingFollower on FollowingFollower.fromUserIdx = userNickNameIdx
inner join Story on Story.userNickNameIdx = fromUserIdx
where toUserIdx = ? and followStatus ='F'
order by storyCreateTime desc;