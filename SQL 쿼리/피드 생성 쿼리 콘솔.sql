use Instagram;

insert into Feed (userNickNameIdx,feedCreateDate,feedUpdateDate, caption) values (?,now(),now(),?);

insert into Media (feedIdx, mediaIdx,mediaURL) values (LAST_INSERT_ID(),?,?);
