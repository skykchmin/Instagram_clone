const { pool } = require("../../../config/database");


// 팔로잉하고 있는 사람들 번호 가져오기
async function selectfromFollowingStatusIdxInfo(selectfromFollowingStatusIdxInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectfromFollowingStatusIdxInfoQuery = `
  select fromUserIdx
  from User
  inner join FollowingFollower on FollowingFollower.toUserIdx = User.userNickNameIdx
  where toUserIdx = ? and followStatus ='F';
  ;
  `;
                
  const selectfromFollowingStatusIdxInfoRows = await connection.query(
    selectfromFollowingStatusIdxInfoQuery,
    selectfromFollowingStatusIdxInfoParams
  );
  connection.release();
  return selectfromFollowingStatusIdxInfoRows;
}

// 팔로잉 당하고 있는 사람 번호 가져오기 
async function selectfromFollowerStatusIdxInfo(selectfromFollowerStatusIdxInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectfromFollowerStatusIdxInfoQuery = `
    select toUserIdx
    from User
    inner join FollowingFollower on FollowingFollower.fromUserIdx = User.userNickNameIdx
    where fromUserIdx = ? and followStatus ='F';
    `;
                  
    const selectfromFollowerStatusIdxInfoRows = await connection.query(
      selectfromFollowerStatusIdxInfoQuery,
      selectfromFollowerStatusIdxInfoParams
    );
    connection.release();
    return selectfromFollowerStatusIdxInfoRows;
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

async function patchSendFollowingInfo(patchSendFollowingInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchSendFollowingInfoQuery = `
  update FollowingFollower
  inner join User
  inner join (
      select userNickNameIdx, toUserIdx, fromUserIdx,
      case
          when userDisclosureScope = 0
          then '공개'
          when userDisclosureScope = 1
          then '비공개'
          end as userDisclosureScope
  from User
  left join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
  where FollowingFollower.fromUserIdx = ?
  group by fromUserIdx
          ) as follow
  set followStatus =
      case
          when followStatus = 'F' then 'N'
          when followStatus = 'N' and follow.userDisclosureScope = '공개' then 'F' 
          when followStatus = 'N' and follow.userDisclosureScope = '비공개' then 'W' 
      end
  where User.userNickNameIdx = ? and follow.fromUserIdx = ? ;
  ;
  `;
  const patchSendFollowingInfoRows = await connection.query(
    patchSendFollowingInfoQuery,
    patchSendFollowingInfoParams
  );
  connection.release();
  return patchSendFollowingInfoRows;
}

// 비공개 유저일때 수락
async function patchAcceptFollowingInfo(patchAcceptFollowingInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchAcceptFollowingInfoQuery = `
  update FollowingFollower
  inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
  set followStatus =
    case
        when followStatus ='W' then 'F'
        when followStatus ='F' then 'F' 
        when followStatus ='N' then 'N' 
    end
  where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?;
  `;
  const patchAcceptFollowingInfoRows = await connection.query(
    patchAcceptFollowingInfoQuery,
    patchAcceptFollowingInfoParams
  );
  connection.release();
  return patchAcceptFollowingInfoRows;
}

// 비공개 유저일때 수락
async function patchDenialFollowingInfo(patchDenialFollowingInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchDenialFollowingInfoQuery = `
  update FollowingFollower
  inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
  set followStatus =
      case
          when followStatus ='W' then 'N'
          when followStatus ='F' then 'F' 
          when followStatus ='N' then 'N' 
      end
  where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?;
  `;
  const patchDenialFollowingInfoRows = await connection.query(
    patchDenialFollowingInfoQuery,
    patchDenialFollowingInfoParams
  );
  connection.release();
  return patchDenialFollowingInfoRows;
}

// 비공개 유저일때 공개범위 찾기
async function selectPrivateSearchInfo(selectPrivateSearchInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectPrivateSearchInfoQuery = `
  select userNickNameIdx, toUserIdx, fromUserIdx,
    case
        when userDisclosureScope = 0
        then '공개'
        when userDisclosureScope = 1
        then '비공개'
        end as userDisclosureScope
  from User
  inner join FollowingFollower on User.userNickNameIdx = FollowingFollower.fromUserIdx
  where FollowingFollower.fromUserIdx = ?
  group by fromUserIdx
;
`
  const selectPrivateSearchInfoRows = await connection.query(
    selectPrivateSearchInfoQuery,
    selectPrivateSearchInfoParams
  );
  connection.release();
  return selectPrivateSearchInfoRows;
}

// 비공개 유저 팔로우 신청
async function sendPrivateFollowingInfo(sendPrivateFollowingInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const sendPrivateFollowingInfoQuery = `
  update FollowingFollower
  inner join User on User.userNickNameIdx = FollowingFollower.fromUserIdx
  set followStatus =
      case
          when followStatus = 'F' then 'N' 
          when followStatus = 'N' and userDisclosureScope = 0 then 'F' 
          when followStatus = 'N' and userDisclosureScope = 1 then 'W'
          when followStatus = 'W' and userDisclosureScope = 1 then 'W' 
      end
  where FollowingFollower.toUserIdx = ? and FollowingFollower.fromUserIdx = ?
;
`
  const sendPrivateFollowingInfoRows = await connection.query(
    sendPrivateFollowingInfoQuery,
    sendPrivateFollowingInfoParams
  );
  connection.release();
  return sendPrivateFollowingInfoRows;
}

// 팔로우 언팔로우 
async function patchFollowUnfollowInfo(patchFollowUnfollowInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchFollowUnfollowInfoQuery = `
  update FollowingFollower
  set followStatus =
      case
          when followStatus = 'F' then 'N'
          when followStatus = 'N' then 'F'
      end
  where toUserIdx = ? and fromUserIdx = ?;
;
`
  const patchFollowUnfollowInfoRows = await connection.query(
    patchFollowUnfollowInfoQuery,
    patchFollowUnfollowInfoParams
  );
  connection.release();
  return patchFollowUnfollowInfoRows;
}





module.exports = {
  selectfromFollowingStatusIdxInfo,
  selectfromFollowerStatusIdxInfo,
  searchInfo,
  patchSendFollowingInfo,
  patchAcceptFollowingInfo,
  patchDenialFollowingInfo,
  selectPrivateSearchInfo,
  sendPrivateFollowingInfo,
  patchFollowUnfollowInfo
};


