import moment from "moment";

export const formatDateWithTime = (date: string | number | Date) => {
  // Ensure date is converted to moment object
  const momentDate = moment.utc(date);

  // Check if momentDate is valid
  if (!momentDate.isValid()) {
    throw new Error("Invalid date format");
  }

  return momentDate.format('YYYY/MM/DD');
};


export const base64ToFile = (base64Data: any, filename: any, mimeType: any) => {
  // Split the base64 string to get the data part
  const base64 = base64Data.split(';base64,').pop();
  
  // Convert to a Blob
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: mimeType });

  // Convert Blob to File
  const file = new File([blob], filename, { type: mimeType });
  return file;
};
