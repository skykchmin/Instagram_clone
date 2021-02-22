const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const followDao = require('../dao/followDao');
const { constants } = require('buffer');

// 팔로잉하고 있는 사람들 번호 가져오기
exports.selectfromFollowingStatusIdx = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectfromFollowingStatusIdxInfoParams = toUserIdx;
            const selectfromFollowingStatusIdxInfoRows = await followDao.selectfromFollowingStatusIdxInfo(selectfromFollowingStatusIdxInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로잉 되어있는 번호 가져오기",
                data: selectfromFollowingStatusIdxInfoRows[0]
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App -팔로잉 되어있는 번호 가져오기 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};


//팔로잉 목록 가져오기
exports.followingUser = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectfromFollowingStatusIdxParams = toUserIdx;
            const selectfromFollowingStatusIdxRows = await followDao.selectfromFollowingStatusIdxInfo(selectfromFollowingStatusIdxParams);
            
            // console.log(selectfromFollowingStatusIdxRows);

            InfoRows = [];
            for(let i = 0; i < selectfromFollowingStatusIdxRows[0].length; i++){

                var searchInfoParams = parseInt(selectfromFollowingStatusIdxRows[0][i].fromUserIdx); // 숫자
                
                var searchInfoRows = await followDao.searchInfo(searchInfoParams);
                InfoRows.push(searchInfoRows[0]);
                console.log(searchInfoRows[0]);
            }

            if (InfoRows.length == 0) {

                return res.json({
                    isSuccess: false,
                    code: 3181,
                    message: "팔로잉 목록이 없습니다"
                });
            }

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로잉 목록 성공",
                UserList: InfoRows             
            }); 

           
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 팔로잉 목록 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 팔로잉 당하고 있는 사람 번호 가져오기 
exports.selectfromFollowerStatusIdx = async function (req, res) {
    
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectfromFollowerStatusIdxInfoParams = fromUserIdx;
            const selectfromFollowerStatusIdxInfoRows = await followDao.selectfromFollowerStatusIdxInfo(selectfromFollowerStatusIdxInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로잉 되어있는 번호 가져오기",
                data: selectfromFollowerStatusIdxInfoRows[0]
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App -팔로잉 당하고 있는 사람 번호 가져오기 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};


//팔로워 목록 가져오기
exports.followerUser = async function (req, res) {
    
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectfromFollowerStatusIdxParams = fromUserIdx;
            const selectfromFollowerStatusIdxRows = await followDao.selectfromFollowerStatusIdxInfo(selectfromFollowerStatusIdxParams);
            
            // console.log(selectfromFollowerStatusIdxRows);

            InfoRows = [];
            for(let i = 0; i < selectfromFollowerStatusIdxRows[0].length; i++){

                var searchInfoParams = parseInt(selectfromFollowerStatusIdxRows[0][i].toUserIdx); // 숫자
                
                var searchInfoRows = await followDao.searchInfo(searchInfoParams);
                InfoRows.push(searchInfoRows[0]);
                console.log(searchInfoRows[0]);
            }
            if (InfoRows.length == 0) {

                return res.json({
                    isSuccess: false,
                    code: 3201,
                    message: "팔로워 목록이 없습니다"
                });
            }

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로워 목록 성공",
                UserList: InfoRows             
            }); 

           
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 팔로워 목록 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// // 비공개 유저일 때 전송
// exports.patchSendFollowing = async function (req, res) {
//     // const { id } = req.verifiedToken;
    
//     const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
//     const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
//         try {
    
//             const patchSendFollowingInfoParams = [ fromUserIdx, userNickNameIdx, fromUserIdx];
//             const patchSendFollowingInfoRows = await followDao.patchSendFollowingInfo(patchSendFollowingInfoParams);

        
//             return res.json({
//                 isSuccess: true,
//                 code: 1000,
//                 message: "비공개 유저 팔로잉 신청 성공"
//             });
//         } catch (err) {
//            // await connection.rollback(); // ROLLBACK
//            // connection.release();
//             logger.error(`App - 비공개 유저 팔로잉 신청 성공 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         }
// };

// 비공개 유저일 때 팔로잉 수락
exports.patchAcceptFollowing = async function (req, res) {
    // const { id } = req.verifiedToken;
    
    const toUserIdx = req.params.touserIdx;
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
        try {
    
            const patchAcceptFollowingInfoParams = [toUserIdx, fromUserIdx];
            const patchAcceptFollowingInfoRows = await followDao.patchAcceptFollowingInfo(patchAcceptFollowingInfoParams);

        
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "비공개 유저 팔로잉 수락"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 비공개 유저 팔로잉 수락 실패 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 비공개 유저일 때 팔로잉 거부
exports.patchDenialFollowing = async function (req, res) {
    // const { id } = req.verifiedToken;
    
    const toUserIdx = req.params.touserIdx;
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
        try {
    
            const patchDenialFollowingInfoParams = [toUserIdx, fromUserIdx];
            const patchDenialFollowingInfoRows = await followDao.patchDenialFollowingInfo(patchDenialFollowingInfoParams);

        
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "비공개 유저 팔로잉 거부 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 비공개 유저 팔로잉 거부 실패 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 비공개 유저 공개범위 찾기
exports.selectPrivateSearch = async function (req, res) {
    
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectPrivateSearchInfoParams = fromUserIdx;
            const selectPrivateSearchInfoRows = await followDao.selectPrivateSearchInfo(selectPrivateSearchInfoParams);

            console.log(selectPrivateSearchInfoRows[0][0].userDisclosureScope); // 비공개
            console.log(typeof selectPrivateSearchInfoRows[0][0].userDisclosureScope); // string

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로잉 할 번호 공개범위 찾기",
                data: selectPrivateSearchInfoRows[0]
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App -팔로잉 당하고 있는 사람 번호 가져오기 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 비공개 유저 팔로잉 신청 보내기
exports.sendPrivateFollowing = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx;
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const sendPrivateFollowingInfoParams = [toUserIdx, fromUserIdx];
            const sendPrivateFollowingInfoRows = await followDao.sendPrivateFollowingInfo(sendPrivateFollowingInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "비공개 유저 팔로잉 신청 성공",
                
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 비공개 유저 팔로잉 신청 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 팔로우 언팔로우 성공
exports.patchFollowUnfollow = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx;
    const fromUserIdx = req.params.fromuserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const patchFollowUnfollowInfoParams = [toUserIdx, fromUserIdx];
            const patchFollowUnfollowInfoRows = await followDao.patchFollowUnfollowInfo(patchFollowUnfollowInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로우 / 언팔로우 성공",
                
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 팔로우 / 언팔로우 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};




/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};