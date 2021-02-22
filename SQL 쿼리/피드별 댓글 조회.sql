use Instagram;

select Comment.commentIdx,
       Comment.userNickNameIdx,
       userNickName,
       userProfilePicture,
       commentText,
       commentParentChild,
       parentCommentIdx,
       commentlikecount,
       commentCreateDate
from Comment
         inner join User on User.userNickNameIdx = Comment.userNickNameIdx
         inner join Feed on Feed.feedIdx = Comment.feedIdx
        left join(select count(commentIdx)commentlikecount,commentIdx  from CommentLike group by commentIdx)
            commentlike on commentlike.commentIdx = Comment.commentIdx

where Feed.feedIdx = ?
order by parentCommentIdx;




select User.userNickNameIdx, userName, userNickName, userProfilePicture
from User
         inner join CommentLike on CommentLike.userNickNameIdx = User.userNickNameIdx

where CommentLike.commentIdx = ?;