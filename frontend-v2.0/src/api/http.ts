import { SERVER_ENPOINT } from './server-url'
import axios, { AxiosError } from 'axios'

export const instance = axios.create({
  withCredentials: true,
  baseURL: '/v1/',
});

// if returning AxiosError object, the library will remove
// items by its own consideration. And removes response body!
export class HttpError {
  message: string;
  code: string | undefined;
  responseBody: string | null;

  constructor(src: AxiosError) {
    this.message = src.message;
    this.code = src.code;
    this.responseBody = src.response?.data as any;
  }
}

instance.interceptors.request.use(
  async function (config) {
    //   config.headers['Content-Type'] =
    //     config?.data?.headerContentType || 'application/json';
    //   config.headers.Authorization = `Device ${phoneNumber} ${session}`;
    // handle some header etc
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // if (error.response?.status === ResponseStatus.UNAUTHORIZED) {
      
    // }
    return Promise.reject(new HttpError(error));
  },
);

export const LOCALSTORAGE = {
  USER: 'user',
  CREDENTIALS: 'credentials',
}
export class Http {
  // constructor() { }

  static _getHeader() {
    // const credentails = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS));

    return {
      // Authorization: `Bearer ${credentails?.token || ''}`,
    }
  }
  static get = (endPoint: any, params?: any) => {
    const options = {
      headers: this._getHeader(),
      params: {},
    }
    if (params && Object.keys(params).length) {
      options.params = params
    }
    return instance.get(endPoint, options)
  }
  static post = (endPoint: string, payload: any, params?: any) => {
    const options = {
      params: {},
    }
    if (params && Object.keys(params).length) {
      options.params = params
    }
    return instance.post(endPoint, payload, options)
  }

  static put = (endPoint: string, payload: any) => {
    return instance.put(endPoint, payload, {
      headers: this._getHeader(),
    })
  }

  static patch = (endPoint: string, payload: any) => {
    return instance.patch(endPoint, payload, {
      headers: this._getHeader(),
    })
  }

  static delete = (endPoint: string, id: any) => {
    return instance.delete(endPoint + '/' + id, {
      headers: this._getHeader(),
    })
  }
}
