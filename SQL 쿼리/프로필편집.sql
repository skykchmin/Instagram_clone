
-- 프로필 수정

update User
set userName = ?, userNickName = ?, userSite = ?, userIntroduce = ?
where userNickNameIdx = ? ;