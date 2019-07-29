import Axios from 'axios'
import { get } from '@/db/config'

/* global HEXAGON_URL */

const defaultBaseUrl = HEXAGON_URL

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

/**
 * @param {string} url
 */
export const resolveUrl = url => axios.defaults.baseURL + url
