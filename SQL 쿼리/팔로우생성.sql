
-- 상대방의 공개범위 찾기
select userDisclosureScope
from User
where userNickNameIdx = ?;

-- 팔로우 할 사람이 비공개이면
select
    case
        when userDisclosureScope = 0
        then '공개'
        when userDisclosureScope = 1
        then '비공개'
        end as userDisclosureScope
from User
where userNickNameIdx = ?;


-- 공개범위 확인
select userNickNameIdx, toUserIdx, fromUserIdx,
    case
        when userDisclosureScope = 0
        then '공개'
        when userDisclosureScope = 1
        then '비공개'
        end as userDisclosureScope
from User
inner join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
where FollowingFollower.fromUserIdx = ?
group by fromUserIdx
;

-- 비공개 유저 팔로잉 신청
update FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
set followStatus =
    case
        when followStatus = 'F' then 'N' -- 팔로우인 상태인데 끊는거
        when followStatus = 'N' and userDisclosureScope = 0 then 'F' -- 공개일때
        when followStatus = 'N' and userDisclosureScope = 1 then 'W' -- 비공개일때
    end
where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?
;

-- 실험
update FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
set followStatus =
    case
        when followStatus = 'F' then 'N' -- 팔로우인 상태인데 끊는거
        when followStatus = 'N' and userDisclosureScope = 0 then 'F' -- 공개일때 바로 팔로잉 상태로 바뀐다
        when followStatus = 'N' and userDisclosureScope = 1 then 'W' -- 비공개일때 수락대기상태로 바뀐다
        when followStatus = 'W' and userDisclosureScope = 1 then 'W' -- 수락 대기 상태가 유지
    end
where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?
;

-- 비공개 유저 정보확인
select toUserIdx, fromUserIdx, followStatus, userNickNameIdx, userDisclosureScope
from FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?;

-- 비공개 유저 팔로잉



-- 팔로우 / 언팔로우 팔로우 됐다가 끊는거는 문제가 없음
update FollowingFollower
set followStatus = if(followStatus = 'F', 'N', 'F')
where toUserIdx = ? and fromUserIdx = ?;

-- 팔로우 / 언팔로우
update FollowingFollower
set followStatus =
    case
        when followStatus = 'F' then 'N'
        when followStatus = 'N' then 'F'
    end
where toUserIdx = ? and fromUserIdx = ?;

-- 비공개 유저 팔로잉 수락
update FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
inner join (
    select userNickNameIdx, toUserIdx, fromUserIdx,
    case
        when userDisclosureScope = 0
        then '공개'
        when userDisclosureScope = 1
        then '비공개'
        end as userDisclosureScope
from User
inner join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
where FollowingFollower.fromUserIdx = ?
group by fromUserIdx
        ) as fo
set followStatus =
    case
        when followStatus = 'F' then 'N' -- 팔로우인 상태인데 끊는거
        when followStatus = 'N' and fo.userDisclosureScope = '공개' then 'F' -- 공개일때
        when followStatus = 'N' and fo.userDisclosureScope = '비공개' then 'W' -- 비공개일때
    end
where User.userNickNameIdx = ? and fo.fromUserIdx = ?
;



# -- 비공개 유저 팔로잉 수락
# update FollowingFollower
# inner join User
# inner join (
#     select userNickNameIdx, toUserIdx, fromUserIdx,
#     case
#         when userDisclosureScope = 0
#         then '공개'
#         when userDisclosureScope = 1
#         then '비공개'
#         end as userDisclosureScope
# from User
# inner join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
# where FollowingFollower.fromUserIdx = ?
# group by fromUserIdx
#         ) as fo
# set followStatus =
#     case
#         when followStatus = 'F' then 'N' -- 팔로우인 상태인데 끊는거
#         when followStatus = 'N' and User.userDisclosureScope = 0 then 'F' -- 공개일때
#         when followStatus = 'N' and User.userDisclosureScope = 1 then 'W' -- 비공개일때
#     end
# where FollowingFollower.toUserIdx = ? and fo.fromUserIdx = ?
# ;




-- 비공개 유저 팔로잉 수락
update FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
set followStatus =
    case
        when followStatus ='W' then 'F'
        when followStatus ='F' then 'F' -- 팔로우 되어있을때 null로 바뀌는 것 방지
        when followStatus ='N' then 'N' -- 팔로우 되어있지않을 때 null로 바뀌는 것 방지
    end
where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?;

-- 비공개 유저 팔로잉 거절
update FollowingFollower
inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
set followStatus =
    case
        when followStatus ='W' then 'N'
        when followStatus ='F' then 'F' -- 팔로우 되어있을때 null로 바뀌는 것 방지
        when followStatus ='N' then 'N' -- 팔로우 되어있지않을 때 null로 바뀌는 것 방지
    end
where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?;




-- userNickNameIdx, touserIdx, fromIdx
select *
from User
inner join FollowingFollower on userNickNameIdx = toUserIdx

