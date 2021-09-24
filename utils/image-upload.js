import { join, dirname } from "path";
import fs from "fs-extra";

import uniqid from "uniqid";
import { fileURLToPath } from "url";

const publicFolder = join(dirname(fileURLToPath(import.meta.url)), "../public");

console.log("img path", publicFolder);
export const writeImagetoPublicFolder = async (imagefile) => {
  try {
    console.log({ originalname: imagefile.originalname });
    const [name, extension] = imagefile.originalname.split(".");
    console.log(name, extension);
    const id = uniqid();
    const fileName = `${id}.${extension}`;
    console.log(fileName);
    const newpath = join(publicFolder, fileName);
    console.log({ newpath });
    await fs.writeFile(newpath, imagefile.buffer);
    const imgUrl = `http://localhost:3001/${fileName}`;

    return { imgUrl };
  } catch (error) {
    console.log(error);
  }
};
