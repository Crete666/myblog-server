const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/boards", (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  var total = 0;
  models.Board.count().then((count) => {
    total = count;
  });
  models.Board.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["title", "createdAt", "id"],
    offset: (page - 1) * limit,
    limit: limit,
  })
    .then((result) => {
      console.log("BOARD : ", result);
      res.send({
        board: result,
        totalCount: total,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("게시글 불러오기 에러 발생");
    });
});

app.post("/insertBoard", (req, res) => {
  const body = req.body;
  const { title, contents } = body;
  if (!title || !contents) {
    res.status(400).send("모든 필드를 입력하세요.");
  }
  models.Board.create({
    title,
    contents,
  })
    .then((result) => {
      console.log("게시글 등록 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("게시글 등록에 문제가 발생했습니다.");
    });
});

app.listen(port, () => {
  console.log("서버 시작");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
