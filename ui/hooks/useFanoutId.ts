import { FanoutClient } from '../generated'
import { firstParam } from 'common/utils'
import { useRouter } from 'next/router'
import { useDataHook } from './useDataHook'

export const useFanoutId = () => {
  const { query } = useRouter()
  return useDataHook(
    async () => (await FanoutClient.fanoutKey(firstParam(query.walletId)))[0],
    [query],
    { name: 'useFanoutId' }
  )
}
