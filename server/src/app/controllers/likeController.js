const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const likeDao= require('../dao/likeDao');

//피드좋아요생성
exports.insertlikes = async function (req, res) {
    const {
        userNickNameIdx,likeStatus
    } = req.body;

   const feedIdx = req.params.feedIdx

   const connection = await pool.getConnection();
   
    if (!userNickNameIdx) {
        return res.json({
            isSuccess: false, 
            code: 2514, 
            message: "유저닉네임번호를 확인해주세요."
        });
    }

    if (!feedIdx) {
        return res.json({
            isSuccess: false, 
            code: 2515, 
            message: "피드번호를 확인해주세요."
        });
    }

     try {
        
        const feedlikecheckRows = await likeDao.insertfeedlikeCheck(feedIdx,userNickNameIdx);
        if (feedlikecheckRows.length > 0) {

            return res.json({
                isSuccess: false,
                code: 3508,
                message: "중복된 피드좋아요생성입니다."
            });
        }
        
        const insertlikesParams = [feedIdx,userNickNameIdx]
            
         const insertlikesRows = await likeDao.insertlikes(insertlikesParams);
           console.log(insertlikesRows[0])
           return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드 좋아요 생성",
                insertlikesRows
            });
        
        } catch (err) {
            
           
            logger.error(`App - feed Query error\n: ${JSON.stringify(err)}`);
            
            return false;
        }
        finally{
            connection.release();
        } 
}; 

//피드좋아요 조회
exports.getfeedlikes = async function (req, res) {

    const feedIdx = req.params.feedIdx;


    try {
       // const connection = await pool.getConnection(async (conn) => conn);

        const getfeedlikesrows = await likeDao.getlikefeeds(feedIdx);

        if (getfeedlikesrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: feedIdx + "번 피드 좋아요한 유저 목록 조회",

                data: getfeedlikesrows

            });

        }
        return res.json({
            isSuccess: false,
            code: 3509,
            message: "피드 좋아요 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};

//피드좋아요수정
exports.patchlikes = async function (req, res) {

    const { userNickNameIdx } = req.body;
    const feedIdx = req.params.feedIdx;

    if (!feedIdx) {
        return res.json({ isSuccess: false, code: 2517, message: "피드 번호를 입력해주세요" });
    }

    try {
        if (feedIdx <= 0) {
            return res.json({
                isSuccess: false,
                code: 2516,
                message: "정확한 피드번호를 입력해주세요"
            });
        }

       // const connection = await pool.getConnection(async (conn) => conn);
        const patchlikes = await likeDao.patchlikes(feedIdx,userNickNameIdx);

         if (patchlikes[0].affectedRows == 1) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드 좋아요 수정 성공",


            });
        }
        else {

            return res.json({
                isSuccess: true,
                code: 3510,
                message: "피드 좋아요 수정 실패, 수정할 피드번호와 유저번호 를 확인해주세요",
            });
        }

    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};

//////////////////////////////////////////////////////////////////////////////////
//댓글좋아요 유저목록 조회
exports.getlikecomments = async function (req, res) {

    const commentIdx = req.params.commentIdx;
    if (!commentIdx) {
        return res.json({
            isSuccess: false, 
            code: 2524, 
            message: "댓글번호를 확인해주세요."
        });
    }

    try {
      //  const connection = await pool.getConnection(async (conn) => conn);

        const getcommentlikesrows = await likeDao.getlikecomments(commentIdx);

        if (getcommentlikesrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: commentIdx + "번 댓글 좋아요한 유저 목록 조회",

                data:getcommentlikesrows

            });

        }
        return res.json({
            isSuccess: false,
            code: 3502,
            message: "댓글 좋아요 목록 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};
//댓글 좋아요 생성
exports.insertlikescomments = async function (req, res) {
    const {
        feedIdx,userNickNameIdx
    } = req.body;

   const commentIdx = req.params.commentIdx

   const connection = await pool.getConnection();
   
    if (!userNickNameIdx) {
        return res.json({
            isSuccess: false, 
            code: 2506, 
            message: "유저닉네임번호를 확인해주세요."
        });
    }

    if (!commentIdx) {
        return res.json({
            isSuccess: false, 
            code: 2507, 
            message: "댓글번호를 확인해주세요."
        });
    }

     try {
        
        const likecommentsCheckRows = await likeDao.insertlikecommentsCheck(commentIdx,userNickNameIdx);
        if (likecommentsCheckRows.length > 0) {

            return res.json({
                isSuccess: false,
                code: 2508,
                message: "중복된 댓글좋아요생성입니다."
            });
        }
        
        const insertlikescommentsParams = [commentIdx,feedIdx,userNickNameIdx]
            
         const insertlikescommentsRows = await likeDao.insertlikecomments(insertlikescommentsParams);
           
           return res.json({
                isSuccess: true,
                code: 1000,
                message: "댓글 좋아요 생성성공",
                data : insertlikescommentsRows
            });
        
        } catch (err) {
            
           
            logger.error(`App - feed Query error\n: ${JSON.stringify(err)}`);
            
            return false;
        }
        finally{
            connection.release();
        } 
}; 
//댓글좋아요취소
exports.patchlikescomments = async function (req, res) {

    const { userNickNameIdx } = req.body;
    const commentIdx = req.params.commentIdx;

    if (!commentIdx) {
        return res.json({ isSuccess: false, code: 301, message: "댓글번호를 입력해주세요" });
    }

    try {
        if (commentIdx <= 0) {
            return res.json({
                isSuccess: false,
                code: 2509,
                message: "정확한 댓글번호를 입력해주세요"
            });
        }

        //const connection = await pool.getConnection(async (conn) => conn);
        const patchlikescomments = await likeDao.patchlikescomments(commentIdx,userNickNameIdx);

         if (patchlikescomments[0].affectedRows == 1) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "댓글 좋아요 취소 성공",


            });
        }
        else {

            return res.json({
                isSuccess: true,
                code: 3503,
                message: "댓글 좋아요 수정 실패, 수정할 피드번호와 유저번호 를 확인해주세요",
            });
        }

    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};