use Instagram;
insert into Comment (feedIdx,
                     userNickNameIdx,
                     commentText,
                     commentParentChild,
                     parentCommentIdx,
                     commentCreateDate)

values (?,?,?,'C',?,now());