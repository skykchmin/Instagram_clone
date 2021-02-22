use Instagram;

select userProfilePicture,
       User.userNickNameIdx,
       storyIdx,
       storyMedia,
       storyCreateTime
from Story
inner join User on User.userNickNameIdx= Story.userNickNameIdx
where User.userNickNameIdx =? and storyStatus=0;