import { AxiosRequestConfig } from 'axios'

export const endpoints = {
  totalReturnsIndexURL:
    'https://www1.nseindia.com/products/dynaContent/equities/indices/total_returnindices.jsp',
}

export const indices = {
  nifty100LowVolatility30: 'NIFTY100 LOW VOLATILITY 30',
}

export const fetchOptions: AxiosRequestConfig = {
  headers: {
    'Host': 'www1.nseindia.com',
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer':
      'https://www1.nseindia.com/products/content/equities/equities/eq_security.htm',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  method: 'GET',
}
