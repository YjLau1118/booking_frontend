import { BACKEND_URL } from "../endpoint";

export const getImageById = async (id: string) => {
  const request = new Request(BACKEND_URL + `/api/bucket/image/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const response = await fetch(request);
  if(response.status === 401 || response.status === 403){
    window.location.href = '/login';
    return;
  }
  if (response.status === 500) {
    throw new Error('Internal server error');
  }
  
  const data = await response.json();
  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data.message.error;
  }
  return data;
}


export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const request = new Request(BACKEND_URL + '/api/bucket/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const response = await fetch(request);
  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  const data = await response.json();
  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw new Error(data.detail);
    }
    throw new Error(data.message);
  }

  return data;
};