const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const commentDao= require('../dao/commentDao');

//댓글생성
exports.insertcomments = async function (req, res) {
    const {
        userNickNameIdx,commentText
    } = req.body;

   const feedIdx = req.params.feedIdx

   const connection = await pool.getConnection();
   
    if (!userNickNameIdx) {
        return res.json({
            isSuccess: false, 
            code: 2501, 
            message: "유저닉네임번호를 확인해주세요."
        });
    }

    if (!feedIdx) {
        return res.json({
            isSuccess: false, 
            code: 2502, 
            message: "피드번호를 확인해주세요."
        });
    }

     try {
        await connection.beginTransaction();
        
        //const insertcommentsParams = [feedIdx,userNickNameIdx,commentText]
           // console.log(insertcommentsParams);
         const insertcommentsRows = await commentDao.insertcomments(feedIdx,userNickNameIdx,commentText);
           //console.log(insertcommentsRows)
           
            const insertcommentstwoRows = await commentDao.insertcommentstwo();
            
           
            await connection.commit();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: insertcommentsRows[0].insertId + "번 댓글 생성 성공",
                
            });
           
            
        }catch (err) {
            await connection.rollback();    
            logger.error(`App - SignUp Query error: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
        finally{
            connection.release();
        } 
}; 
//대댓글 생성
exports.insertreplies = async function (req, res) {
    const {
        userNickNameIdx,commentText,parentCommentIdx
    } = req.body;

   const feedIdx = req.params.feedIdx

   const connection = await pool.getConnection();
   
    if (!userNickNameIdx) {
        return res.json({
            isSuccess: false, 
            code: 2503, 
            message: "유저닉네임번호를 확인해주세요."
        });
    }

    if (!feedIdx) {
        return res.json({
            isSuccess: false, 
            code: 2504, 
            message: "피드번호를 확인해주세요."
        });
    }

     try {
       
        //const insertcommentsParams = [feedIdx,userNickNameIdx,commentText]
           // console.log(insertcommentsParams);
         const insertrepliesRows = await commentDao.insertreplies(feedIdx,userNickNameIdx,commentText,parentCommentIdx);
           //console.log(insertcommentsRows)
           
             return res.json({
                isSuccess: true,
                code: 1000,
                message: insertrepliesRows[0].insertId + "번 대댓글 생성 성공",
                
            });
           
            
        }catch (err) {
            
            logger.error(`App - SignUp Query error: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
        finally{
            connection.release();
        } 
}; 


//댓글 조회
exports.getcomments = async function (req, res) {

    const feedIdx = req.params.feedIdx;

    if (!feedIdx) {
        return res.json({
            isSuccess: false, 
            code: 2523, 
            message: "피드번호를 확인해주세요."
        });
    }
    try {
        //const connection = await pool.getConnection(async (conn) => conn);

        const getcommentsrows = await commentDao.getcomments(feedIdx);

        if (getcommentsrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: feedIdx + "번 피드 댓글 목록 조회",

                data: getcommentsrows

            });

        }
        return res.json({
            isSuccess: false,
            code: 3501,
            message: "댓글 목록 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};


//댓글삭제
exports.deletecomments = async function (req, res) {

    
    var commentIdx = req.params.commentIdx;
    try {
        
       
       // const connection = await pool.getConnection(async (conn) => conn);
        const deletecommentsrows = await commentDao.deletecomments(commentIdx);
           
        if (deletecommentsrows.affectedRows == 0) {

            return res.json({
                isSuccess: true,
                code: 2505,
                message: "입력한 피드번호에 맞는 댓글/대댓글 이 없습니다.",
            });
        }
        if (deletecommentsrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "댓글/대댓글 삭제성공",
            });
        }
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};