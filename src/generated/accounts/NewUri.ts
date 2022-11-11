/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * Arguments used to create {@link NewUri}
 * @category Accounts
 * @category generated
 */
export type NewUriArgs = {
  authority: web3.PublicKey
  fanout: web3.PublicKey
  uri: string
  bump: number
}

export const newUriDiscriminator = [248, 239, 67, 80, 202, 227, 246, 75]
/**
 * Holds the data for the {@link NewUri} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class NewUri implements NewUriArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly fanout: web3.PublicKey,
    readonly uri: string,
    readonly bump: number
  ) {}

  /**
   * Creates a {@link NewUri} instance from the provided args.
   */
  static fromArgs(args: NewUriArgs) {
    return new NewUri(args.authority, args.fanout, args.uri, args.bump)
  }

  /**
   * Deserializes the {@link NewUri} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [NewUri, number] {
    return NewUri.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link NewUri} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<NewUri> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find NewUri account at ${address}`)
    }
    return NewUri.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      '5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, newUriBeet)
  }

  /**
   * Deserializes the {@link NewUri} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [NewUri, number] {
    return newUriBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link NewUri} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return newUriBeet.serialize({
      accountDiscriminator: newUriDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link NewUri} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: NewUriArgs) {
    const instance = NewUri.fromArgs(args)
    return newUriBeet.toFixedFromValue({
      accountDiscriminator: newUriDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link NewUri} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: NewUriArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      NewUri.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link NewUri} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      authority: this.authority.toBase58(),
      fanout: this.fanout.toBase58(),
      uri: this.uri,
      bump: this.bump,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const newUriBeet = new beet.FixableBeetStruct<
  NewUri,
  NewUriArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['fanout', beetSolana.publicKey],
    ['uri', beet.utf8String],
    ['bump', beet.u8],
  ],
  NewUri.fromArgs,
  'NewUri'
)