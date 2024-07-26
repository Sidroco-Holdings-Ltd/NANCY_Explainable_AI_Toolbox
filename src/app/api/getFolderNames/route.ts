import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(res: NextResponse) {
  const imagesDirectory = path.join(process.cwd(), "public/images");

  try {
    const filesAndFolders = fs.readdirSync(imagesDirectory);
    const folders = filesAndFolders.filter((item) => {
      const itemPath = path.join(imagesDirectory, item);
      return fs.lstatSync(itemPath).isDirectory();
    });

    return NextResponse.json({ answer: folders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
