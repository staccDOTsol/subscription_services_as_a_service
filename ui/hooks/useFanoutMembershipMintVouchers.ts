import { tryPublicKey } from './../common/utils'
import { useFanoutId } from 'hooks/useFanoutId'
import * as remetadat00r from '../generated'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useDataHook } from './useDataHook'
import { AccountData } from '@cardinal/token-manager'
import { FanoutMembershipMintVoucher } from '../generated'

const HYDRA_PROGRAM_ID = new PublicKey(
  '5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW'
)

export const useFanoutMembershipMintVouchers = (
  fanoutMintId?: string | null
) => {
  const { connection } = useEnvironmentCtx()
  const { data: fanoutId } = useFanoutId()
  return useDataHook<AccountData<FanoutMembershipMintVoucher>[]>(
    async () => {
      if (!fanoutId || !fanoutMintId || !tryPublicKey(fanoutMintId)) return
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: utils.bytes.bs58.encode(
                  BorshAccountsCoder.accountDiscriminator(
                    'fanoutMembershipMintVoucher'
                  )
                ),
              },
            },
            {
              memcmp: {
                offset: 8,
                bytes: fanoutId.toBase58(),
              },
            },
            {
              memcmp: {
                offset: 40,
                bytes: tryPublicKey(fanoutMintId)!.toBase58(),
              },
            },
          ],
        }
      )

      return programAccounts.map((account) => {
        return {
          pubkey: account.pubkey,
          parsed: remetadat00r.FanoutMembershipMintVoucher.fromAccountInfo(
            account.account
          )[0],
        }
      })
    },
    [fanoutId?.toString(), fanoutMintId],
    { name: 'useFanoutMembershipMintVouchers' }
  )
}
