const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const feedDao = require('../dao/feedDao');

//피드조회
exports.getfeeds = async function (req, res) {

    


    try {
       // const connection = await pool.getConnection(async (conn) => conn);

        const getfeedsrows = await feedDao.getfeeds();

        if (getfeedsrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "전체 유저 피드 조회",

                data: getfeedsrows
                


            });

        }
        return res.json({
            isSuccess: false,
            code: 3504,
            message: "피드 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};

//사용자피드조회
exports.getuserfeeds = async function (req, res) {

    const userIdx = req.params.userIdx;


    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const getfeedsrows = await feedDao.getuserfeeds(userIdx);

        if (getfeedsrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: userIdx + "번 유저 피드 조회",

                data: getfeedsrows

            });

        }
        return res.json({
            isSuccess: false,
            code: 3505,
            message: "피드 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};



//피드생성
exports.insertfeed = async function (req, res) {
    const {
        userNickNameIdx, feedCreateDate, feedUpdateDate, caption,mediaIdx, mediaList
    } = req.body;


    const connection = await pool.getConnection();

    if (!userNickNameIdx) {
        return res.json({
            isSuccess: false,
            code: 2510,
            message: "유저닉네임번호를 확인해주세요."
        });
    }

    try {

        await connection.beginTransaction();

        
        const insertfeedParams = [userNickNameIdx, caption, feedCreateDate, feedUpdateDate];

        const insertfeedRows = await feedDao.insertfeed(insertfeedParams);
        

        if (!insertfeedRows) {
            return res.json({
                isSuccess: true,
                code: 2511,
                message: "중복생성",
                insertfeedRows
            });
        }
        insertfeedmediaParams = [mediaIdx,mediaList]
        
        
        rows = [];
        for(let i=0;i<mediaIdx;i++){
            
           // console.log(i)
            console.log(insertfeedmediaParams[1][i].mediaURL);
            
           const mediaURL = insertfeedmediaParams[1][i].mediaURL
                //console.log(i)
                //console.log(mediaURL)
           var insertfeedmediaRows = await feedDao.insertfeedmedia(i,mediaURL);
           
           rows.push(insertfeedmediaRows)
        }
        
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "피드생성성공",

            data : insertfeedmediaParams
        });


        //처리가 잘되면
        await connection.commit();
           // console.log(2)
        //connection.release();

       

    } catch (err) {
        await connection.rollback();
      
        logger.error(`App - feed Query error\n: ${JSON.stringify(err)}`);

        return false;
    }
    finally {
        
        connection.release();
    }
};
//피드삭제
exports.deletefeed = async function (req, res) {

    var feedIdx = req.params.feedIdx;

    try {
        if (feedIdx <= 0) {
            return res.json({
                isSuccess: false,
                code: 2513,
                message: "정확한 피드번호를 입력해주세요"
            });
        }
        
      //  const connection = await pool.getConnection(async (conn) => conn);
        const deletefeedsrows = await feedDao.deletefeeds(feedIdx);
        console.log(deletefeedsrows)

        if (deletefeedsrows.affectedRows == 0) {

            return res.json({
                isSuccess: true,
                code: 3507,
                message: "입력한 피드번호에 맞는 피드가 없습니다.",
            });
        }
        if (deletefeedsrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드삭제성공",
            });
        }
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};

//피드수정
exports.patchfeeds = async function (req, res) {

    const { caption } = req.body;
    const feedIdx = req.params.feedIdx;

    if (!feedIdx) {
        return res.json({ isSuccess: false, code: 301, message: "프로필번호를 입력해주세요" });
    }

    try {
        if (feedIdx <= 0) {
            return res.json({
                isSuccess: false,
                code: 2512,
                message: "정확한 피드번호를 입력해주세요"
            });
        }

       // const connection = await pool.getConnection(async (conn) => conn);
        const patchfeeds = await feedDao.patchfeeds(caption, feedIdx);

        console.log(patchfeeds);

        if (patchfeeds[0].affectedRows == 1) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드 수정 성공",
                

            });
        }
        else {

            return res.json({
                isSuccess: true,
                code: 3506,
                message: "피드 수정 실패, 수정할 피드번호를 확인해주세요",
            });
        }

    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};




exports.testfeeds = async function (req, res) {
   /*  /* const {
        mediaURL
    } = req.body; */
    

    const connection = await pool.getConnection();

     try {

        //await connection.beginTransaction();

        /* const feedcheckParams = [feedIdx]
        const feedcheckRows = await feedDao.insertfeedCheck(feedcheckParams);
        if (feedcheckRows.length > 0) {

            return res.json({
                isSuccess: false,
                code: 3101,
                message: "중복된 피드생성입니다."
            });
        } */

        //console.log(1);
      //  const insertfeedParams = [userNickNameIdx, caption, feedCreateDate, feedUpdateDate];

       /*  const insertfeedRows = await feedDao.insertfeed(insertfeedParams);


        if (!insertfeedRows) {
            return res.json({
                isSuccess: true,
                code: 3507,
                message: "중복생성",
                insertfeedRows
            });
        }
     */
        var mediaURL = req.body
        console.log(mediaURL.mediaList[i].mediaURL)
        var testRows = await feedDao.test(mediaURL);

        //rows = [];
        /* for(let i=1;i<mediaIdx+1;i++){
            const insertfeedmediaParams = [i, mediaURL];
            console.log(mediaURL)
            var insertfeedmediaRows = await feedDao.insertfeedmedia(insertfeedmediaParams);
            console.log(insertfeedmediaRows)
            rows.push(insertfeedmediaRows)
        } */
        
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "피드생성성공",
            data : testRows
        });


        //처리가 잘되면
        await connection.commit();
           // console.log(2)
        //connection.release();

       

    } catch (err) {
       // await connection.rollback();
      
        logger.error(`App - feed Query error\n: ${JSON.stringify(err)}`);

        return false;
    }
    finally {
        
        connection.release();
    }
};

//미디어URL 조회
exports.getmediaurl = async function (req, res) {

    const feedIdx = req.params.feedIdx;


    try {
       // const connection = await pool.getConnection(async (conn) => conn);

        const getmediaurlrows = await feedDao.getmedia(feedIdx);

        if (getmediaurlrows) {

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "피드별 미디어 조회 성공",

                data: getmediaurlrows
                


            });

        }
        return res.json({
            isSuccess: false,
            code: 3505,
            message: "피드별 미디어 조회 실패"
        });
    } catch (err) {

        logger.error(`App - SignUp Query error: ${err.message}`);
        return res.status(4000).send(`Error: ${err.message}`);
    }
};