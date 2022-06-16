export const generateBase64FromImage = (imageFile:Blob):Promise<string|ArrayBuffer|null> => {
  const reader = new FileReader();
  const promise:Promise<string|ArrayBuffer|null> = new Promise((resolve, reject) => {
    reader.onload = e => resolve(e.target!.result);
    reader.onerror = err => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};
