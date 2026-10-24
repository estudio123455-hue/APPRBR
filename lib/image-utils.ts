/**
 * Comprime y redimensiona una imagen (desde cámara móvil o archivo local)
 * a un Data URL JPEG ligero (~40-80 KB) apto para persistencia en localStorage.
 */
export function compressImageFile(
  file: File,
  maxWidth = 640,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Formato de imagen inválido."));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo decodificar la imagen."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
