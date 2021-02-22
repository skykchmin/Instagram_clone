select *
from User
inner join Feed on Feed.userNickNameIdx = User.userNickNameIdx
inner join Media on Feed.feedIdx = Media.feedIdx
where User.userNickNameIdx = 1;

-- profile
select userNickNameIdx,userNickName, userProfilePicture,userSite,userIntroduce
from User
where userNickNameIdx = ?;

-- following
select count(fromUserIdx) as 'followingCount'
from User
inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
where User.userNickNameIdx = ? and followStatus ='F';

-- follower
select count(toUserIdx) as 'followerCount'
from User
inner join FollowingFollower on FollowingFollower.fromUserIdx = User.userNickNameIdx
where User.userNickNameIdx = ? and followStatus ='F';

--
# 피드 조회
select Feed.feedIdx, mediaIdx, mediaURL
from Feed
    inner join Media on Feed.feedIdx = Media.feedIdx
    inner join User on Feed.userNickNameIdx = User.userNickNameIdx
where User.userNickNameIdx = ?
group by Feed.feedIdx;

-- 피드 카운트
select count(Feed.feedIdx) as FeedCount
from Feed
    inner join User on Feed.userNickNameIdx = User.userNickNameIdx
where User.userNickNameIdx = ?







# select count(follower)
# from (select fromUserIdx
# from User
# inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
# where toUserIdx = ? and followStatus ='F') as follower,
#      (
# select toUserIdx
# from User
# inner join FollowingFollower on FollowingFollower.fromUserIdx = User.userNickNameIdx
# where fromUserIdx = ? and followStatus ='F'
#     ) as following,
#     User
# where userNickNameIdx = ?

# select count(fromUserIdx)
# from FollowingFollower
# where toUserIdx = ? and followStatus ='F';
#
# select
#     COUNT (case when toUserIdx = ? and followStatus ='F' then 1 end) as '팔로워수',
#     COUNT (case when fromUserIdx = ? and followStatus ='F' then 1 end) as '팔로잉수'
# from FollowingFollower