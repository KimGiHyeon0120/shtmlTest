const express = require('express');

const app = express();

//cors 설정 ( 모두 허용 )
const cors = require('cors')

// //cors 설정 ( 일부 허용 )
// const corsOption = {
//     origin: 'http://localhost:8080',
//     optionSuccessStatus: 200
// }

app.use(cors())

//DB 설정
const mysql = require('mysql2')
const connection = mysql.createConnection(
    {
        //key값 우리가 들어가는 곳
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'mydb'
    }
);
connection.connect();



//node의 기본 포트는 3000, vue, react는 기본포트 3000
app.listen(3000, function () {
    console.log('노드시작')
})


//node 불러오는 방법
app.get('/', (req, res) => {
    console.log('page start')
    res.send('Hello world')
})

/*───────────────────────────────────────────────────────────────────────────────────────────*/




/*회원가입*/

const multer = require('multer');
const path = require('path');

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profile/');  // 이미지가 저장될 경로
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // 파일 이름을 현재 시간으로 설정
    }
});

const upload = multer({ storage: storage });

app.post('/join', upload.single('profilePic'), (req, res) => {
    console.log(req.body);
    let idd = req.body.idd;
    let paw = req.body.paw;
    let ema = req.body.ema;
    let uname = req.body.uname;
    let phone = req.body.phone;
    let regDate = new Date();  // 회원가입 날짜 현재 시간으로 설정
    let profilePic = req.file ? req.file.filename : 'default.png';  // 이미지가 없으면 기본 이미지 설정

    console.log(idd, paw, ema, uname, phone, profilePic);

    connection.query('SELECT * FROM User WHERE username = ?', [idd], (err, rows) => {
        if (err) {
            console.log('err: ', err);
        }
        if (rows.length > 0) {
            let responseData = new Object();
            responseData.status = 409;  // 중복 아이디가 있을 경우
            res.json(responseData);
        } else {
            connection.query(
                'INSERT INTO User(username, pwd, email, name, phone, regDate, profilePic) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [idd, paw, ema, uname, phone, regDate, profilePic],
                (err, rows) => {
                    if (err) {
                        console.log('err: ', err);
                    }
                    let responseData = new Object();
                    responseData.status = 200;  // 성공적인 응답
                    responseData.list = rows;
                    res.json(responseData);
                }
            );
        }
    });
});
/*───────────────────────────────────────────────────────────────────────────────────────────*/

/*로그인 기능*/
app.get('/login', (req, res) => {
    let userName = req.query.userId;
    let pwd = req.query.pwd;

    connection.query('SELECT * FROM User WHERE username = ? AND pwd = ?', [userName, pwd], (err, rows) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log(rows);
        if (rows.length > 0) {
            let responseData = {
                status: 200,
                name: rows[0].name // 유저의 이름을 rows[0]에서 가져옵니다.
            };
            res.json(responseData); // 클라이언트에게 전달
        } else {
            let responseData = {
                status: 409
            };
            res.json(responseData);
        }
    });
});
/*───────────────────────────────────────────────────────────────────────────────────────────*/
/*아이디 찾기 기능*/
app.get('/findID', (req, res) => {

    let phoneNumber = req.query.phoneNumber;

    connection.query('select username from user where phone = ?;', [phoneNumber], (err, rows) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log(rows);
        if (rows.length > 0) {
            let responseData = {
                status: 200,
            };
            res.json(responseData);
        } else {
            let responseData = {
                status: 409
            };
            res.json(responseData);
        }
    });
});

/*───────────────────────────────────────────────────────────────────────────────────────────*/


const apiKey = 'D7F4C7952448B7CD718AB650B5F6CBA5';  // 발급받은 Steam API 키
const appIds = [
    '1506830', '389730', '49520', '1644960',
    '570', '730', '440', '3123410', '544920', '1309710', '1610370', '1935400', '2396980', '1765300',
    '1359090', '2694420', '1757300', '1999520', '3009340', '3111710', '1301060', '1465360', '1206200', '1759080',
    '2964280', '2082470', '1058770', '1371980', '2928510', '2730800', '1016950', '2824660', '1763250', '2955320',
    '2328380', '985810', '3069890', '1263240', '951440', '1479730', '2818260', '2727650', '941460', '440900',
    '252490', '1295660', '2054970', '1163070', '1234720', '3128740', '3156130', '1710410', '2307350', '2866290',
    '1881700', '1171690', '3216340', '3224750', '3224960', '2623190', '2222650', '3205990', '2377110', '2328650',
    '3210670', '3029820', '305620', '2795270', '2325310', '1444480', '497080', '1172470', '579080', '1086940',
    '271590', '270880', '1089470', '2824660',
    '381210', '221100', '359550', '238960', '252950', '346110', '322330', '513710', '230410', '252950',
    '374320', '582010', '1144200', '1250410', '593110', '892970', '204450', '2109310', '582660', '1286830',
    '218620', '367520', '620', '39140', '359550', '620', '730310', '1113410', '222640', '1091500',
    '374320', '552520', '239140', '573170', '460930', '269210', '233860', '379720', '107410', '222480',
    '236390', '252490', '4000', '578080', '322170', '526870', '289070', '945360', '386360', '582010',
    '567640', '304930', '291550', '1328670', '1091500', '611500', '4920', '286160', '281990', '289070',
    '644930', '444090', '304390', '8500', '548430', '1085660', '291480', '755790', '374040', '221100',
    '480', '8500', '4200', '292380', '1097830', '388990', '232090', '578080', '552500', '674940',

    '1046930', '1124300', '1172470', '1097150', '1151340', '858210', '1203220', '218620', '275850', '513710',
    '489830', '1174180', '1245620', '1624600', '548430', '1328670', '378370', '518790', '1066890', '1190460',
    '1213210', '466560', '1172380', '1862680', '635260', '218620', '1852470', '1167630', '1551360', '108600',
    '1794680', '207140', '1237970', '1172470', '1184370', '1466840', '223750', '238960', '1599340', '375530',
    '1669000', '1080980', '1449850', '211340', '246280', '752850', '1798010', '1778220', '1718240', '1537480',
    '268910', '630930', '431960', '1182000', '105600', '1222190', '1799810', '1192460', '1986450', '752600',
    '1570150', '1312210',
    '1408490',
    '1021140', '1587820', '1400300', '1393030', '1489250', '1018250', '99810',
    '1263850', '1128500',
    '1477610', '1494610', '1124300', '1328670', '931160', '1085660', '1354720',
    '1832840', '1368020', '1782210', '1506830',
    '1557920',
    '1105560', '1453060', '1557210', '780850', '1851370', '1144840',
    '1101250', '1332440', '1787050', '1058000', '1824860', '1049590', '1128310',
    '1886860', '1130930',
    '1091500', '233290', '117500', '206830', '290810', '1550120', '1210750', '1624620', '1545720', '780650',
    '440510', '201510', '319810', '1468610', '1022320', '1022090', '1093710', '1193040', '1113410', '1399890',
    '253230', '279900', '597720', '1034270',
    '570940', '1097840', '816090', '47890', '739630', '648800', '22380', '271590', '289070', '1174180',
    '211420', '427520', '220', '480490', '573090', '1250410', '232090', '220070', '333600', '794600',
    '221100', '230410', '49520', '105600', '362890', '359550', '323190', '221100', '1250410', '252490',
    '1144200', '231430', '271590', '582010', '548430', '611500', '332310', '597820', '794600', '232430',
    '1046930', '359320', '34270', '646570', '102500', '440900', '110800',
    '476600', '349540', '264710',
    '236430', '593680', '227300', '552500', '337000', '204450', '47890', '72850', '55230', '204880',
    '220240', '282800', '322920', '252950', '489830', '306020', '493840', '648800', '227940', '560130',
    '391540',
    '275850', '235210', '232090', '333600', '646570', '72850', '246620', '12160', '234140',
    '49520', '440', '1174180', '1097150', '1144200', '578080', '244850', '1085660', '848450',
    '241930',
    '269950', '440', '227300', '230410', '573090', '1250410', '232430', '22320', '359320', '487720',
    '49520', '65980', '1286830', '977950', '2069180', '1638720', '990080', '2369390',
    '2084000'
];

// 여러 개의 App ID


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

/*검색 테스트*/
app.get('/search', (req, res) => {
    const searchTerm = req.query.q; // 클라이언트로부터 검색어를 받습니다.

    if (!searchTerm) {
        return res.status(400).json({ message: '검색어를 입력해주세요' });
    }

    const query = `SELECT * FROM Game WHERE gameName LIKE ? OR description LIKE ?`;
    const searchValue = `%${searchTerm}%`; // 검색어를 포함하는 게임을 찾습니다.

    connection.query(query, [searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('DB 조회 중 오류 발생:', err);
            return res.status(500).json({ message: 'DB 조회 중 오류 발생' });
        }
        res.json(results);
    });
});


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

// 날짜 형식을 'YYYY-MM-DD'로 변환하는 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/
// 딜레이 함수 (ms 단위) //한번에하면 오류걸림
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

/* 게임테이블에 api정보들 추가*/
app.get('/insert-games', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            if (!gameData || !gameData.name) {
                console.warn(`게임 데이터가 존재하지 않음 또는 유효하지 않음: appId = ${appId}`);
                continue;
            }

            const game = {
                name: gameData.name || '정보 없음',
                price: gameData.price_overview ? gameData.price_overview.final / 100 : 0,
                developer: gameData.developers ? gameData.developers.join(', ') : '정보 없음',
                releaseDate: gameData.release_date ? formatDate(gameData.release_date.date) : null,
                description: gameData.short_description || '설명이 없습니다',
                publisher: gameData.publishers ? gameData.publishers.join(', ') : '정보 없음',
                appId: appId
            };

            // 게임이 이미 DB에 있는지 확인
            const checkQuery = `SELECT gameId FROM Game WHERE appId = ?`;

            connection.query(checkQuery, [game.appId], (err, result) => {
                if (err) {
                    console.error('DB 조회 중 오류 발생:', err);
                    return;
                }

                // 이미 DB에 게임이 존재하면 패스
                if (result.length > 0) {
                    console.log(`게임이 이미 존재함: ${game.name}`);
                    return;
                }

                // DB에 게임 정보 삽입
                const insertGameQuery = `INSERT INTO Game (gameName, price, developer, releaseDate, description, appId, publisher)
                                         VALUES (?, ?, ?, ?, ?, ?, ?)
                                         ON DUPLICATE KEY UPDATE price = VALUES(price), developer = VALUES(developer), 
                                         releaseDate = VALUES(releaseDate), description = VALUES(description), publisher = VALUES(publisher)`;

                connection.query(insertGameQuery, [game.name, game.price, game.developer, game.releaseDate, game.description, game.appId, game.publisher], (err, result) => {
                    if (err) {
                        console.error('DB 저장 중 오류 발생:', err);
                    } else {
                        console.log(`게임 정보 저장: ${game.name}`);

                        // 이미지 테이블에 저장 (다수의 이미지 처리)
                        const imageUrls = [gameData.header_image, gameData.screenshots?.map(img => img.path_thumbnail)].flat();
                        if (imageUrls) {
                            imageUrls.forEach(imageUrl => {
                                const insertImageQuery = `INSERT INTO GameImage (gameId, imageUrl) VALUES (?, ?)`;
                                connection.query(insertImageQuery, [result.insertId, imageUrl], (err, result) => {
                                    if (err) {
                                        console.error('이미지 저장 중 오류 발생:', err);
                                    } else {
                                        console.log(`이미지 저장 완료: ${imageUrl}`);
                                    }
                                });
                            });
                        }
                    }
                });
            });

            // 딜레이 추가
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.json({ message: '게임 정보 및 이미지 저장 완료' });
    } catch (error) {
        console.error('Steam API 호출 중 오류 발생:', error.message);
        res.status(500).json({ message: '게임 정보 삽입 중 오류 발생' });
    }
});




app.get('/insert-games-with-images', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            if (gameData) {
                const game = {
                    name: gameData.name || '정보 없음',
                    price: gameData.price_overview ? gameData.price_overview.final / 100 : 0,
                    developer: gameData.developers ? gameData.developers.join(', ') : '정보 없음',
                    releaseDate: gameData.release_date ? formatDate(gameData.release_date.date) : null,
                    description: gameData.short_description || '설명이 없습니다',
                    publisher: gameData.publishers ? gameData.publishers.join(', ') : '정보 없음',
                    imageUrl: gameData.header_image || '이미지 없음',  // 대표 이미지 URL
                    avgRating: null, // 리뷰 시스템 연동 후 추가 가능
                    appId: appId
                };

                // gameId를 찾는 쿼리 (게임이 이미 DB에 있는지 확인)
                const gameIdQuery = `SELECT gameId, imageUrl FROM Game WHERE appId = ?`;

                connection.query(gameIdQuery, [appId], (err, gameResult) => {
                    if (err) {
                        console.error('게임 정보 조회 중 오류 발생:', err);
                        return;
                    }

                    // 게임이 DB에 이미 존재하는 경우
                    if (gameResult.length > 0) {
                        const gameId = gameResult[0].gameId;
                        const existingImageUrl = gameResult[0].imageUrl;

                        // 대표 이미지가 없을 경우에만 업데이트
                        if (!existingImageUrl || existingImageUrl === '이미지 없음') {
                            const updateImageQuery = `UPDATE Game SET imageUrl = ? WHERE gameId = ?`;
                            connection.query(updateImageQuery, [game.imageUrl, gameId], (err, result) => {
                                if (err) {
                                    console.error('대표 이미지 업데이트 중 오류 발생:', err);
                                } else {
                                    console.log(`대표 이미지 업데이트 완료: ${game.name}`);
                                }
                            });
                        } else {
                            console.log(`대표 이미지가 이미 존재합니다: ${game.name}`);
                        }

                        // 스크린샷 삽입 (스크린샷이 이미 있는지 확인 후 없으면 삽입)
                        if (gameData.screenshots) {
                            gameData.screenshots.forEach(screenshot => {
                                const checkScreenshotQuery = `SELECT imageUrl FROM GameImage WHERE gameId = ? AND imageUrl = ?`;
                                connection.query(checkScreenshotQuery, [gameId, screenshot.path_full], (err, result) => {
                                    if (err) {
                                        console.error('스크린샷 조회 중 오류 발생:', err);
                                    } else if (result.length === 0) {
                                        const screenshotQuery = `INSERT INTO GameImage (gameId, imageUrl)
                                                                 VALUES (?, ?)`;
                                        connection.query(screenshotQuery, [gameId, screenshot.path_full], (err, result) => {
                                            if (err) {
                                                console.error('스크린샷 저장 중 오류 발생:', err);
                                            } else {
                                                console.log(`스크린샷 저장 완료: ${screenshot.path_full}`);
                                            }
                                        });
                                    } else {
                                        console.log(`스크린샷이 이미 존재합니다: ${screenshot.path_full}`);
                                    }
                                });
                            });
                        }
                    }
                    // 게임이 DB에 없는 경우, 게임 정보 및 이미지를 삽입
                    else {
                        const gameQuery = `INSERT INTO Game (gameName, price, developer, releaseDate, description, publisher, imageUrl, appId)
                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                        connection.query(gameQuery, [game.name, game.price, game.developer, game.releaseDate, game.description, game.publisher, game.imageUrl, game.appId], (err, result) => {
                            if (err) {
                                console.error('게임 정보 저장 중 오류 발생:', err);
                            } else {
                                const gameId = result.insertId;
                                console.log(`게임 정보 저장: ${game.name}`);

                                // 스크린샷 삽입
                                if (gameData.screenshots) {
                                    gameData.screenshots.forEach(screenshot => {
                                        const screenshotQuery = `INSERT INTO GameImage (gameId, imageUrl)
                                                                 VALUES (?, ?)`;
                                        connection.query(screenshotQuery, [gameId, screenshot.path_full], (err, result) => {
                                            if (err) {
                                                console.error('스크린샷 저장 중 오류 발생:', err);
                                            } else {
                                                console.log(`스크린샷 저장 완료: ${screenshot.path_full}`);
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                console.warn(`게임 데이터가 존재하지 않음: appId = ${appId}`);
            }

            // 딜레이 추가
            await delay(1000);
        }

        res.json({ message: '게임 정보 및 이미지 저장 완료' });
    } catch (error) {
        console.error('Steam API 호출 중 오류 발생:', error.message);
        res.status(500).json({ message: '게임 정보 삽입 중 오류 발생' });
    }
});
















/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

/*게임 정보들 조회*/
app.get('/getAllGames', (req, res) => {
    connection.query('SELECT * FROM Game', (err, rows) => {
        if (err) {
            console.log('DB 조회 중 오류 발생:', err);
            res.status(500).json({ message: 'DB 조회 중 오류 발생' });
        } else {
            let responseData = {
                status: 200,
                games: rows
            };
            res.json(responseData);
        }
    });
});


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

//테이블  카테고리 - 카테고리게임 연결
const categoryMap = {
    'Free to Play': '무료 플레이',
    'Early Access': '앞서 해보기',
    'MMO': 'MMO',
    'RPG': 'RPG',
    'Racing': '레이싱',
    'Sports': '스포츠',
    'Simulation': '시뮬레이션',
    'Action': '액션',
    'Adventure': '어드벤처',
    'Indie': '인디',
    'Strategy': '전략',
    'Casual': '캐주얼'
};

app.get('/link-categories', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            // gameData가 null인지 확인
            if (!gameData) {
                console.warn(`게임 데이터가 존재하지 않음: appId = ${appId}`);
                continue;  // 다음 게임으로 넘어감
            }

            if (gameData.genres) {
                const gameName = gameData.name;

                // 게임 ID 조회 로직
                const gameIdQuery = `SELECT gameId FROM Game WHERE gameName = ?`;

                connection.query(gameIdQuery, [gameName], (err, gameResult) => {
                    if (err) {
                        console.error('게임 ID 조회 중 오류 발생:', err);
                        return;
                    }
                    if (!gameResult.length) {
                        console.warn(`게임 ID를 찾을 수 없습니다: ${gameName}`);
                        return;
                    }
                    const gameId = gameResult[0].gameId;

                    // 장르를 카테고리와 매핑하여 GameCategory에 연결
                    gameData.genres.forEach(genre => {
                        const koreanCategory = categoryMap[genre.description];

                        if (!koreanCategory) {
                            console.warn(`매핑되지 않은 카테고리: ${genre.description}`);
                            return;
                        }

                        const categoryQuery = `SELECT categoryId FROM Category WHERE categoryName = ?`;

                        connection.query(categoryQuery, [koreanCategory], (err, categoryResult) => {
                            if (err) {
                                console.error('카테고리 ID 조회 중 오류 발생:', err);
                                return;
                            }
                            if (!categoryResult.length) {
                                console.warn(`카테고리 ID를 찾을 수 없습니다: ${koreanCategory}`);
                                return;
                            }
                            const categoryId = categoryResult[0].categoryId;

                            const linkQuery = `INSERT INTO GameCategory (gameId, categoryId)
                                               VALUES (?, ?)
                                               ON DUPLICATE KEY UPDATE gameId = VALUES(gameId), categoryId = VALUES(categoryId)`;

                            connection.query(linkQuery, [gameId, categoryId], (err, linkResult) => {
                                if (err) {
                                    console.error('게임-카테고리 연결 중 오류 발생:', err);
                                } else {
                                    console.log(`게임-카테고리 연결 완료: ${gameName} - ${koreanCategory}`);
                                }
                            });
                        });
                    });
                });
            } else {
                console.warn(`장르 정보가 존재하지 않음: appId = ${appId}`);
            }

            await delay(1000); // 1초 딜레이
        }

        res.json({ message: '게임과 카테고리 연결 완료' });
    } catch (error) {
        console.error('카테고리 연결 중 오류 발생:', error);
        res.status(500).json({ message: '카테고리 연결 중 오류 발생' });
    }
});


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/


const exchangeRate = 1300;  // 달러 -> 원화 환율

// 할인 정보를 Steam API에서 가져와서 DB에 삽입
app.get('/add-discounts', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            try {
                // Steam API 요청
                const response = await fetch(url);
                const data = await response.json();
                const gameData = data[appId]?.data;

                // 게임 데이터가 있고 할인 정보가 있을 경우
                if (gameData && gameData.price_overview && gameData.price_overview.discount_percent > 0) {
                    const discount = {
                        rate: gameData.price_overview.discount_percent,  // 할인율 (%)
                        start: new Date(),  // 할인 시작일 (임시로 현재 날짜)
                        end: new Date(new Date().setMonth(new Date().getMonth() + 1))  // 할인 종료일을 한 달 뒤로 설정
                    };

                    // 할인 정보를 Discount 테이블에 삽입
                    const discountQuery = `INSERT INTO Discount (discountRate, discountStart, discountEnd)
                                           VALUES (?, ?, ?)
                                           ON DUPLICATE KEY UPDATE discountRate = VALUES(discountRate), 
                                           discountStart = VALUES(discountStart), discountEnd = VALUES(discountEnd)`;

                    connection.query(discountQuery, [discount.rate, discount.start, discount.end], (err, result) => {
                        if (err) {
                            console.error('할인 정보 저장 중 오류 발생:', err);
                        } else {
                            console.log(`할인 정보 저장 완료: ${appId}`);
                        }
                    });

                    // 할인 ID 가져와서 GameDiscount와 연결
                    const discountIdQuery = `SELECT discountId FROM Discount WHERE discountRate = ? AND discountStart = ? AND discountEnd = ?`;
                    connection.query(discountIdQuery, [discount.rate, discount.start, discount.end], (err, rows) => {
                        if (err) {
                            console.error('할인 ID 조회 중 오류 발생:', err);
                        } else if (rows.length > 0) {
                            const discountId = rows[0].discountId;

                            const gameDiscountQuery = `INSERT INTO GameDiscount (gameId, discountId)
                                                       VALUES (?, ?)
                                                       ON DUPLICATE KEY UPDATE gameId = VALUES(gameId), discountId = VALUES(discountId)`;

                            connection.query(gameDiscountQuery, [appId, discountId], (err, result) => {
                                if (err) {
                                    console.error('게임-할인 정보 연결 중 오류 발생:', err);
                                } else {
                                    console.log(`게임-할인 정보 연결 완료: ${appId}`);
                                }
                            });
                        }
                    });
                } else {
                    console.log(`할인 정보가 없습니다: ${appId}`);
                }
            } catch (error) {
                console.error(`Steam API 오류 (App ID: ${appId}):`, error.message);
            }

            // 1초(1000ms) 딜레이 추가
            await delay(1000);
        }

        res.json({ message: '할인 정보가 성공적으로 추가되었습니다.' });
    } catch (error) {
        console.error('Steam API 호출 중 오류 발생:', error);
        res.status(500).json({ message: '할인 정보 추가 중 오류 발생' });
    }
});


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

app.get('/update-game-prices', (req, res) => {
    const query = 'SELECT gameId, price FROM Game WHERE price < 100'; // 100원 이하인 가격 조회

    connection.query(query, (err, results) => {
        if (err) {
            console.error('DB 조회 중 오류 발생:', err);
            return res.status(500).json({ message: 'DB 조회 중 오류 발생' });
        }

        // 가격 변환 및 업데이트
        results.forEach(game => {
            const newPrice = Math.ceil(game.price * exchangeRate); // 환율 적용하여 가격 변환

            const updateQuery = 'UPDATE Game SET price = ? WHERE gameId = ?';
            connection.query(updateQuery, [newPrice, game.gameId], (err, result) => {
                if (err) {
                    console.error(`가격 업데이트 중 오류 발생: gameId = ${game.gameId}`, err);
                } else {
                    console.log(`가격 업데이트 완료: gameId = ${game.gameId}, newPrice = ${newPrice}`);
                }
            });
        });

        res.json({ message: '가격 업데이트 완료' });
    });
});


/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

// 게임-할인 정보 연결
app.get('/link-game-discount', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            if (gameData && gameData.price_overview && gameData.price_overview.discount_percent > 0) {
                const discountRate = gameData.price_overview.discount_percent;
                const originalPrice = gameData.price_overview.initial;
                const discountedPrice = gameData.price_overview.final;

                // 할인 시작일과 종료일은 임의로 설정 (필요 시 API에서 적절히 가져올 수 있는 방법 찾아야 함)
                const discountStart = new Date();  // 현재 시간
                const discountEnd = new Date(new Date().setMonth(new Date().getMonth() + 1)); // 한 달 후 종료

                // 할인 정보 저장
                const discountQuery = `INSERT INTO Discount (discountRate, discountStart, discountEnd)
                                       VALUES (?, ?, ?)
                                       ON DUPLICATE KEY UPDATE discountRate = VALUES(discountRate), 
                                       discountStart = VALUES(discountStart), discountEnd = VALUES(discountEnd)`;

                connection.query(discountQuery, [discountRate, discountStart, discountEnd], (err, result) => {
                    if (err) {
                        console.error('할인 정보 저장 중 오류 발생:', err);
                        return;
                    }

                    const discountIdQuery = `SELECT discountId FROM Discount WHERE discountRate = ? AND discountStart = ? AND discountEnd = ?`;
                    connection.query(discountIdQuery, [discountRate, discountStart, discountEnd], (err, discountRows) => {
                        if (err) {
                            console.error('할인 ID 조회 중 오류 발생:', err);
                            return;
                        }

                        if (discountRows.length > 0) {
                            const discountId = discountRows[0].discountId;

                            // 게임 정보에서 gameId 가져오기
                            const gameIdQuery = `SELECT gameId FROM Game WHERE appId = ?`;
                            connection.query(gameIdQuery, [appId], (err, gameRows) => {
                                if (err) {
                                    console.error('게임 ID 조회 중 오류 발생:', err);
                                    return;
                                }

                                if (gameRows.length > 0) {
                                    const gameId = gameRows[0].gameId;

                                    // 게임-할인 정보 연결
                                    const gameDiscountQuery = `INSERT INTO GameDiscount (gameId, discountId)
                                                               VALUES (?, ?)
                                                               ON DUPLICATE KEY UPDATE gameId = VALUES(gameId), discountId = VALUES(discountId)`;

                                    connection.query(gameDiscountQuery, [gameId, discountId], (err, result) => {
                                        if (err) {
                                            console.error('게임-할인 정보 연결 중 오류 발생:', err);
                                        } else {
                                            console.log(`게임-할인 정보 연결 완료: gameId ${gameId} - discountId ${discountId}`);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            } else {
                console.log(`할인 정보가 존재하지 않음: appId ${appId}`);
            }

            // 1초 딜레이 추가
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.json({ message: '게임과 할인 정보 연결 완료' });
    } catch (error) {
        console.error('게임-할인 정보 연결 중 오류 발생:', error);
        res.status(500).json({ message: '게임-할인 정보 연결 중 오류 발생' });
    }
});

/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

const tagMap = {
    'Action': '액션',
    'Adventure': '어드벤처',
    'RPG': '롤플레잉 게임',
    'Strategy': '전략',
    'Indie': '인디',
    'Casual': '캐주얼',
    'Simulation': '시뮬레이션',
    'Horror': '공포',
    'Multiplayer': '멀티플레이어',
    'Co-op': '협동 플레이',
    'Singleplayer': '싱글플레이어',
    'Open World': '오픈 월드',
    'Puzzle': '퍼즐',
    'Survival': '생존',
    'Sci-fi': 'SF',
    'Fantasy': '판타지',
    'Platformer': '플랫포머',
    'First-person': '1인칭',
    'Third-person': '3인칭',
    'Sandbox': '샌드박스',
    'Sports': '스포츠',
    'Free to Play': '무료 플레이'
};

// 태그 나누기// 태그 나누기
// 태그 나누기
app.get('/link-random-tags', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            if (!gameData) {
                console.warn(`게임 데이터가 존재하지 않음: appId = ${appId}`);
                continue;
            }

            const gameName = gameData.name;
            const gamePrice = gameData.price_overview ? gameData.price_overview.final / 100 : 0;

            // Game ID 조회
            const gameIdQuery = `SELECT gameId FROM Game WHERE gameName = ?`;
            connection.query(gameIdQuery, [gameName], (err, gameResult) => {
                if (err) {
                    console.error('게임 ID 조회 중 오류 발생:', err);
                    return;
                }
                if (!gameResult.length) {
                    console.warn(`게임 ID를 찾을 수 없습니다: ${gameName}`);
                    return;
                }
                const gameId = gameResult[0].gameId;

                // 태그 테이블에서 1~21번 태그 중 랜덤으로 5개 선택
                const randomTagQuery = `SELECT tagId FROM Tag WHERE tagId BETWEEN 1 AND 21 ORDER BY RAND() LIMIT 5`;
                connection.query(randomTagQuery, (err, tagResults) => {
                    if (err) {
                        console.error('랜덤 태그 조회 중 오류 발생:', err);
                        return;
                    }

                    // 랜덤 태그 5개 추가
                    tagResults.forEach(tag => {
                        const tagId = tag.tagId;

                        // GameTag에 태그와 게임 연결
                        const linkQuery = `INSERT INTO GameTag (gameId, tagId)
                                           VALUES (?, ?)
                                           ON DUPLICATE KEY UPDATE gameId = VALUES(gameId), tagId = VALUES(tagId)`;
                        connection.query(linkQuery, [gameId, tagId], (err, linkResult) => {
                            if (err) {
                                console.error('게임-태그 연결 중 오류 발생:', err);
                            } else {
                                console.log(`게임-태그 연결 완료: ${gameName} - 태그 ID: ${tagId}`);
                            }
                        });
                    });

                    // 가격이 0인 게임에 태그 22 추가
                    if (gamePrice === 0) {
                        const tag22Query = `INSERT INTO GameTag (gameId, tagId)
                                            VALUES (?, 22)
                                            ON DUPLICATE KEY UPDATE gameId = VALUES(gameId), tagId = VALUES(tagId)`;
                        connection.query(tag22Query, [gameId], (err, result) => {
                            if (err) {
                                console.error('태그 22 추가 중 오류 발생:', err);
                            } else {
                                console.log(`무료 플레이 태그(22) 추가 완료: ${gameName}`);
                            }
                        });
                    }
                });
            });

            await delay(1000); // 1초 딜레이
        }

        res.json({ message: '게임과 태그 연결 완료' });
    } catch (error) {
        console.error('태그 연결 중 오류 발생:', error);
        res.status(500).json({ message: '태그 연결 중 오류 발생' });
    }
});



/*──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────*/

// 랜덤 할인 정보 연결
app.get('/link-random-discount', async (req, res) => {
    try {
        for (let i = 0; i < appIds.length; i++) {
            const appId = appIds[i];
            const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

            const response = await fetch(url);
            const data = await response.json();
            const gameData = data[appId]?.data;

            // gameData가 null인지 확인
            if (!gameData) {
                console.warn(`게임 데이터가 존재하지 않음: appId = ${appId}`);
                continue;  // 다음 게임으로 넘어감
            }

            const gameName = gameData.name;
            const originalPrice = gameData.price_overview?.final || 0;

            // 가격이 0원인 경우 패스
            if (originalPrice === 0) {
                console.warn(`게임이 무료입니다: appId = ${appId}`);
                continue;
            }

            // 게임 ID 조회 로직
            const gameIdQuery = `SELECT gameId FROM Game WHERE gameName = ?`;

            connection.query(gameIdQuery, [gameName], (err, gameResult) => {
                if (err) {
                    console.error('게임 ID 조회 중 오류 발생:', err);
                    return;
                }
                if (!gameResult.length) {
                    console.warn(`게임 ID를 찾을 수 없습니다: ${gameName}`);
                    return;
                }

                const gameId = gameResult[0].gameId;

                // 무작위로 할인 적용 여부 결정
                const applyDiscount = Math.random() < 0.5;

                if (applyDiscount) {
                    // 랜덤으로 할인율 선택 (5%~95%)
                    const randomDiscountRate = Math.floor(Math.random() * 19) * 5 + 5;

                    // 할인 정보 삽입
                    const insertDiscountQuery = `
                        INSERT INTO Discount (discountRate, discountStart, discountEnd)
                        VALUES (?, '2024-09-11', '2024-09-25')
                    `;

                    connection.query(insertDiscountQuery, [randomDiscountRate], (err, discountResult) => {
                        if (err) {
                            console.error('할인 정보 삽입 중 오류 발생:', err);
                            return;
                        }

                        const discountId = discountResult.insertId;

                        // 게임-할인 연결
                        const insertGameDiscountQuery = `
                            INSERT INTO GameDiscount (gameId, discountId)
                            VALUES (?, ?)
                        `;

                        connection.query(insertGameDiscountQuery, [gameId, discountId], (err, linkResult) => {
                            if (err) {
                                console.error('게임-할인 연결 중 오류 발생:', err);
                            } else {
                                console.log(`게임-할인 연결 완료: ${gameName} - 할인율 ${randomDiscountRate}%`);
                            }
                        });
                    });
                } else {
                    console.log(`할인 적용되지 않음: ${gameName}`);
                }
            });

            await delay(1000); // 1초 딜레이
        }

        res.json({ message: '게임과 할인 연결 완료' });
    } catch (error) {
        console.error('게임과 할인 연결 중 오류 발생:', error);
        res.status(500).json({ message: '게임과 할인 연결 중 오류 발생' });
    }
});