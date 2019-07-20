import Axios from 'axios'
import { get } from '@/db/config'

const defaultBaseUrl = 'http://localhost:3000/api'

export const axios = Axios.create({ baseURL: defaultBaseUrl })

export const syncBaseUrl = async () => {
  const baseurl = await get('base-url')
  axios.defaults.baseURL = baseurl || defaultBaseUrl
}

export const syncAccessToken = async () => {
  const token = await get('x-access-token')
  if (token) {
    axios.defaults.headers['x-access-token'] = token
  } else {
    delete axios.defaults.headers['x-access-token']
  }
}
