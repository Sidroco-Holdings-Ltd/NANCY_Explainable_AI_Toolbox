import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

interface ImageObject {
  name: string;
  path: string;
  width: number;
  height: number;
}

interface ResultObject {
  [key: string]: ImageObject[];
}

export async function GET(req: NextRequest) {
  const regex = /\/api\/getSubFolderNames\/([^\/]+)/;
  const match = req.url.match(regex);

  if (!match) {
    return NextResponse.json({ error: "No match found." }, { status: 400 });
  }

  const folderName = match[1]; // Extract folder name from the URL
  const imagesDirectory = path.join(
    process.cwd(),
    `public/images/${folderName}`,
  );

  try {
    const filesAndFolders = fs.readdirSync(imagesDirectory);
    const subfolders = filesAndFolders.filter((item) => {
      const itemPath = path.join(imagesDirectory, item);
      return fs.lstatSync(itemPath).isDirectory();
    });

    if (subfolders.length === 0) {
      return NextResponse.json(
        { error: "No subfolders found." },
        { status: 404 },
      );
    } else if (subfolders.length > 2) {
      return NextResponse.json(
        { error: "More than two subfolders found." },
        { status: 400 },
      );
    }

    const result: ResultObject = {};

    for (const subfolder of subfolders) {
      const subfolderPath = path.join(imagesDirectory, subfolder);
      const files = fs.readdirSync(subfolderPath).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".png", ".jpg", ".jpeg"].includes(ext);
      });

      const images: ImageObject[] = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(subfolderPath, file);
          const metadata = await sharp(filePath).metadata();
          return {
            name: file,
            path: `/images/${folderName}/${subfolder}/${file}`,
            width: metadata.width || 0,
            height: metadata.height || 0,
          };
        }),
      );

      result[subfolder] = images;
    }

    // Ensure the result has two keys
    if (subfolders.length < 2) {
      result["empty"] = [];
    }

    return NextResponse.json({ answer: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
