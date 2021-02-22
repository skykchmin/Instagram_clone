const { pool } = require("../../../config/database");

// 스토리 생성
async function insertStoryInfo(insertStoryInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertStoryInfoQuery = `
  insert into Story(userNickNameIdx, highLight, storyMedia, storyCreateTime, storyStatus)
    values (?, ?, ?, now(), 0);
  `;
  const insertStoryInfoRows = await connection.query(
    insertStoryInfoQuery,
    insertStoryInfoParams
  );
  connection.release();
  return insertStoryInfoRows;
}

// 스토리 상태 변경
async function patchStoryInfo(patchStoryInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchStoryInfoQuery = `
  update Story
  set storyStatus = 1
  where userNickNameIdx = ? and storyIdx = ?;
  `;
  const patchStoryInfoRows = await connection.query(
    patchStoryInfoQuery,
    patchStoryInfoParams
  );
  connection.release();
  return patchStoryInfoRows;
}

//스토리 읽은 기록 생성
async function insertStoryHistory(insertStoryHistoryParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertStoryHistoryQuery = `
  insert into StoryHistory (userNickNameIdx,storyIdx) values (?,?);
  `;
  const insertStoryHistoryRows = await connection.query(
    insertStoryHistoryQuery,
    insertStoryHistoryParams
  );
  connection.release();
  return insertStoryHistoryRows;
}

//스토리 읽은 기록 중복 조회
async function insertStoryHistoryCheck(userNickNameIdx,storyIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertStoryHistoryCheckQuery = `
                SELECT userNickNameIdx,storyIdx
                FROM StoryHistory
                WHERE userNickNameIdx = '${userNickNameIdx}' and storyIdx= '${storyIdx}';
                `;
 // const insertfeedCheckParams = [feedIdx,userNickNameIdx ];
  const [insertStoryHistoryCheckRows] = await connection.query(
    insertStoryHistoryCheckQuery,
  //  insertfeedCheckParams
  );
  connection.release();
  return insertStoryHistoryCheckRows;
}
//스토리별 읽은 유저 조회
async function getStoryHistory(storyIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getStoryHistoryQuery = `
  select StoryHistory.userNickNameIdx,userProfilePicture,userNickName,userName
from User
inner join StoryHistory  on User.userNickNameIdx =StoryHistory.userNickNameIdx
where storyIdx = '${storyIdx}';
  `;
  const getStoryHistoryRows = await connection.query(
    getStoryHistoryQuery,
   // getStoryHistoryParams
  );
  connection.release();
  return getStoryHistoryRows;
}
//피드화면위에 뜨는 스토리 목록 조회
async function getStoryFeed(userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getStoryFeedQuery = `
  select userProfilePicture,
       Story.userNickNameIdx
from User
inner join FollowingFollower on FollowingFollower.fromUserIdx = userNickNameIdx
inner join Story on Story.userNickNameIdx = fromUserIdx
where toUserIdx = '${userNickNameIdx}' and followStatus ='F'
group by User.userNickNameIdx;
  `;
  const getStoryFeedRows = await connection.query(
    getStoryFeedQuery,
    //getStoryFeedParams
  );
  connection.release();
  return getStoryFeedRows;
}
//유저별스토리조회
async function getStory(userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getStoryQuery = `
  select userProfilePicture,
       User.userNickNameIdx,
       storyIdx,
       storyMedia,
       storyCreateTime
from Story
inner join User on User.userNickNameIdx= Story.userNickNameIdx
where User.userNickNameIdx ='${userNickNameIdx}';
  `;
  const getStoryRows = await connection.query(
    getStoryQuery,
   // getStoryParams
  );
  connection.release();
  return getStoryRows;
}

// 하이라이트 생성
async function patchHighlightInfo(patchHighlightInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchHighlightInfoQuery = `
  update Story
  set highlight = 1
  where userNickNameIdx = ? and storyIdx = ?
  `;
  const patchHighlightInfoRows = await connection.query(
    patchHighlightInfoQuery,
    patchHighlightInfoParams
  );
  connection.release();
  return patchHighlightInfoRows;
}

// 하이라이트 삭제
async function deleteHighlightInfo(highLightIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteHighlightInfoQuery = `
  delete
  from HighLight
  where highLightIdx = '${highLightIdx}';
  `;
  const deleteHighlightInfoRows = await connection.query(
    deleteHighlightInfoQuery,
    deleteHighlightInfoParams
  );
  connection.release();
  return deleteHighlightInfoRows;
}

// 하이라이트 조회
async function getHighlightInfo(highLightIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getHighlightInfoQuery = `
  select highLightIdx,storyIdx
  from HighLight
  where where highLightIdx = '${highLightIdx}';
  `;
  const getHighlightInfoRows = await connection.query(
    getHighlightInfoQuery,
    getHighlightInfoParams
  );
  connection.release();
  return getHighlightInfoRows;
}



module.exports = {
    insertStoryInfo,
    patchStoryInfo,
    insertStoryHistory,
    getStoryHistory,
    getStoryFeed,
    getStory,
    insertStoryHistoryCheck,
    patchHighlightInfo,
    deleteHighlightInfo,
    getHighlightInfo
};


