use Instagram;
update Liked set likeStatus = ? where feedIdx =? and userNickNameIdx = ?;

update Liked
set likeStatus = if(likeStatus = 'L', 'U', 'L')
where feedIdx = ? and userNickNameIdx = ?;