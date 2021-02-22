use Instagram;
insert into Comment (feedIdx,
                     userNickNameIdx,
                     commentText,
                     commentParentChild,

                     commentCreateDate)

values (?,?,?,'P',now());

update Comment set parentCommentIdx = last_insert_id()
where commentIdx = last_insert_id();

