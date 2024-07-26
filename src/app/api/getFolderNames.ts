import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const getImageFolders = (req: NextApiRequest, res: NextApiResponse) => {
  const imagesDirectory = path.join(process.cwd(), "public/images");

  try {
    const filesAndFolders = fs.readdirSync(imagesDirectory);
    const folders = filesAndFolders.filter((item) => {
      const itemPath = path.join(imagesDirectory, item);
      return fs.lstatSync(itemPath).isDirectory();
    });

    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ error: "Error reading directories" });
  }
};

export default getImageFolders;
