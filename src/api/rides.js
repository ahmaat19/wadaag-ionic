import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/rides'

const queryKey = 'rides'

export default function useRidesHook(props) {
  const queryClient = useQueryClient()

  const updateRide = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const deleteRide = useMutation(
    async ({ id, status }) =>
      await dynamicAPI('delete', `${url}/${id}?status=${status}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries('rides-pending'),
    }
  )

  const getPendingRider = useQuery(
    'rides-pending',
    async () => await dynamicAPI('get', `${url}/pending`, {}),
    { retry: 3 }
  )

  const postRide = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const postNearRiders = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/near-riders`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['near riders']),
    }
  )

  return {
    getPendingRider,
    updateRide,
    deleteRide,
    postRide,
    postNearRiders,
  }
}
