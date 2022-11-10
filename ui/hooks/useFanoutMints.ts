import {
  PaymentMintConfig,
  paymentMintConfig,
} from './../config/paymentMintConfig'
import { useFanoutId } from 'hooks/useFanoutId'
import * as remetadat00r from '../generated'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useDataHook } from './useDataHook'
import { FanoutMint } from '../generated'
import * as splToken from '@solana/spl-token'
import { shortPubKey } from 'common/utils'

export const HYDRA_PROGRAM_ID = new PublicKey(
  '5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW'
)

export type FanoutMintData = {
  id: PublicKey
  data: FanoutMint
  balance: number
  info: splToken.MintInfo
  config: PaymentMintConfig
}

export const useFanoutMints = () => {
  const { connection } = useEnvironmentCtx()
  const { data: fanoutId } = useFanoutId()
  return useDataHook<FanoutMintData[]>(
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
                  BorshAccountsCoder.accountDiscriminator('fanoutMint')
                ),
              },
            },
            {
              memcmp: {
                offset: 40,
                bytes: fanoutId.toBase58(),
              },
            },
          ],
        }
      )
      const fanoutMints = await Promise.all(
        programAccounts.map(async (account) => {
          const fanoutMintData = remetadat00r.FanoutMint.fromAccountInfo(
            account.account
          )[0]
          const mintAddress = fanoutMintData.mint
          return {
            id: account.pubkey,
            data: fanoutMintData,
            balance: parseFloat(
              (
                await connection.getTokenAccountBalance(
                  fanoutMintData.tokenAccount
                )
              ).value.uiAmountString ?? '0'
            ),
            info: await new splToken.Token(
              connection,
              mintAddress,
              splToken.TOKEN_PROGRAM_ID,
              // @ts-ignore
              null
            ).getMintInfo(),
            config: paymentMintConfig[fanoutMintData.mint.toString()] ?? {
              name: shortPubKey(mintAddress),
              symbol: shortPubKey(mintAddress),
            },
          }
        })
      )
      return fanoutMints
    },
    [fanoutId?.toString()],
    { name: 'useFanoutMints' }
  )
}
