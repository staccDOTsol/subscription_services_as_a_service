import { useFanoutId } from 'hooks/useFanoutId'
import * as remetadat00r from '../generated'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useDataHook } from './useDataHook'
import { AccountData } from '@cardinal/token-manager'
import { FanoutMembershipVoucher } from '../generated'

const HYDRA_PROGRAM_ID = new PublicKey(
  'GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM'
)

export const useFanoutMembershipVouchers = () => {
  const { connection } = useEnvironmentCtx()
  const { data: fanoutId } = useFanoutId()
  return useDataHook<AccountData<FanoutMembershipVoucher>[]>(
    async () => {
      if (!fanoutId) return
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: utils.bytes.bs58.encode(
                  BorshAccountsCoder.accountDiscriminator(
                    'fanoutMembershipVoucher'
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
          ],
        }
      )
      return programAccounts
        .map((account) => {
          return {
            pubkey: account.pubkey,
            parsed: remetadat00r.FanoutMembershipVoucher.fromAccountInfo(
              account.account
            )[0],
          }
        })
        .sort((a, b) =>
          parseInt(a.parsed.shares.toString()) ===
          parseInt(b.parsed.shares.toString())
            ? a.parsed.membershipKey
                .toString()
                .localeCompare(b.parsed.membershipKey.toString())
            : parseInt(b.parsed.shares.toString()) -
              parseInt(a.parsed.shares.toString())
        )
    },
    [fanoutId?.toString()],
    { name: 'useFanoutMembershipVoucher' }
  )
}
