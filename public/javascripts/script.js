function imgError(image, filename) {
  image.onerror = "";
  image.src = `/images/${filename}`;
  return true;
}