import { Storage } from '@capacitor/storage'

// Storage API
export const setAuth = async (value) => {
  // const value = {
  //   _id: 1,
  //   name: 'Ahmed Ibrahim',
  //   avatar: 'https://github.com/ahmaat19.png',
  // }
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
