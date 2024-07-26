const normalizeFilename = (url) => {
  const startIndex =
    url.indexOf("/_next/static/media/") + "/_next/static/media/".length;
  let endIndex;

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

    // If there's a dot in the filename, remove everything after the dot
    const dotIndex = filename.indexOf(".");
    if (dotIndex !== -1) {
      filename = filename.substring(0, dotIndex);
    }

    // Replace hyphens and underscores with spaces
    const normalizedFilename = filename.replace(/[_-]/g, " ");
    return normalizedFilename;
  }
  return null;
};
export default normalizeFilename;
