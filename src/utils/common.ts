import moment from "moment";

export const formatDateWithTime = (date: string | number | Date) => {  const momentDate = moment.utc(date);

  if (!momentDate.isValid()) {
    throw new Error("Invalid date format");
  }

  return momentDate.format('YYYY/MM/DD');
};


export const base64ToFile = (base64Data: any, filename: any, mimeType: any) => {
  const base64 = base64Data.split(';base64,').pop();
  
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

  const file = new File([blob], filename, { type: mimeType });
  return file;
};
