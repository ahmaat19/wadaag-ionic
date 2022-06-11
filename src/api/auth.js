import dynamicAPI from './dynamicAPI'
import { useMutation, useQueryClient } from 'react-query'

const url = '/api/auth'

export default function useAuthHook() {
  const queryClient = useQueryClient()

  const postLogin = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/login`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['login']),
    }
  )

  const postOTP = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/login/otp`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['otp']),
    }
  )

  const postUser = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/users/register`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['register']),
    }
  )

  return {
    postLogin,
    postOTP,
    postUser,
  }
}
