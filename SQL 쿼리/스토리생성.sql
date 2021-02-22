
-- 스토리 생성
insert into Story(userNickNameIdx, highlight, storyMedia, storyCreateTime, storyStatus)
values (?, ?, ?, now(), ?);

CREATE EVENT statusChange
    on schedule
        every 10 second
            do
update Story
set storyStatus =
case
    when TIMESTAMPDIFF(HOUR , storyCreateTime, current_time()) >= 24
        then 1
    when TIMESTAMPDIFF(HOUR , storyCreateTime, current_time()) <= 24
        then 0
    end
where storyStatus = ?;


show create event statusChange;
drop event statusChange;