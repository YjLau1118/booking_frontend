import { BACKEND_URL } from "../endpoint";
import { getIdToken } from "./auth";

export const getProductList = async (
  page?: number,
  size?: number,
  sortBy?: string,
  sortOrder?: string,
  filters?: { filterId: string; filterValue: string | null }[],
  searchField?: string,
  searchQuery?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  
  let url = BACKEND_URL + '/api/cars/list';

  const queryParams = [];

  if (page && size) {
    queryParams.push(`page=${page}&size=${size}`);
  }

  if (sortBy && sortOrder) {
    queryParams.push(`sortBy=${sortBy}&sortOrder=${sortOrder}`);
  }

  if (filters && filters.length > 0) {
    if (filters.length === 1) {
      const filter = filters[0];
      queryParams.push(`filters=${filter.filterId}:${filter.filterValue}`);
    } else {
      const filterStr = filters.map((filter) => `${filter.filterId}:${filter.filterValue}`).join(',');
      queryParams.push(`filters=or:${filterStr}`);
    }
  }

  if (searchField && searchQuery) {
    queryParams.push(`searchField=${searchField}&searchQuery=${searchQuery}`);
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    queryParams.push(`minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const request = new Request(url, {
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
      throw new Error(data.detail);
    }
    throw new Error(data.message.error);
  }

  return data;
};

export const getProductDetailsById = async (id: string) => {
  
  const request = new Request(BACKEND_URL + `/api/cars/detail/${id}`, {
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

export const deleteProduct = async (id: string) => {
  const request = new Request(BACKEND_URL + `/api/cars/delete/${id}`, {
    method: 'POST',
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

export const createProduct = async (productName: string, productBrand: string, productModel: string, productPlate: string, productImage: string[], productVariant: string, productSeries: string, productType: string, productSeat: number, productManufacturingYear: number, productMode: string, productFuelType: string, productPricePerDay: number) => {
  const request = new Request(BACKEND_URL + `/api/cars/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      productName: productName,
      productBrand: productBrand,
      productModel: productModel,
      productPlate: productPlate,
      productImage: productImage,
      productVariant: productVariant,
      productSeries: productSeries,
      productType: productType,
      productSeat: productSeat,
      productManufacturingYear: productManufacturingYear,
      productMode: productMode,
      productFuelType: productFuelType,
      productPricePerDay: productPricePerDay,
    })
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


export const updateProduct = async (id: string, productName: string, productBrand: string, productModel: string, productPlate: string, productImage: string[], productVariant: string, productSeries: string, productType: string, productSeat: number, productManufacturingYear: number, productMode: string, productFuelType: string, productPricePerDay: number) => {
  const request = new Request(BACKEND_URL + `/api/cars/update/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      productName: productName,
      productBrand: productBrand,
      productModel: productModel,
      productPlate: productPlate,
      productImage: productImage,
      productVariant: productVariant,
      productSeries: productSeries,
      productType: productType,
      productSeat: productSeat,
      productManufacturingYear: productManufacturingYear,
      productMode: productMode,
      productFuelType: productFuelType,
      productPricePerDay: productPricePerDay,
    })
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