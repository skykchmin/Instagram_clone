select User.userNickNameIdx, userName, userNickName, userProfilePicture
from User
         inner join CommentLike on CommentLike.userNickNameIdx = User.userNickNameIdx
         inner join Feed on CommentLike.feedIdx = Feed.feedIdx
where CommentLike.commentIdx = ?;