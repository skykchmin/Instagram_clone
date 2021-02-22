update Story
set storyStatus =
case
    when TIMESTAMPDIFF(HOUR, storyCreateTime, current_time()) >= 24
        then 1
    when TIMESTAMPDIFF(HOUR, storyCreateTime, current_time()) <= 24
        then 0
    end
where storyIdx = ?;

select TIMESTAMPDIFF(HOUR , storyCreateTime, current_time())
from Story
where storyIdx = ?;

select now();

update Story
set storyStatus =
case
    when TIMESTAMPDIFF(HOUR, storyCreateTime, current_time()) >= 24
        then 1
    when TIMESTAMPDIFF(HOUR, storyCreateTime, current_time()) <= 24
        then 0
    end
where storyStatus = ?;
