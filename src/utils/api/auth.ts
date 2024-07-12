import store from '../../store';
import {BACKEND_URL} from '../endpoint';

export const signIn = async(email: string, password: string) => {
  const request = new Request (BACKEND_URL + '/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      email: email,
      password: password
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
  console.log(data);
  return data;
}

export const signUp = async(username: string, email: string, password: string, phone: string) => {
  const request = new Request (BACKEND_URL + '/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      phone: phone
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
  console.log(data);
  return data;
}

export const forgetPassword = async(email: string) => {
  const request = new Request (BACKEND_URL + '/api/auth/forgetPwd', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      email: email,
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
  console.log(data);
  return data;
}

export const verifyPin = async(email: string, pin: string) => {
  const request = new Request (BACKEND_URL + '/api/auth/verify', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      email: email,
      pin: pin
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
  console.log(data);
  return data;
}

export const resetPassword = async(email: string, password: string) => {
  const request = new Request (BACKEND_URL + '/api/auth/reset', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      email: email,
      password: password
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
  console.log(data);
  return data;
}

export const getIdToken = async () => {
  const request = new Request(BACKEND_URL + '/api/auth/refresh', {
    method: 'GET',
    credentials: 'include',
    
    headers: {
      'Content-type': 'application/json',
    },
  });
  const response = await fetch(request);
  if (response.status === 500) {
    throw new Error('internal server error');
  }
  const data = await response.json();
  if (response.status === 401 || response.status === 403) {
      window.location.href = '/login';
      return;
    }
  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data.message.error;
  }
  return data.accessToken;
};

export const signout = async() => {
  const request = new Request (BACKEND_URL + '/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
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
  console.log(data);
  return data;
}