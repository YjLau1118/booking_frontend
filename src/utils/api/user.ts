import { BACKEND_URL } from "../endpoint";

export const getUserDetailsById = async (id: string) => {
  
  const request = new Request(BACKEND_URL + `/api/users/details/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const response = await fetch(request);
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