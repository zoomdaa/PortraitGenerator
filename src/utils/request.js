import axios from 'axios'

const BASE_HOST = '/api'
const service = axios.create({
  baseURL: BASE_HOST, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
});

export function Get({ url, data = {} }) {
  return new Promise((resolve, reject) => {
    service.get(url, { params: data })
      .then(res => resolve(res.data))
      .catch(reject)
  })
}

