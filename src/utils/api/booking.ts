import { BACKEND_URL } from "../endpoint";

export const createBooking = async(product: string, startDate: Date, endDate: Date, emergencyContact: string) => {
  const request = new Request (BACKEND_URL + '/api/bookings/create', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      product: product,
      startDate: startDate,
      endDate: endDate,
      emergencyContact: emergencyContact
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });

  const response = await fetch(request);
  const data = await response.json();

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw new Error(data.detail);
    }
    throw new Error(data.message);
  }
  return data;
}

export const getBookingById = async (id: string) => {
  const request = new Request(BACKEND_URL + `/api/bookings/details/${id}`, {
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

export const getBookingList = async () => {
  const request = new Request(BACKEND_URL + `/api/bookings/list`, {
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