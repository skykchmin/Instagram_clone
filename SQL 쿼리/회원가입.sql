use Instagram;

-- 회원가입 초기화면 insert
  insert into User(userEmail, userName, userPassword, userBirth, userNickName, userDisclosureScope, userProfilePicture, profileCreateDate)
  values (?, ?, ?, ?, ?, ?, ?, now());






