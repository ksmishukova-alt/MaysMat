const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1600;

export function validateDailyUploadFile(file: File): string | null {
  if (file.size > MAX_FILE_BYTES) {
    return "Файл слишком большой (максимум 8 МБ)";
  }
  return null;
}

/** Сжимает фото перед отправкой; остальные типы — как есть */
export async function prepareDailyUploadFile(file: File): Promise<{
  fileName: string;
  mimeType: string;
  dataUrl: string;
}> {
  const err = validateDailyUploadFile(file);
  if (err) throw new Error(err);

  if (file.type.startsWith("image/")) {
    return compressImageFile(file);
  }

  const dataUrl = await readFileAsDataUrl(file);
  return { fileName: file.name, mimeType: file.type || "application/octet-stream", dataUrl };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function compressImageFile(file: File): Promise<{
  fileName: string;
  mimeType: string;
  dataUrl: string;
}> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { fileName: file.name, mimeType: file.type, dataUrl };
  }
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = "image/jpeg";
  const compressed = canvas.toDataURL(mimeType, 0.82);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return { fileName: `${baseName}.jpg`, mimeType, dataUrl: compressed };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Не удалось обработать изображение"));
    img.src = src;
  });
}
