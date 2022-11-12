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
import * as splToken from '@solana/spl-token'
import { shortPubKey } from 'common/utils'

export const HYDRA_PROGRAM_ID = new PublicKey(
  '84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx'
)

export type FanoutMintData = {
  id: PublicKey
  balance: number
  info: splToken.MintInfo
  config: PaymentMintConfig
}

export const useFanoutMints = () => {
  const { connection } = useEnvironmentCtx()
  const { data: fanoutId } = useFanoutId()

}
