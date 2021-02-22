const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const storyDao = require('../dao/storyDao');
const { constants } = require('buffer');



//스토리생성
exports.insertStory = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const {
        userNickNameIdx, highLight, storyMedia, storyCreateTime
    } = req.body

    
        try {
            
            // 프로필 조회
            const insertStoryInfoParams = [userNickNameIdx, highLight, storyMedia, storyCreateTime];
            const insertStoryInfoRows = await storyDao.insertStoryInfo(insertStoryInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "스토리 생성 성공",
                data: insertStoryInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 스토리 생성 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};


// 스토리 삭제
exports.patchStory = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const {
        storyIdx
    } = req.body;

    const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

    
        try {
            
            // 프로필 조회
            const patchStoryInfoParams = [userNickNameIdx, storyIdx];
            const patchStoryInfoRows = await storyDao.patchStoryInfo(patchStoryInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "스토리 삭제 성공",
                data: patchStoryInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 스토리 삭제 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

//스토리 읽은 기록 생성
exports.insertStoryHistory = async function (req, res) {
    
    const {
        userNickNameIdx,storyIdx
    } = req.body
    if(!userNickNameIdx){
        return res.json({
            isSuccess: true,
            code: 2521,
            message: "유저 닉네임을 입력하세요",
            

        });
    }
    if(!storyIdx){
        return res.json({
            isSuccess: true,
            code: 2522,
            message: "스토리번호를 입력하세요",
            

        });
    }
    
        try {

            const insertStoryHistoryCheckRows = await storyDao.insertStoryHistoryCheck(storyIdx,userNickNameIdx);
        if (insertStoryHistoryCheckRows.length > 0) {

            return res.json({
                isSuccess: false,
                code: 3511,
                message: "중복된 스토리 읽은 기록 생성입니다."
            });
        }
            
            
            const insertStoryHistoryParams = [userNickNameIdx,storyIdx];
            const insertStoryHistoryRows = await storyDao.insertStoryHistory(insertStoryHistoryParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "스토리 읽은 기록 생성 성공",
                data: insertStoryHistoryRows 

            });
        } catch (err) {
           
            logger.error(`App - 스토리 읽은 기록 생성 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};
//스토리별 읽은 유저 조회
exports.getStoryHistory = async function (req, res) {
    
    const storyIdx = req.params.storyIdx
    if(!storyIdx){
        return res.json({
            isSuccess: true,
            code: 2520,
            message: "스토리번호를 입력하세요",
            

        });
    }
    
    
        try {
            
            
            
            const getStoryHistoryRows = await storyDao.getStoryHistory(storyIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "스토리별 읽은 유저 조회 성공",
                data: getStoryHistoryRows[0]

            });
        } catch (err) {
           
            logger.error(`App - 스토리 읽은 기록 생성 error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};
//피드화면위에 뜨는 스토리 목록 조회
exports.getStoryFeed= async function (req, res) {
    
    const userNickNameIdx = req.params.userNickNameIdx
    
    if(!userNickNameIdx){
        return res.json({
            isSuccess: true,
            code: 2518,
            message: "유저 닉네임을 입력하세요",
            

        });
    }
    
        try {
        const getStoryFeedRows = await storyDao.getStoryFeed(userNickNameIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드화면위에 뜨는 스토리 목록 조회 성공",
                data: getStoryFeedRows[0]

            });
        } catch (err) {
           
            logger.error(`App - 피드화면위에 뜨는 스토리 목록 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};
//유저스토리조회
exports.getStory= async function (req, res) {
    
    const  userNickNameIdx = req.params.userNickNameIdx
    if(!userNickNameIdx){
        return res.json({
            isSuccess: true,
            code: 2519,
            message: "유저 닉네임을 입력하세요",
            

        });
    }
        try {
            
            
            
            const getStoryRows = await storyDao.getStory(userNickNameIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: userNickNameIdx+"번 유저 스토리 조회 성공",
                data: getStoryRows[0]

            });
        } catch (err) {
           
            logger.error(`App - 유저 스토리 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};




// 하이라이트생성
exports.patchHighlight = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const {
        userNickNameIdx, storyIdx, storyMedia
    } = req.body

    
        try {
            
            const patchHighlightInfoParams = [userNickNameIdx, storyIdx, storyMedia];
            const patchHighlightInfoRows = await storyDao.patchHighlightInfo(patchHighlightInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "하이라이트 생성 성공",
                data: patchHighlightInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 하이라이트 생성 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 하이라이트 삭제
exports.deleteHighlight = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const highLightIdx = req.params. highLightIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것


    
        try {
            
            
            const deleteHighlightInfoRows = await storyDao.deleteHighlightInfo(highLightIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "하이라이트 삭제 성공",
                data: deleteHighlightInfoRows

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 하이라이트 삭제 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 하이라이트 조회
exports.getHighlight = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const highLightIdx = req.params. highLightIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
 
        try {
            
            
            const getHighlightInfoRows = await storyDao.getHighlightInfo(highLightIdx);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "하이라이트 조회 성공",
                data: getHighlightInfoRows[0]

            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 하이라이트 조회 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};