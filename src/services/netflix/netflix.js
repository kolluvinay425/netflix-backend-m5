import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import fs from "fs-extra";
import { writeImagetoPublicFolder } from "../../../utils/image-upload.js";
import multer from "multer";
import { publicFolder } from "../../server.js";
const netflixRouter = express.Router();

const path = join(dirname(fileURLToPath(import.meta.url)), "netflix.json");
const read = () => JSON.parse(fs.readFileSync(path));
const write = (content) => fs.writeFileSync(path, JSON.stringify(content));
console.log("netflix.json path:", path);

//post
netflixRouter.post("/", multer().single("image"), async (req, res, next) => {
  try {
    const { imgUrl } = await writeImagetoPublicFolder(req.file);
    const { title, year, type } = req.body;
    const movieData = {
      imdbId: uniqid(),
      title,
      year,
      type,
      imgUrl,
    };
    const allMovies = await fs.readJSON(path);
    allMovies.push(movieData);
    await fs.writeJSON(path, allMovies);
    res.send(movieData);
  } catch (error) {
    next(error);
  }
});
//get
netflixRouter.get("/", (req, res, next) => {
  try {
    const allMovies = read();
    res.send(allMovies);
  } catch (error) {
    console.log(error);
  }
});
//get/:id
netflixRouter.get("/:id", (req, res, next) => {
  try {
    const allMovies = read();
    const getMovie = allMovies.find((movie) => movie.imdbId === req.params.id);
    if (getMovie) {
      res.send(getMovie);
    }
  } catch (error) {
    console.log(error);
  }
});
//put
netflixRouter.put("/:id", (req, res, next) => {
  try {
    const allMovies = read();
    const filteredMovie = allMovies.filter(
      (movie) => movie.imdbId !== req.params.id
    );
    const updateMovie = {
      ...req.body,
      id: req.params.id,
      updatedAt: new Date(),
    };
    filteredMovie.push(updateMovie);
    write(filteredMovie);
    res.send(updateMovie);
  } catch (error) {}
});
//delete
netflixRouter.delete("/:id", (req, res, next) => {
  try {
    const movies = read();
    const deleteMovie = movies.filter((m) => m.imdbId !== req.params.id);
    write(path, JSON.stringify(deleteMovie));
    res.status(204).send("movie deleted");
  } catch (error) {}
});
export default netflixRouter;
