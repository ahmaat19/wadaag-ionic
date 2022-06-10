import { Storage } from '@capacitor/storage'

// Storage API
export const setAuth = async (value) => {
  await Storage.set({
    key: 'auth',
    value: JSON.stringify(value),
  })

  return value
}

export const getAuth = async () => {
  const { value } = await Storage.get({ key: 'auth' })
  const res = JSON.parse(value)
  return res
}
