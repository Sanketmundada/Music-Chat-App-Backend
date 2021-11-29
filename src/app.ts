import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";

import { configureWebSockets } from "./socket";
import { authHandler } from "./routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authHandler);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "Welcome to server 🚀🚀 !!!" });
});

const server = http.createServer(app);

configureWebSockets(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
