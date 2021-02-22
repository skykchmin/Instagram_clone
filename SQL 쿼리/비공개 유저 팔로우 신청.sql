-- 비공개 유저 팔로잉 신청
update FollowingFollower
inner join User
inner join (
    select userNickNameIdx, toUserIdx, fromUserIdx,
    case
        when userDisclosureScope = 0
        then '공개'
        when userDisclosureScope = 1
        then '비공개'
        end as userDisclosureScope
from User
left join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
where FollowingFollower.fromUserIdx = ?
group by fromUserIdx
        ) as follow
set followStatus =
    case
        when followStatus = 'F' then 'N' -- 팔로우인 상태인데 끊는거
        when followStatus = 'N' and follow.userDisclosureScope = '공개' then 'F' -- 공개일때
        when followStatus = 'N' and follow.userDisclosureScope = '비공개' then 'W' -- 비공개일때
    end
where User.userNickNameIdx = ? and follow.fromUserIdx = ? ;