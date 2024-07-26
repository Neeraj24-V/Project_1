import express, { Request, Response } from "express";
import config from "./config/default";
import connect from "./utils/connectDB";
import v1 from "./routes_v1";
import validateToken from "./middlewares/validateTokens";
import cookieParser = require("cookie-parser");

// connect to database
connect((err: any) => {
  try {
    if (!err) {
      app.listen(config.server.port, (): void => {
        console.log(
          `The server started at http://localhost:${config.server.port}`
        );
      });
    }
  } catch (err: any) {
    console.log({
      err: err.message,
      message: "Connection to the MONGO_DB Failed!!!",
    });
  }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(validateToken);

app.use("/api", v1);

app.get("/", (req: Request, res: Response): void => {
  res.send(`<h1>Welcome to the server.</h1>`);
});

app.get("/healthcheck", (req: Request, res: Response): void => {
  res.status(200).send(`<h1>Server health is Good.</h1>`);
});
