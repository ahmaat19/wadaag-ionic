import dynamicAPI from './dynamicAPI'
import { useMutation, useQueryClient } from 'react-query'

const url = '/api/payments'

const queryKey = 'payments'

export default function usePaymentsHook() {
  const queryClient = useQueryClient()

  const postPayment = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return {
    postPayment,
  }
}
