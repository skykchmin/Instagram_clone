use Instagram;

-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- User Table Create SQL
CREATE TABLE User
(
    `userNickNameIdx`      INT             NOT NULL    AUTO_INCREMENT COMMENT '닉네임번호',
    `userPassword`         VARCHAR(100)    NOT NULL    COMMENT '비밀번호',
    `userName`             VARCHAR(45)     NOT NULL    COMMENT '이름',
    `userPhoneNumber`      VARCHAR(45)     NULL        COMMENT '전화번호',
    `userEmail`            VARCHAR(45)     NOT NULL    COMMENT '이메일',
    `userAge`              INT             NOT NULL    COMMENT '나이',
    `userDisclosureScope`  TINYINT         NOT NULL    COMMENT '0: 비공개, 1: 전체공개',
    `userProfilePicture`   TEXT            NULL        COMMENT '이미지 URL',
    `userNickName`         VARCHAR(45)     NOT NULL    COMMENT '닉네임',
    `userBirth`            DATE            NOT NULL    COMMENT '생일',
    `profileCreateDate`    TIMESTAMP       NULL        COMMENT 'CURRENT_TIMESTAMP',
    `profileUpdateDate`    TIMESTAMP       NULL        COMMENT 'ON UPDATE CURRENT_TIMESTAMP',
    `userStatus`           TINYINT         NOT NULL    COMMENT '0: 활성화, 1: 비활성화, 2: 탈퇴',
    `userSite`             VARCHAR(45)     NULL        COMMENT '웹사이트',
    `userIntroduce`        MEDIUMTEXT      NULL        COMMENT '소개',
    `userProfileLink`      MEDIUMTEXT      NULL        COMMENT '프로필링크',
    PRIMARY KEY (userNickNameIdx)
);

ALTER TABLE User COMMENT '회원정보';
alter table User change userPhoneNumber userPhoneNumber varchar(20) NULL comment '전화번호';
alter table User change userAge userAge INT NULL comment '나이';
alter table User change userNickName userNickName VARCHAR(45) NULL comment '닉네임';
alter table User change userSite userSite VARCHAR(45) default 0 not NULL comment '웹사이트';
alter table User change `userPassword` `userPassword` varchar(200) not null comment '비밀번호';
alter table User change `profileCreateDate` `profileCreateDate` TIMESTAMP not null default now() comment 'CURRENT_TIMESTAMP';
alter table User change `profileUpdateDate`  `profileUpdateDate`  TIMESTAMP  null default now() comment 'ON UPDATE CURRENT_TIMESTAMP';
alter table User change `userStatus` `userStatus`  varchar(1) not null default '0' comment '0: 활성화, 1: 비활성화, 2: 탈퇴';
alter table User change `userDisclosureScope` `userDisclosureScope` varchar(1) not null default '0' comment '0: 비공개, 1: 전체공개';


-- User Table Create SQL
CREATE TABLE Following
(
    `toUserIdx`        INT    NOT NULL    COMMENT '팔로우하는번호',
    `userNickNameIdx`  INT    NOT NULL    COMMENT '닉네임번호',
    PRIMARY KEY (toUserIdx)
);

ALTER TABLE Following COMMENT '팔로잉';


-- User Table Create SQL
CREATE TABLE Follower
(
    `fromUserIdx`      INT    NOT NULL    COMMENT '팔로잉당하는번호',
    `userNickNameIdx`  INT    NOT NULL    COMMENT '닉네임번호',
    PRIMARY KEY (fromUserIdx)
);

ALTER TABLE Follower COMMENT '팔로워';


-- User Table Create SQL
CREATE TABLE UserLocation
(
    `locationNumber`       INT            NOT NULL    AUTO_INCREMENT COMMENT '위치번호',
    `userLocation`         VARCHAR(45)    NULL        COMMENT '회원위치',
    `location`             VARCHAR(45)    NULL        COMMENT '경도',
    `latutude`             VARCHAR(45)    NULL        COMMENT '위도',
    `certificationStatus`  VARCHAR(45)    NULL        COMMENT '인증상태',
    `userNickNameNumber`   INT            NULL        COMMENT '닉네임번호',
    PRIMARY KEY (locationNumber)
);

ALTER TABLE UserLocation COMMENT '회원위치';


-- User Table Create SQL
CREATE TABLE Liked
(
    `feedIdx`                   INT    NOT NULL    AUTO_INCREMENT COMMENT '피드번호',
    `userNickNameIdx`           INT    NOT NULL    COMMENT '닉네임번호',
    PRIMARY KEY (feedIdx, userNickNameIdx)
);

ALTER TABLE Liked COMMENT '좋아요';
alter table Liked add likeStatus varchar(1) not null default 'L' comment '좋아요상태';

-- User Table Create SQL
CREATE TABLE Media
(
    `feedIdx`      INT        NOT NULL    COMMENT '피드번호',
    `mediaNumber`  INT        NOT NULL    COMMENT '미디어번호',
    `mediaStatus`  TINYINT    NOT NULL    COMMENT '0: 사진, 1: 영화',
    `mediaURL`     TEXT       NOT NULL    COMMENT '미디어URL',
    PRIMARY KEY (feedIdx, mediaNumber)
);

ALTER TABLE Media COMMENT '사진,동영상';
alter table Media drop `mediaStatus`;
alter table Media change `mediaNumber` `mediaIdx` INT not null comment '미디어번호';
#alter table Media change `mediaURL` `mediaURL` varchar(300) not null COMMENT '미디어URL';


-- User Table Create SQL
CREATE TABLE Comment
(
    `commentIdx`         INT          NOT NULL    AUTO_INCREMENT COMMENT '댓글번호',
    `feedIdx`            INT          NOT NULL    COMMENT '피드번호',
    `userNickNameIdx`    INT          NOT NULL    COMMENT '닉네임번호',
    `commentText`        TEXT         NOT NULL    COMMENT '댓글내용',
    `commentCreateDate`  TIMESTAMP    NOT NULL    COMMENT 'CURRENT_TIMESTAMP',
    `commentUpdateDate`  TIMESTAMP    NOT NULL    COMMENT 'ON UPDATE CURRENT_TIMESTAMP',
    PRIMARY KEY (commentIdx, feedIdx, userNickNameIdx)
);

ALTER TABLE Comment COMMENT '댓글';
alter table Comment add `commentParentChild` varchar(1) not null default 'P' comment '댓글부모자식관계';
alter table Comment add `parentCommentIdx` int not null comment '부모댓글번호';
alter table Comment drop `commentUpdateDate`;
alter table Comment change `parentCommentIdx` `parentCommentIdx` int null comment '부모댓글번호';


-- User Table Create SQL
CREATE TABLE CommentLike
(
    `commentIdx`       INT    NOT NULL    AUTO_INCREMENT COMMENT '댓글번호',
    `userNickNameIdx`  INT    NOT NULL    COMMENT '닉네임번호',
    `feedIdx`          INT    NOT NULL    COMMENT '피드번호',
    PRIMARY KEY (commentIdx, userNickNameIdx, feedIdx)
);

ALTER TABLE CommentLike COMMENT '댓글 좋아요';
alter table CommentLike add `commentlikeStatus` varchar(1) not null default 'L' comment '댓글좋아요상태';



-- User Table Create SQL
CREATE TABLE Reply
(
    `replytIdx`        INT          NOT NULL    AUTO_INCREMENT COMMENT '대댓글번호',
    `feedIdx`          INT          NOT NULL    COMMENT '피드번호',
    `commentIdx`       INT          NOT NULL    COMMENT '댓글번호',
    `userNickNameIdx`  INT          NOT NULL    COMMENT '닉네임번호',
    `replyText`        TEXT         NOT NULL    COMMENT '대댓글내용',
    `replyCreateDate`  TIMESTAMP    NOT NULL    COMMENT 'CURRENT_TIMESTAMP',
    `replyUpdateDate`  TIMESTAMP    NOT NULL    COMMENT 'ON UPDATE CURRENT_TIMESTAMP',
    PRIMARY KEY (replytIdx, feedIdx, commentIdx, userNickNameIdx)
);

ALTER TABLE Reply COMMENT '대댓글';


-- User Table Create SQL
CREATE TABLE ReplyLike
(
    `replyIdx`         INT    NOT NULL    AUTO_INCREMENT COMMENT '대댓글번호',
    `commentIdx`       INT    NOT NULL    COMMENT '댓글번호',
    `userNickNameIdx`  INT    NOT NULL    COMMENT '닉네임번호',
    `feedIdx`          INT    NOT NULL    COMMENT '피드번호',
    PRIMARY KEY (replyIdx, commentIdx, userNickNameIdx, feedIdx)
);

ALTER TABLE ReplyLike COMMENT '대댓글 좋아요';


-- User Table Create SQL
CREATE TABLE Feed
(
    `feedIdx`          INT          NOT NULL    AUTO_INCREMENT COMMENT '피드번호',
    `userNickNameIdx`  INT          NOT NULL    COMMENT '닉네임번호',
    `feedCreateDate`   TIMESTAMP    NOT NULL    COMMENT 'CURRENT_TIMESTAMP',
    `feedUpdateDate`   TIMESTAMP    NOT NULL    COMMENT 'ON UPDATE CURRENT_TIMESTAMP',
    `caption`          TEXT         NOT NULL    COMMENT '피드내용',
    `feedStatus`       TINYINT      NOT NULL    COMMENT '0: 공개 1: 비공개',
    PRIMARY KEY (feedIdx, userNickNameIdx)
);

ALTER TABLE Feed COMMENT '피드';
alter table Feed drop feedStatus;
alter table Feed change `feedCreateDate`  `feedCreateDate`  TIMESTAMP NOT NULL default now() comment 'CURRENT_TIMESTAMP';
alter table Feed change `feedUpdateDate`  `feedUpdateDate`  TIMESTAMP NOT NULL default now() comment 'ON UPDATE CURRENT_TIMESTAMP';


-- User Table Create SQL
CREATE TABLE FollowingFollower
(
    `toUserIdx`    INT    NOT NULL    COMMENT '팔로우하는번호',
    `fromUserIdx`  INT    NOT NULL    COMMENT '팔로잉당하는번호',
    PRIMARY KEY (toUserIdx, fromUserIdx)
);

ALTER TABLE FollowingFollower COMMENT '팔로잉-팔로워';
alter table FollowingFollower add followStatus varchar(1) default 'F'  not null comment '팔로우상태';
alter table FollowingFollower change followStatus followStatus varchar(1) default 'F' comment '팔로우상태';
alter table FollowingFollower drop followStatus;
alter table FollowingFollower change followStatus followStatus varchar(1) default 'F' comment '팔로우상태';
-- User Table Create SQL
CREATE TABLE Story
(
    `storyIdx`         INT        NOT NULL    AUTO_INCREMENT COMMENT '스토리번호',
    `userNickNameIdx`  INT        NULL        COMMENT '닉네임번호',
    `highLight`        TINYINT    NULL        COMMENT '0:하이라이트 등록 X, 1:하이라이트 등록O',
    `storyMedia`       TEXT       NULL        COMMENT '스토리미디어',
    PRIMARY KEY (storyIdx)
);

ALTER TABLE Story COMMENT '스토리';

CREATE TABLE test
(

    `mediaURL`     TEXT       NOT NULL    COMMENT '미디어URL'

);

ALTER TABLE test COMMENT '테스트';

insert into test (mediaURL) values (?);

CREATE TABLE Story
(
    `storyIdx`          INT           NOT NULL    AUTO_INCREMENT COMMENT '스토리번호',
    `userNickNameIdx`   INT           NOT NULL    COMMENT '닉네임번호',
    `highLight`         VARCHAR(1)    NOT NULL    COMMENT '0:하이라이트 등록 X, 1:하이라이트 등록O',
    `storyMedia`        TEXT          NOT NULL    COMMENT '스토리미디어',
    `storyCreateTime`   TIMESTAMP     NOT NULL    COMMENT 'CURRENT_TIMESTAMP',
    `storyUpdaateTime`  TIMESTAMP     NOT NULL    COMMENT 'ON UPDATE CURRENT_TIMESTAMP',
    `storyStatus`       VARCHAR(1)    NOT NULL    DEFAULT '0' COMMENT '0: 활성화, 1: 사라짐',
    PRIMARY KEY (storyIdx, userNickNameIdx)
);

ALTER TABLE Story COMMENT '스토리';


CREATE TABLE StoryHistory
(
    `storyIdx`         INT    NOT NULL    COMMENT '스토리번호',
    `userNickNameIdx`  INT    NOT NULL    COMMENT '닉네임번호',
    PRIMARY KEY (storyIdx, userNickNameIdx)
);
ALTER TABLE Story COMMENT '스토리 시청 기록';

create table HighLight
( `highLightIdx` int not null comment '하이라이트 번호',
    `storyIdx` int not null comment '스토리 번호',
    primary key (highLightIdx,storyIdx)
);
ALTER TABLE StoryHistory COMMENT '하이라이트';
alter table HighLight add `highLightName` int not null comment '하이라이트이름';