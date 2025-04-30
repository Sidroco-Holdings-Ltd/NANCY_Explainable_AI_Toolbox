import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

interface ImageObject {
  name: string;
  path: string;
  width: number;
  height: number;
}

interface ResultObject {
  [key: string]: ImageObject[] | SubfolderObject;
}

interface SubfolderObject {
  [key: string]: ImageObject[];
}

// Function to get images from a specific directory
const getImagesFromDirectory = async (
  dirPath: string,
  baseFolder: string,
  subfolderPath: string,
): Promise<ImageObject[]> => {
  const files = fs.readdirSync(dirPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg"].includes(ext);
  });

  return await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      try {
        const metadata = await sharp(filePath).metadata();
        return {
          name: file,
          path: `/images/${baseFolder}/${subfolderPath}/${file}`,
          width: metadata.width || 0,
          height: metadata.height || 0,
        };
      } catch (error) {
        console.error(`Error processing image ${filePath}:`, error);
        return {
          name: file,
          path: `/images/${baseFolder}/${subfolderPath}/${file}`,
          width: 0,
          height: 0,
        };
      }
    }),
  );
};

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
    } else if (
      subfolders.length > 2 &&
      folderName !== "Semantic_Communications"
    ) {
      // Special case for New_folder - allow more than 2 subfolders
      return NextResponse.json(
        { error: "More than two subfolders found." },
        { status: 400 },
      );
    }

    const result: ResultObject = {};

    for (const subfolder of subfolders) {
      const subfolderPath = path.join(imagesDirectory, subfolder);

      if (folderName === "Semantic_Communications") {
        // Special case for New_folder - check for nested folder structure
        const subSubfolders = fs.readdirSync(subfolderPath).filter((item) => {
          const itemPath = path.join(subfolderPath, item);
          return fs.lstatSync(itemPath).isDirectory();
        });

        if (subSubfolders.length > 0) {
          // If we have sub-subfolders, organize by them
          const subfolderObject: SubfolderObject = {};

          for (const subSubfolder of subSubfolders) {
            const subSubfolderPath = path.join(subfolderPath, subSubfolder);
            const images = await getImagesFromDirectory(
              subSubfolderPath,
              folderName,
              `${subfolder}/${subSubfolder}`,
            );

            if (images.length > 0) {
              subfolderObject[subSubfolder] = images;
            }
          }

          result[subfolder] = subfolderObject;
        } else {
          // No sub-subfolders, just get images directly
          const images = await getImagesFromDirectory(
            subfolderPath,
            folderName,
            subfolder,
          );
          result[subfolder] = images;
        }
      } else {
        // Original behavior for non-New_folder
        const images = await getImagesFromDirectory(
          subfolderPath,
          folderName,
          subfolder,
        );
        result[subfolder] = images;
      }
    }

    // Ensure the result has at least one key for non-New_folder cases
    if (subfolders.length < 2 && folderName !== "Semantic_Communications") {
      result["empty"] = [];
    }

    return NextResponse.json({ answer: result }, { status: 200 });
  } catch (error) {
    console.error("Error in getSubFolderNames:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
