CREATE TABLE TestTable
(
    `testIdx`     INT            NOT NULL    AUTO_INCREMENT COMMENT '테스트번호',
    `testString`  VARCHAR(45)    NOT NULL    COMMENT '테스트문자열',
    PRIMARY KEY (testIdx)
);