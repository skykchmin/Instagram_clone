const { pool } = require("../../../config/database");


//피드조회
async function getfeeds() {
  const connection = await pool.getConnection(async (conn) => conn);
  const getfeedsQuery = `
  select Feed.feedIdx         as 'feedIdx',
       userProfilePicture   as 'userProfilePicture',
       User.userNickName    as 'userNickName',
       User.userNickNameIdx as 'userNickNameIdx',
       caption              as 'caption',
       likeCount            as 'likeCount',
       commentLikeCount     as 'commentCount',
       group_concat(mediaURL) as 'mediaURL',
       com.commentIdx       as 'firstCommentIdx',
       com.commentText      as 'firstCommentText',
       com.userNickNameIdx  as 'firstUserNickNameIdx',
       com.userNickName     as 'firstUserNickName',
       feedCreateDate
from Feed
         inner join Media on Feed.feedIdx = Media.feedIdx
         inner join User on Feed.userNickNameIdx = User.userNickNameIdx
         left join (select feedIdx, count(feedIdx) likeCount,likeStatus from Liked where likeStatus='L' group by feedIdx) 좋아요
                    on Feed.feedIdx = 좋아요.feedIdx
         left join (select Comment.feedIdx, count(commentIdx) commentLikeCount from Comment group by feedIdx) 댓글수
                    on Feed.feedIdx = 댓글수.feedIdx
         left join (select commentIdx, commentText, User.userNickNameIdx, userNickName, feedIdx
                     from User
                              inner join Comment C on User.userNickNameIdx = C.userNickNameIdx
                     group by feedIdx) com
                    on com.feedIdx = Feed.feedIdx
group by Media.feedIdx;

                `;


  const [getfeedsrows] = await connection.query(
    getfeedsQuery,


  );
  connection.release();

  return getfeedsrows;
}
 
//사용자피드조회
async function getuserfeeds(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getuserfeedsQuery = `
  select Feed.feedIdx         as 'feedIdx',
       userProfilePicture   as 'userProfilePicture',
       User.userNickName    as 'userNickName',
       User.userNickNameIdx as 'userNickNameIdx',
       caption              as 'caption',
       likeCount            as 'likeCount',
       commentLikeCount     as 'commentCount',
       mediaIdx             as 'mediaIdx',
       mediaURL             as 'mediaURL',
       com.commentIdx       as 'firstCommentIdx',
       com.commentText      as 'firstCommentText',
       com.userNickNameIdx  as 'firstUserNickNameIdx',
       com.userNickName     as 'firstUserNickName',
       feedCreateDate

from Feed
         inner join Media on Feed.feedIdx = Media.feedIdx
         inner join User on Feed.userNickNameIdx = User.userNickNameIdx
         left join (select feedIdx, count(feedIdx) likeCount,likeStatus from Liked where likeStatus='L' group by feedIdx) 좋아요
                    on Feed.feedIdx = 좋아요.feedIdx
         left join (select Comment.feedIdx, count(commentIdx) commentLikeCount from Comment group by feedIdx) 댓글수
                    on Feed.feedIdx = 댓글수.feedIdx
         left join (select commentIdx, commentText, User.userNickNameIdx, userNickName, feedIdx
                     from User
                              inner join Comment C on User.userNickNameIdx = C.userNickNameIdx
                     group by feedIdx) com
                    on com.feedIdx = Feed.feedIdx
where Feed.userNickNameIdx = '${userIdx}';

                `;


  const [getuserfeedsrows] = await connection.query(
    getuserfeedsQuery,


  );
  connection.release();

  return getuserfeedsrows;
}

//피드 중복체크
/* async function insertfeedCheck(feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertfeedCheckQuery = `
                SELECT feedIdx 
                FROM Feed
                WHERE feedIdx = '${feedIdx}';
                `;
 // const insertfeedCheckParams = [feedIdx,userNickNameIdx ];
  const [insertfeedCheckRows] = await connection.query(
    insertfeedCheckQuery,
  //  insertfeedCheckParams
  );
  connection.release();
  return insertfeedCheckRows;
} */

//피드 미디어 중복체크 // 중복이 생길일이없음
/* async function insertfeedmediaCheck(feedIdx,mediaIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertfeedmediaCheckQuery = `
                SELECT feedIdx,mediaIdx
                FROM Media
                WHERE feedIdx = '${feedIdx}' and mediaIdx = '${mediaIdx}';
                `;
 // const insertfeedCheckParams = [feedIdx,userNickNameIdx ];
  const [insertfeedmediaCheckRows] = await connection.query(
    insertfeedmediaCheckQuery,
  //  insertfeedCheckParams
  );
  connection.release();
  return insertfeedmediaCheckRows;
} */




//피드생성
async function insertfeed(insertfeedParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertfeedQuery = `
    insert into Feed (userNickNameIdx,caption,feedCreateDate,feedUpdateDate) values (?,?,now(),now());
      `;
    
    const insertfeedRow = await connection.query(
      insertfeedQuery,
      insertfeedParams
    );
   connection.release();
  
    return insertfeedRow;
}

async function insertfeedmedia(mediaIdx,mediaURL) {
  //console.log(insertfeedmediaParams);
    const connection = await pool.getConnection(async (conn) => conn);
    const insertfeedmediaQuery = `
    insert into Media (feedIdx, mediaIdx,mediaURL) values (LAST_INSERT_ID(),'${mediaIdx}','${mediaURL}');
      `;
    const insertfeedmediaRow = await connection.query(
        insertfeedmediaQuery,
      insertfeedmediaParams
    );
   connection.release();
  
    return insertfeedmediaRow;
}

//피드삭제
async function deletefeeds(feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deletefeedQuery = `
  delete from Feed where feedIdx = ?;
                `;

  
  const deletefeedsParams = [feedIdx];
  const [deletefeedrows] = await connection.query(
    deletefeedQuery,
    deletefeedsParams

  );
  connection.release();

  return deletefeedrows;
}

//피드수정
async function patchfeeds(caption,feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const patchfeedsQuery = `
        
  update Feed set caption = '${caption}' where feedIdx = '${feedIdx}'

    `;
  const patchfeedsParams = [feedIdx];
  const patchfeedsRow = await connection.query(
    patchfeedsQuery, 
    patchfeedsParams 
  );
  connection.release();
  return patchfeedsRow;
}
/* async function test(mediaURL) {
  //console.log(mediaURL)
  const connection = await pool.getConnection(async (conn) => conn);
  const testQuery = `
  insert into test(mediaURL) values ('${mediaURL}');
    `;
  const testRow = await connection.query(
      testQuery,
    //testParams
  );
 connection.release();
 //console.log(testRow)
 //console.log(testRow);
  return testRow;
  
  
} */

//미디어URL조회
async function getmedia(feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const  getmediaQuery = `
  select mediaURL from Media where feedIdx ='${feedIdx}';

                `;


  const [ getmediarows] = await connection.query(
    getmediaQuery,


  );
  connection.release();

  return getmediarows;
}



module.exports = {
   getfeeds,
    getuserfeeds,
    insertfeed,
    insertfeedmedia,
  //  insertfeedCheck,
  // insertfeedmediaCheck,
    deletefeeds,
    patchfeeds,
    //test,
    getmedia
  };