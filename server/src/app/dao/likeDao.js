const { pool } = require("../../../config/database");


//피드좋아요 생성 중복 확인
async function insertfeedlikeCheck(feedIdx,userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertfeedlikeCheckQuery = `
                SELECT feedIdx,userNickNameIdx
                FROM Liked
                WHERE feedIdx = '${feedIdx}' and userNickNameIdx = '${userNickNameIdx}';
                `;
 // const insertfeedCheckParams = [feedIdx,userNickNameIdx ];
  const [insertfeedlikeCheckRows] = await connection.query(
    insertfeedlikeCheckQuery,
  //  insertfeedCheckParams
  );
  connection.release();
  return insertfeedlikeCheckRows;
}

//피드좋아요생성
async function insertlikes(insertlikesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertlikesQuery = `
  insert  into Liked (feedIdx,userNickNameIdx,likeStatus) values (?,?,'L');
    `;
  
  const insertlikesRow = await connection.query(
    insertlikesQuery,
    insertlikesParams
  );
 connection.release();
  return insertlikesRow;
}

//피드별 좋아요한 사용자 조회
async function getlikefeeds(feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getlikefeedsQuery = `
  select User.userNickNameIdx,userName,userNickName,userProfilePicture
from User inner join Liked on Liked.userNickNameIdx = User.userNickNameIdx
inner join Feed on Liked.feedIdx = Feed.feedIdx
where Feed.feedIdx = '${feedIdx}';

                `;


  const [getlikefeedsrows] = await connection.query(
    getlikefeedsQuery,


  );
  connection.release();

  return getlikefeedsrows;
}

//피드좋아요수정
async function patchlikes(feedIdx,userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchlikesQuery = `
        
  update Liked
set likeStatus = if(likeStatus = 'L', 'U', 'L')
where feedIdx = '${feedIdx}' and userNickNameIdx = '${userNickNameIdx}';

    `;
  //const patchlikesParams = [feedIdx];
  const patchlikesRow = await connection.query(
    patchlikesQuery, 
   //patchlikesParams 
  );
  connection.release();
  return patchlikesRow;
}

/////////////////////////////////////////////////////////////////////////////

//댓글별 좋아요 조회
async function getlikecomments(commentIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getlikecommentsQuery = `
  select User.userNickNameIdx, userName, userNickName, userProfilePicture
from User
         inner join CommentLike on CommentLike.userNickNameIdx = User.userNickNameIdx
         
where CommentLike.commentIdx = '${commentIdx}';

                `;


  const [getlikecommentsrows] = await connection.query(
    getlikecommentsQuery,


  );
  connection.release();

  return getlikecommentsrows;
}
//댓글 좋아요 생성 중복 확인
async function insertlikecommentsCheck(commentIdx,userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertlikecommentsCheckQuery = `
                SELECT commentIdx,userNickNameIdx
                FROM CommentLike
                WHERE commentIdx = '${commentIdx}' and userNickNameIdx = '${userNickNameIdx}';
                `;
 // const insertfeedCheckParams = [feedIdx,userNickNameIdx ];
  const [insertlikecommentsCheckRows] = await connection.query(
    insertlikecommentsCheckQuery,
  //  insertfeedCheckParams
  );
  connection.release();
  return insertlikecommentsCheckRows;
}
//댓글 좋아요 생성 
async function insertlikecomments(insertlikescommentsParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertlikecommentsQuery = `
  insert into CommentLike (commentIdx,feedIdx,userNickNameIdx,commentlikeStatus) values (?,?,?,'L');
    `;
  
  const insertlikecommentsRow = await connection.query(
    insertlikecommentsQuery,
    insertlikescommentsParams
  );
 connection.release();
  return insertlikecommentsRow;
}
//댓글좋아요취소
async function patchlikescomments(commentIdx,userNickNameIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchlikescommentsQuery = `
        
  update CommentLike
set commentlikeStatus = if(commentlikeStatus = 'L', 'U', 'L')
where commentIdx = '${commentIdx}' and userNickNameIdx = '${userNickNameIdx}';

    `;
  //const patchlikesParams = [feedIdx];
  const patchlikescommentsRow = await connection.query(
    patchlikescommentsQuery, 
   //patchlikesParams 
  );
  connection.release();
  return patchlikescommentsRow;
}


module.exports = {
   insertlikes,
   insertfeedlikeCheck,
   getlikefeeds,
   patchlikes,
   getlikecomments,
   insertlikecommentsCheck,
   insertlikecomments,
   patchlikescomments
    
  };