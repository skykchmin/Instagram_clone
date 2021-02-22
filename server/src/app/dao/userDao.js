const { pool } = require("../../../config/database");

// 이메일 중복체크
async function userEmailCheck(userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
                SELECT userEmail
                FROM User 
                WHERE Useremail = ?;
                `;
  const selectEmailParams = [userEmail];
  const [emailRows] = await connection.query(
    selectEmailQuery,
    selectEmailParams
  );
  connection.release();

  return emailRows;
}

// 닉네임 중복체크
async function userNicknameCheck(userNickName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT userNickName 
                FROM User
                WHERE userNickName = ?;
                `;
  const selectNicknameParams = [userNickName];
  const [nicknameRows] = await connection.query(
    selectNicknameQuery,
    selectNicknameParams
  );
  connection.release();
  return nicknameRows;
}

async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoQuery = `
  insert into User(userEmail, userName, userPassword, userBirth, userNickName, userDisclosureScope, userProfilePicture, profileCreateDate)
  values (?, ?, ?, ?, ?, ?, ?, now());
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  connection.release();
  return insertUserInfoRow;
}

//SignIn
async function selectUserInfo(userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
  select userEmail, userPassword, userNickName, userStatus, userNickNameIdx, userProfilePicture
  from User
  where userEmail = ?;
                `;

  let selectUserInfoParams = [userEmail];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  return [userInfoRows];
}

//프로필 편집
async function patchUserProfileInfo(patchUserProfileInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchUserProfileInfoQuery = `
  update User
  set userName = ?, userNickName = ?, userSite = ?, userIntroduce = ?
  where userNickNameIdx = ?;
  `;
                
  const patchUserProfileInfoRows = await connection.query(
    patchUserProfileInfoQuery,
    patchUserProfileInfoParams
  );
  connection.release();
  return patchUserProfileInfoRows;
}

// 개인정보 변경
async function patchUserDetailInfo(patchUserDetailInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchUserDetailInfoQuery = `
  update User
  set userEmail = ?, userPhoneNumber = ?, userGender = ?, userBirth = ?
  where userNickNameIdx = ?;
  `;
                
  const patchUserDetailInfoRows = await connection.query(
    patchUserDetailInfoQuery,
    patchUserDetailInfoParams
  );
  connection.release();
  return patchUserDetailInfoRows;
}

async function patchProfilePictureInfo(patchProfilePictureParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchProfilePictureQuery = `
  update User
  set userProfilePicture = ?
  where userNickNameIdx = ?;
  `;
                
  const patchProfilePictureRows = await connection.query(
    patchProfilePictureQuery,
    patchProfilePictureParams
  );
  connection.release();
  return patchProfilePictureRows;
}

// 팔로우 할 번호 찾기 
async function selectfromFollowerIdxInfo(selectfromFollowerIdxInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectfromFollowerIdxInfoQuery = `
  select fromUserIdx
  from User
  inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
  where toUserIdx = ?;
  `;
                
  const selectfromFollowerIdxInfoRows = await connection.query(
    selectfromFollowerIdxInfoQuery,
    selectfromFollowerIdxInfoParams
  );
  connection.release();
  return selectfromFollowerIdxInfoRows;
}

// search
async function searchInfo(searchInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const searchInfoQuery = `
  select userNickNameIdx, userNickName, userIntroduce, userProfilePicture
  from User
  where userNickNameIdx = ?
  ;
  `;
  const [searchInfoRows] = await connection.query(
    searchInfoQuery,
    searchInfoParams
  );
  connection.release();
  return searchInfoRows;
}

// 프로필 조회 
async function selectUserProfileInfo(selectUserProfileInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserProfileInfoQuery = `
  select userNickNameIdx,userNickName, userProfilePicture, userSite, userIntroduce
  from User
  where userNickNameIdx = ?;
  ;
  `;
  const [selectUserProfileInfoRows] = await connection.query(
    selectUserProfileInfoQuery,
    selectUserProfileInfoParams
  );
  connection.release();
  return selectUserProfileInfoRows;
}

// 피드 숫자
async function selectUserFeedCountInfo(selectUserFeedCountInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserFeedCountInfoQuery = `
  select count(Feed.feedIdx) as FeedCount
  from Feed
  inner join User on Feed.userNickNameIdx = User.userNickNameIdx
  where User.userNickNameIdx = ?
  `;
  const [selectUserFeedCountInfoRows] = await connection.query(
    selectUserFeedCountInfoQuery,
    selectUserFeedCountInfoParams
  );
  connection.release();
  return selectUserFeedCountInfoRows;
}


// 팔로잉 숫자
async function selectUserFollowingCountInfo(selectUserFollowingCountInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserFollowingCountInfoQuery = `
  select count(fromUserIdx) as 'followingCount'
  from User
  inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
  where User.userNickNameIdx = ? and followStatus ='F';
  ;
  `;
  const [selectUserFollowingCountInfoRows] = await connection.query(
    selectUserFollowingCountInfoQuery,
    selectUserFollowingCountInfoParams
  );
  connection.release();
  return selectUserFollowingCountInfoRows;
}

// 팔로워 숫자
async function selectUserFollowerCountInfo(selectUserFollowerCountInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserFollowerCountInfoQuery = `
  select count(toUserIdx) as 'followerCount'
  from User
  inner join FollowingFollower on FollowingFollower.fromUserIdx = User.userNickNameIdx
  where User.userNickNameIdx = ? and followStatus ='F';
  ;
  `;
  const [selectUserFollowerCountInfoRows] = await connection.query(
    selectUserFollowerCountInfoQuery,
    selectUserFollowerCountInfoParams
  );
  connection.release();
  return selectUserFollowerCountInfoRows;
}

// 피드 조회
async function selectUserFeedInfo(selectUserFeedInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserFeedInfoQuery = `
  select Feed.feedIdx, mediaIdx, mediaURL
  from Feed
  inner join Media on Feed.feedIdx = Media.feedIdx
  inner join User on Feed.userNickNameIdx = User.userNickNameIdx
  where User.userNickNameIdx = ?
  group by Feed.feedIdx;
  `;
  const selectUserFeedInfoRows = await connection.query(
    selectUserFeedInfoQuery,
    selectUserFeedInfoParams
  );
  connection.release();
  return selectUserFeedInfoRows;
}



module.exports = {
  userEmailCheck,
  userNicknameCheck,
  insertUserInfo,
  selectUserInfo,
  patchUserProfileInfo,
  patchUserDetailInfo,
  patchProfilePictureInfo,
  selectfromFollowerIdxInfo,
  searchInfo,
  selectUserProfileInfo,
  selectUserFeedCountInfo,
  selectUserFollowingCountInfo,
  selectUserFollowerCountInfo,
  selectUserFeedInfo
};


