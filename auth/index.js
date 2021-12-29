import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = "09f26e402586e2faa8da4c98a35f1b20d6b033c60";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myDb",
});

const app = express();

app.use(express.json());

app.post("/login", (req, response) => {
  console.log(req.body);

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT * FROM auth WHERE (username = '${req.body.username}' AND password = '${req.body.password}')`,
      (err, res) => {
        if (res && res.length) {
          const token = generateAccessToken({
            username: req.body.username,
          });
          response.json({ msg: "User Authinticated", token, res });

          return;
        }
        console.log("error: ", err);
        response.json({ error: "not found" });
      }
    );
  });
});

app.post("/verify", (req, response) => {

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT * FROM auth WHERE (username = '${req.body.username}' AND password = '${req.body.password}')`,
      (err, res) => {
        if (res && res.length) {
          const token = generateAccessToken({
            username: req.body.username,
          });
          response.json({ msg: "User Authinticated", token, res });

          return;
        }
        console.log("error: ", err);
        response.json({ error: "not found" });
      }
    );
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

function generateAccessToken(username) {
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: "1800s" });
}

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => {
  console.log(`Hi from auth service!!`);
});
