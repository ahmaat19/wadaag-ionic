import { Storage } from '@capacitor/storage'
import axios from 'axios'
import { defaultUrl } from '../config/url'

const dynamicAPI = async (method, url, obj = {}) => {
  const domain = `${defaultUrl}${url}`

  const config = async () => {
    const { value } = await Storage.get({ key: 'auth' })
    return JSON.parse(value)
  }
  config().then((value) => {
    if (value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${value.token}`
    }
  })

  try {
    // eslint-disable-next-line default-case
    switch (method) {
      case 'get':
        return await axios.get(domain).then((res) => res.data)

      case 'post':
        return await axios.post(domain, obj).then((res) => res.data)

      case 'put':
        return await axios.put(domain, obj).then((res) => res.data)

      case 'delete':
        return await axios.delete(domain).then((res) => res.data)
    }
  } catch (error) {
    throw error.response.data.error
  }
}

export default dynamicAPI
