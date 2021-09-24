import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import netflixRouter from "./services/netflix/netflix.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const server = express();

const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());

export const publicFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public"
);
console.log("publicFolder-------->", publicFolder);
server.use(express.static(publicFolder));

server.use("/netflix", netflixRouter);
console.table(listEndpoints(server));
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
