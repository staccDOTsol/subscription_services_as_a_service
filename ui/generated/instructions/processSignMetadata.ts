/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { UpdateArgs, updateArgsBeet } from '../types/UpdateArgs'

/**
 * @category Instructions
 * @category ProcessSignMetadata
 * @category generated
 */
export type ProcessSignMetadataInstructionArgs = {
  args: UpdateArgs
}
/**
 * @category Instructions
 * @category ProcessSignMetadata
 * @category generated
 */
export const processSignMetadataStruct = new beet.FixableBeetArgsStruct<
  ProcessSignMetadataInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['args', updateArgsBeet],
  ],
  'ProcessSignMetadataInstructionArgs'
)
/**
 * Accounts required by the _processSignMetadata_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] fanout
 * @property [] holdingAccount
 * @property [_writable_] sourceAccount
 * @property [_writable_] tokenAccount
 * @property [_writable_] tokenAccount2
 * @property [] newUri
 * @property [_writable_] metadata
 * @property [] tokenMetadataProgram
 * @property [] mint
 * @property [] jare
 * @property [] ata
 * @property [] nft
 * @category Instructions
 * @category ProcessSignMetadata
 * @category generated
 */
export type ProcessSignMetadataInstructionAccounts = {
  authority: web3.PublicKey
  fanout: web3.PublicKey
  holdingAccount: web3.PublicKey
  sourceAccount: web3.PublicKey
  tokenAccount: web3.PublicKey
  tokenAccount2: web3.PublicKey
  newUri: web3.PublicKey
  metadata: web3.PublicKey
  tokenProgram?: web3.PublicKey
  tokenMetadataProgram: web3.PublicKey
  mint: web3.PublicKey
  jare: web3.PublicKey
  ata: web3.PublicKey
  nft: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const processSignMetadataInstructionDiscriminator = [
  188, 67, 163, 49, 0, 150, 63, 89,
]

/**
 * Creates a _ProcessSignMetadata_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessSignMetadata
 * @category generated
 */
export function createProcessSignMetadataInstruction(
  accounts: ProcessSignMetadataInstructionAccounts,
  args: ProcessSignMetadataInstructionArgs,
  programId = new web3.PublicKey('5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW')
) {
  const [data] = processSignMetadataStruct.serialize({
    instructionDiscriminator: processSignMetadataInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.fanout,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.holdingAccount,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.sourceAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenAccount2,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.newUri,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.jare,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.ata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.nft,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
