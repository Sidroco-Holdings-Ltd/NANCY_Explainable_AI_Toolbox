const normalizeFilename = (url) => {
  // Find the position of the last slash to get the start index of the filename
  const startIndex = url.lastIndexOf("/") + 1;
  let endIndex;

  // Determine the end index based on the file extension
  if (url.indexOf(".png") > 0) {
    endIndex = url.indexOf(".png");
  } else if (url.indexOf(".jpeg") > 0) {
    endIndex = url.indexOf(".jpeg");
  } else {
    endIndex = url.indexOf(".jpg");
  }

  if (startIndex !== -1 && endIndex !== -1) {
    // Extract the filename part
    let filename = url.substring(startIndex, endIndex);

    // Replace hyphens and underscores with spaces
    const normalizedFilename = filename.replace(/[_-]/g, " ");
    return normalizedFilename;
  }
  return null;
};

export default normalizeFilename;
