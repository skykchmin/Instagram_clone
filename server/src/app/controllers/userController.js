const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');



/**
 update : 2020.10.4
 01.signUp API = 회원가입
 */
exports.signUp = async function (req, res) {
    const {
        userEmail, userName, userPassword, userBirth, userNickName, userDisclosureScope, userProfilePicture, profileCreateDate
    } = req.body;

    if (!userEmail) return res.json({isSuccess: false, code: 2001, message: "이메일을 입력해주세요."});
    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 2002,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 2003, message: "이메일을 형식을 정확하게 입력해주세요."});
    if (!userName) return res.json({isSuccess: false, code: 2004, message: "이름을 입력해주세요."});

    if (!userPassword) return res.json({isSuccess: false, code: 2005, message: "비밀번호를 입력 해주세요."});
    if (userPassword.length < 6 || userPassword.length > 20) return res.json({
        isSuccess: false,
        code: 2006,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!userBirth) return res.json({isSuccess: false, code: 2007, message: "생일을 입력 해주세요."});

    if (!userNickName) return res.json({isSuccess: false, code: 2008, message: "닉네임을 입력 해주세요."});
    if (userNickName.length > 20) return res.json({
        isSuccess: false,
        code: 2009,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });

    if (!userDisclosureScope) return res.json({isSuccess: false, code: 2010, message: "계정 공개 범위를 선택 해주세요."});
    
        try {
            // 이메일 중복 확인
            const emailRows = await userDao.userEmailCheck(userEmail);
            if (emailRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 3012,
                    message: "중복된 이메일입니다."
                });
            }

            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(userNickName);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 3013,
                    message: "중복된 닉네임입니다."
                });
            }

           // TRANSACTION : advanced
           // await connection.beginTransaction(); // START TRANSACTION
            const hashedPassword = await crypto.createHash('sha512').update(userPassword).digest('hex');
            const insertUserInfoParams = [userEmail, userName, hashedPassword, userBirth, userNickName, userDisclosureScope, userProfilePicture, profileCreateDate];
            
            const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

          //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "회원가입 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 회원가입 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        userEmail, userPassword
    } = req.body;


    if (!userEmail) return res.json({isSuccess: false, code: 2021, message: "이메일을 입력해주세요."});

    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 2022,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 2023, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!userPassword) return res.json({isSuccess: false, code: 2024, message: "비밀번호를 입력 해주세요."});

        try {
            const [userInfoRows] = await userDao.selectUserInfo(userEmail)

            if (userInfoRows.length < 1) {
                // connection.release();
                return res.json({
                    isSuccess: false,
                    code: 3025,
                    message: "아이디를 확인해주세요."
                });
            }


            const hashedPassword = await crypto.createHash('sha512').update(userPassword).digest('hex');
            if (userInfoRows[0].userPassword !== hashedPassword) {
                // connection.release();
                return res.json({
                    isSuccess: false,
                    code: 3026,
                    message: "비밀번호를 확인해주세요."
                });
            }


            console.log(userInfoRows[0].userEmail)
            
            if (userInfoRows[0].userStatus === "INACTIVE") {
                // connection.release();
                return res.json({
                    isSuccess: false,
                    code: 3027,
                    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
                });
            } else if (userInfoRows[0].userStatus === "DELETED") {
                // connection.release();
                return res.json({
                    isSuccess: false,
                    code: 3028,
                    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
                });
            }
            
            //토큰 생성
            let token = await jwt.sign({
                    userEmail: userInfoRows[0].userEmail,
                    userName: userInfoRows[0].userName,
                    userNickNameIdx: userInfoRows[0].userNickNameIdx
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'User',
                } // 유효 시간은 365일
            );
            
           
            res.json({
                jwt: token,
                isSuccess: true,
                code: 1000,
                message: "로그인 성공",
                userNickNameIdx: userInfoRows[0].userNickNameIdx,
                userProfilePicture: userInfoRows[0].userProfilePicture
            });

            // connection.release();
        } catch (err) {
            logger.error(`App - 로그인 Query error\n: ${JSON.stringify(err)}`);
            // connection.release();
            return false;
        }
};

// 중복된 이메일 체크 
exports.userEmailCheck = async function (req, res) {
    
    const userEmail = req.params.userEmails; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    // console.log(userEmail);

    if (!userEmail) return res.json({isSuccess: false, code: 2041, message: "이메일을 입력해주세요."});
    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 2042,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 2043, message: "이메일을 형식을 정확하게 입력해주세요."});

        try {
             // 이메일 중복 확인
             const emailRows = await userDao.userEmailCheck(userEmail);
             if (emailRows.length > 0) {
 
                 return res.json({
                     isSuccess: false,
                     code: 3044,
                     message: "중복된 이메일입니다."
                 });
             }

             return res.json({
                isSuccess: true,
                code: 1000,
                message: "이 이메일은 사용할 수 있습니다"
            });
            // connection.release();
        } catch (err) {
            logger.error(`App - 이메일체크 Query error\n: ${JSON.stringify(err)}`);
            // connection.release();
            return false;
        }
};

// 중복된 닉네임 체크 
exports.userNickNameCheck = async function (req, res) {
    
    const userNickName = req.params.userNickNames; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

    if (!userNickName) return res.json({isSuccess: false, code: 3008, message: "닉네임을 입력 해주세요."});
    if (userNickName.length > 20) return res.json({
        isSuccess: false,
        code: 2061,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });

        try {
              // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(userNickName);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 3062,
                    message: "중복된 닉네임입니다."
                });
            }

             return res.json({
                isSuccess: true,
                code: 1000,
                message: "이 닉네임은 사용할 수 있습니다"
            });
            // connection.release();
        } catch (err) {
            logger.error(`App - 닉네임체크 Query error\n: ${JSON.stringify(err)}`);
            // connection.release();
            return false;
        }
};

// 프로필 수정
exports.patchUserProfiles = async function (req, res) {
    // const { id } = req.verifiedToken;
    const {
        userName, userNickName, userSite, userIntroduce
    } = req.body;

    const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것


    if (!userNickName) return res.json({isSuccess: false, code: 2081, message: "닉네임을 입력 해주세요."});
    if (userNickName.length > 20) return res.json({
        isSuccess: false,
        code: 2082,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
    
    // 전화번호는 null이기 때문에 처리하지않는다
        try {
            
            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(userNickName);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 3083,
                    message: "중복된 닉네임입니다."
                });
            }


            const patchUserProfileInfoParams = [userName, userNickName, userSite, userIntroduce, userNickNameIdx];
            const patchUserProfileInfoRows = await userDao.patchUserProfileInfo(patchUserProfileInfoParams);

        
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "프로필 수정 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 프로필 수정 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 개인정보 변경
exports.patchUserDetails = async function (req, res) {
    // const { id } = req.verifiedToken;
    const {
        userEmail, userPhoneNumber, userGender, userBirth
    } = req.body;

    const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것


    if (!userEmail) return res.json({isSuccess: false, code: 2101, message: "이메일을 입력해주세요."});
    if (userEmail.length > 30) return res.json({
        isSuccess: false,
        code: 2102,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(userEmail)) return res.json({isSuccess: false, code: 2103, message: "이메일을 형식을 정확하게 입력해주세요."});
    
        try {
            
            // 이메일 중복 확인
            const emailRows = await userDao.userEmailCheck(userEmail);
            if (emailRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 3101,
                    message: "중복된 이메일입니다."
                });
            }


            const patchUserDetailInfoParams = [userEmail, userPhoneNumber, userGender, userBirth, userNickNameIdx];
            const patchUserDetailInfoRows = await userDao.patchUserDetailInfo(patchUserDetailInfoParams);

        
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "개인정보 변경 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 개인정보 변경 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 프로필 사진 수정
exports.patchProfilesPicture = async function (req, res) {
    // const { id } = req.verifiedToken;
    const {
        userProfilePicture
    } = req.body;

    const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
    
    if (!userProfilePicture) return res.json({isSuccess: false, code: 2121, message: "사진을 입력해주세요."});
    if (!userNickNameIdx) return res.json({isSuccess: false, code: 2122, message: "닉네임을 입력해주세요."});
        try {
    
            const patchProfilePictureInfoParams = [ userProfilePicture, userNickNameIdx];
            const patchProfilePictureInfoRows = await userDao.patchProfilePictureInfo(patchProfilePictureInfoParams);

        
            return res.json({
                isSuccess: true,
                code: 1000,
                message: "프로필 사진 변경 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 프로필 사진 변경 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

// 전체로 했을 때 임시용
// exports.selectfromFollowerIdx = async function (req, res) {
//     // const { id } = req.verifiedToken;
//     const {
//         toUserIdx
//     } = req.body;

//         try {
    
//             const selectfromFollowerIdxInfoParams = toUserIdx;
//             const selectfromFollowerIdxInfoRows = await userDao.selectfromFollowerIdxInfo(selectfromFollowerIdxInfoParams);

//             // console.log(selectfromFollowerIdxInfoRows[0].length);
//             // console.log(selectfromFollowerIdxInfoRows[0][3]);

//             return res.json({
//                 isSuccess: true,
//                 code: 1000,
//                 message: "팔로우 번호 가져오기",
//                 data: selectfromFollowerIdxInfoRows[0]
//             });
            
//         } catch (err) {
//            // await connection.rollback(); // ROLLBACK
//            // connection.release();
//             logger.error(`App - 팔로우 번호 가져오기 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         }
// };


// //검색 
// exports.followSearch = async function (req, res) {
//     // const { id } = req.verifiedToken;
//     const {
//         toUserIdx
//     } = req.body;

//         try {
    
//             const selectfromFollowerIdxInfoParams = toUserIdx;
//             const selectfromFollowerIdxInfoRows = await userDao.selectfromFollowerIdxInfo(selectfromFollowerIdxInfoParams);
            
//             // console.log(selectfromFollowerIdxInfoRows);

//             InfoRows = [];
//             for(let i = 0; i < selectfromFollowerIdxInfoRows[0].length; i++){

//                 var searchInfoParams = parseInt(selectfromFollowerIdxInfoRows[0][i].fromUserIdx); // 숫자
                
//                 var searchInfoRows = await userDao.searchInfo(searchInfoParams);
//                 InfoRows.push(searchInfoRows[0]);
//                 // console.log(searchInfoRows[0][i]);
//                 console.log(searchInfoRows[0]);
//             }

//             return res.json({
//                 isSuccess: true,
//                 code: 1000,
//                 message: "검색",
//                 UserList: InfoRows             
//             }); 

           
//         } catch (err) {
//            // await connection.rollback(); // ROLLBACK
//            // connection.release();
//             logger.error(`App - 검색 Query error\n: ${err.message}`);
//             return res.status(4000).send(`Error: ${err.message}`);
//         }
// };

//////


exports.selectfromFollowerIdx = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것
        try {
    
            const selectfromFollowerIdxInfoParams = toUserIdx;
            const selectfromFollowerIdxInfoRows = await userDao.selectfromFollowerIdxInfo(selectfromFollowerIdxInfoParams);

            // console.log(selectfromFollowerIdxInfoRows[0].length);
            // console.log(selectfromFollowerIdxInfoRows[0][3]);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "팔로우 번호 가져오기",
                data: selectfromFollowerIdxInfoRows[0]
            });
            
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 팔로우 번호 가져오기 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};


//검색 
exports.followSearch = async function (req, res) {
    
    const toUserIdx = req.params.touserIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

    if (!toUserIdx) return res.json({isSuccess: false, code: 2081, message: "닉네임 번호를 입력해주세요."});
        try {
    
            const selectfromFollowerIdxInfoParams = toUserIdx;
            const selectfromFollowerIdxInfoRows = await userDao.selectfromFollowerIdxInfo(selectfromFollowerIdxInfoParams);
            
            // console.log(selectfromFollowerIdxInfoRows);

            InfoRows = [];
            for(let i = 0; i < selectfromFollowerIdxInfoRows[0].length; i++){

                var searchInfoParams = parseInt(selectfromFollowerIdxInfoRows[0][i].fromUserIdx); // 숫자
                
                var searchInfoRows = await userDao.searchInfo(searchInfoParams);
                InfoRows.push(searchInfoRows[0]);
                console.log(searchInfoRows[0]);
            }

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "검색 성공",
                UserList: InfoRows             
            }); 

           
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 검색 Query error\n: ${err.message}`);
            return res.status(4000).send(`Error: ${err.message}`);
        }
};

///////// 프로필 조회 관련

exports.selectUserProfiles = async function (req, res) {
    // const { id } = req.verifiedToken;
   
    const userNickNameIdx = req.params.userIdx; // 패스 variable route에 있는 변수와 params. 뒤에오는 거랑일치시킬것

    if (!userNickNameIdx) return res.json({isSuccess: false, code: 2001, message: "닉네임을 입력해주세요."});

        try {
            
            // 프로필 조회
            const selectUserProfileInfoParams = userNickNameIdx;
            const selectUserProfileInfoRows = await userDao.selectUserProfileInfo(selectUserProfileInfoParams);

            // 게시물 숫자
            const selectUserFeedCountInfoParams = userNickNameIdx;
            const selectUserFeedCountInfoRows = await userDao.selectUserFeedCountInfo(selectUserFeedCountInfoParams);

            // 팔로잉 숫자 
            const selectUserFollowingCountInfoParams = userNickNameIdx;
            const selectUserFollowingCountInfoRows = await userDao.selectUserFollowingCountInfo(selectUserFollowingCountInfoParams);

             // 팔로잉 숫자 
            const selectUserFollowerCountInfoParams = userNickNameIdx;
            const selectUserFollowerCountInfoRows = await userDao.selectUserFollowerCountInfo(selectUserFollowerCountInfoParams);

            // 피드 조회
            const selectUserFeedInfoParams = userNickNameIdx;
            const selectUserFeedInfoRows = await userDao.selectUserFeedInfo(selectUserFeedInfoParams);

            return res.json({
                isSuccess: true,
                code: 1000,
                message: "프로필 조회 성공",
                user: selectUserProfileInfoRows[0],
                feedCount: selectUserFeedCountInfoRows[0],
                followingCount: selectUserFollowingCountInfoRows[0], 
                followerCount: selectUserFollowerCountInfoRows[0],
                feed: selectUserFeedInfoRows[0]
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - 프로필 조회 Query error\n: ${err.message}`);
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