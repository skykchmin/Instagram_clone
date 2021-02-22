select StoryHistory.userNickNameIdx,userProfilePicture,userNickName,userName
from User
inner join StoryHistory  on User.userNickNameIdx =StoryHistory.userNickNameIdx
where storyIdx = ?;

insert into StoryHistory (userNickNameIdx,storyIdx )

values (?,?);