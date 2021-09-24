import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import netflixRouter from "./services/netflix/netflix.js";

const server = express();

const port = 3001;
server.use(cors());
server.use(express.json());

server.use("/netflix", netflixRouter);
console.table(listEndpoints(server));
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
