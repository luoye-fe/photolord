import { config, history } from 'ice';
import axios, { AxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { message } from 'antd'; 

const { baseURL } = config;

const AUTH_KEY = 'photolord_auth_key';

interface IResponse {
  code: StatusCodes;
  message: string;
  data: IPlainObject;
}

function gotoLoginPage() {
  message.error('Not Login');

  setTimeout(() => {
    history.push('/login');
  }, 1000);
}

function fetch(options: AxiosRequestConfig): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    const authKey = window.localStorage.getItem(AUTH_KEY);
    if (!authKey) return gotoLoginPage();

    const { url } = options;
    axios({
      ...options,
      ...{
        url: `${baseURL}${url}`,
      },
    })
      .then(res => {
        const { code } = res.data;
        if (code === 403) return gotoLoginPage();

        resolve(res.data);
      })
      .catch(e => reject(e));
  });
}

export default fetch;
