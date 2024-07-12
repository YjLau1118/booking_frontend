import { BACKEND_URL } from "../endpoint";

export const getStatisticData = async () => {
  const request = new Request(BACKEND_URL + `/api/statistic/data`, {
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

export const getAllUser = async () => {
  const request = new Request(BACKEND_URL + `/api/users/list`, {
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

export const getAllBooking = async () => {
  const request = new Request(BACKEND_URL + `/api/bookings/allbooking`, {
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

export const getAllProduct = async () => {
  const request = new Request(BACKEND_URL + `/api/cars/list`, {
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