const { pool } = require("../../../config/database");


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


async function insertlikes(insertlikesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertlikesQuery = `
  insert  into Liked (feedIdx,userNickNameIdx,likeStatus) values (?,?,?);
    `;
  
  const insertlikesRow = await connection.query(
    insertlikesQuery,
    insertlikesParams
  );
 connection.release();
  return insertlikesRow;
}

//댓글 피드별 조회
async function getcomments(feedIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getcommentsQuery = `
  select Comment.commentIdx,
       Comment.userNickNameIdx,
       userNickName,
       userProfilePicture,
       commentText,
       commentParentChild,
       parentCommentIdx,
       commentlikecount,
       commentCreateDate
from Comment
         inner join User on User.userNickNameIdx = Comment.userNickNameIdx
         inner join Feed on Feed.feedIdx = Comment.feedIdx
        left join(select count(commentIdx)commentlikecount,commentIdx  from CommentLike group by commentIdx)
            commentlike on commentlike.commentIdx = Comment.commentIdx

where Feed.feedIdx = '${feedIdx}'
order by parentCommentIdx;

                `;


  const [getcommentsrows] = await connection.query(
    getcommentsQuery,


  );
  connection.release();

  return getcommentsrows;
}

//댓글생성
async function insertcomments(feedIdx,userNickNameIdx,commentText) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertcommentsQuery = `
  insert into Comment (feedIdx,
    userNickNameIdx,
    commentText,
    commentParentChild,

    commentCreateDate) values ('${feedIdx}','${userNickNameIdx}','${commentText}','P',now());
    `;
  
  const insertcommentsRow = await connection.query(
    insertcommentsQuery,
    //insertcommentsParams
  );
 connection.release();
//console.log(insertcommentsRow)
  return insertcommentsRow;
}
async function insertcommentstwo() {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertcommentstwoQuery = `
  update Comment set parentCommentIdx = last_insert_id()
where commentIdx = last_insert_id();;
    `;
  
  const insertcommentstwoRow = await connection.query(
    insertcommentstwoQuery,
    //insertcommentsParams
  );
 connection.release();
//console.log(insertcommentsRow)
  return insertcommentstwoRow;
}

//대댓글생성
async function insertreplies(feedIdx,userNickNameIdx,commentText,parentCommentIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const  insertrepliesQuery = `
  insert into Comment (feedIdx,
    userNickNameIdx,
    commentText,
    commentParentChild,
    parentCommentIdx,
    commentCreateDate) values ('${feedIdx}','${userNickNameIdx}','${commentText}','C','${parentCommentIdx}',now());
    `;
  
  const  insertrepliesRow = await connection.query(
    insertrepliesQuery,
    //insertcommentsParams
  );
 connection.release();
//console.log(insertcommentsRow)
  return  insertrepliesRow;
}

//댓글삭제

async function deletecomments(commentIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deletecommentsQuery = `
  delete from Comment where commentIdx=?;
                `;

  
  const deletecommentsParams = [commentIdx];
  const [deletecommentsrows] = await connection.query(
    deletecommentsQuery,
    deletecommentsParams

  );
  connection.release();

  return deletecommentsrows;
}
module.exports = {
  
   insertcomments,
   insertcommentstwo,
   getcomments,
   insertreplies,
   deletecomments
  
    
  };