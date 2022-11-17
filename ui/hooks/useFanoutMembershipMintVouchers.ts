import { tryPublicKey } from './../common/utils'
import { useFanoutId } from 'hooks/useFanoutId'
import * as remetadat00r from '../generated'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useDataHook } from './useDataHook'
import { AccountData } from '@cardinal/token-manager'

const HYDRA_PROGRAM_ID = new PublicKey(
  'GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM'
)

export const useFanoutMembershipMintVouchers = (
  fanoutMintId?: string | null
) => {
  const { connection } = useEnvironmentCtx()
  const { data: fanoutId } = useFanoutId()

}
