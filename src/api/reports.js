import dynamicAPI from './dynamicAPI'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const url = '/api/reports/payments'

const queryKey = 'payments'

export default function useReportsHook() {
  const queryClient = useQueryClient()

  const getPaymentTransactions = useQuery(
    queryKey,
    async () => await dynamicAPI('get', `${url}/transactions`, {}),
    { retry: 0 }
  )

  const postPaymentReport = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['payments report']),
    }
  )

  return {
    getPaymentTransactions,
    postPaymentReport,
  }
}
