use Instagram;
# 피드 조회
select Feed.feedIdx         as '피드인덱스',
       userProfilePicture   as '피드올린유저프로필사진',
       User.usernickName    as '피드올린유저닉네임',
       User.userNickNameIdx as '피드올린유저인덱스',
       caption              as '피드 캡션',
       likeCount            as '좋아요합계',
       commentLikeCount     as '댓글 개수',
       mediaIdx             as '미디어 번호',
       group_concat(mediaURL)            as '피드올라간 사진/영상 URL',
       com.commentIdx       as '첫번째 댓글 인덱스',
       com.commentText      as '첫번째 댓글 내용',
       com.userNickNameIdx  as '첫번째 댓글 유저닉네임번호',
       com.userNickName     as '첫번째 댓글 유저 닉네임',
       feedCreateDate
from Feed
         inner join Media on Feed.feedIdx = Media.feedIdx
         inner join User on Feed.userNickNameIdx = User.userNickNameIdx
         left join (select feedIdx, count(feedIdx) likeCount,likeStatus from Liked where likeStatus='L' group by feedIdx) 좋아요
                    on Feed.feedIdx = 좋아요.feedIdx
         left join (select Comment.feedIdx, count(commentIdx) commentLikeCount from Comment group by feedIdx) 댓글수
                    on Feed.feedIdx = 댓글수.feedIdx
         left join (select commentIdx, commentText, User.userNickNameIdx, userNickName, feedIdx
                     from User
                              inner join Comment C on User.userNickNameIdx = C.userNickNameIdx
                     group by feedIdx) com
                    on com.feedIdx = Feed.feedIdx

group by Media.feedIdx;
#where Feed.userNickNameIdx = ?;

# group 묶기
select feedIdx,group_concat(mediaURL)
 from Media group by feedIdx;

#사용자 피드조회
select Feed.feedIdx        as 'feedIdx',
       userProfilePicture   as 'userProfilePicture',
       User.userNickName    as 'userNickName',
       User.userNickNameIdx as 'userNickNameIdx',
       caption              as 'caption',
       likeCount            as 'likeCount',
       commentLikeCount     as 'commentCount',
       com.commentIdx       as 'firstCommentIdx',
       com.commentText      as 'firstCommentText',
       com.userNickNameIdx  as 'firstUserNickNameIdx',
       com.userNickName     as 'firstUserNickName',
       feedCreateDate
from Feed
        inner join User on Feed.userNickNameIdx = User.userNickNameIdx
         left join (select feedIdx, count(feedIdx) likeCount,likeStatus from Liked where likeStatus='L' group by feedIdx) 좋아요
                    on Feed.feedIdx = 좋아요.feedIdx
         left join (select Comment.feedIdx, count(commentIdx) commentLikeCount from Comment group by feedIdx) 댓글수
                    on Feed.feedIdx = 댓글수.feedIdx
         left join (select commentIdx, commentText, User.userNickNameIdx, userNickName, feedIdx
                     from User
                              inner join Comment C on User.userNickNameIdx = C.userNickNameIdx
                     group by feedIdx) com
                    on com.feedIdx = Feed.feedIdx
where Feed.userNickNameIdx = ?;

select Feed.feedIdx,
       group_concat(mediaURL)
from Media
inner join Feed on Feed.feedIdx = Media.feedIdx
where Feed.feedIdx =?;

