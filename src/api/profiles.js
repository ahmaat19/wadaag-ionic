import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/auth'

const queryKey = 'profiles'

export default function useProfilesHook() {
  // const { page = 1, q = '', limit = 25 } = props

  const queryClient = useQueryClient()

  const getProfile = useQuery(
    queryKey,
    async () => await dynamicAPI('get', `${url}/profile`, {}),
    { retry: 3 }
  )

  const postProfile = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/profile`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return {
    getProfile,
    postProfile,
  }
}
