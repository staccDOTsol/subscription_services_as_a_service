// @ts-nocheck
import { BorshAccountsCoder, AnchorProvider } from '@project-serum/anchor'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { COption } from '@metaplex-foundation/beet'

import {
  AccountInfo,
  Connection,
  Finality,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js'
import {
  createProcessAddMemberWalletInstruction,
  createProcessInitInstruction,
  createProcessSignMetadataInstruction,createProcessSubmitUriInstruction
} from './instructions'
import { Fanout } from './accounts'
import {
  BigInstructionResult,
  InstructionResult,
  sendMultipleInstructions,
} from '@strata-foundation/spl-utils'
import bs58 from 'bs58'

export * from './types'
// @ts-ignore
export * from './accounts'
export * from './errors'
/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import {
  UpdateArgs,
  InitializeFanoutArgs,
  Creator,
  SignMetadata,
} from './types'

export interface TransactionResult {
  RpcResponseAndContext: RpcResponseAndContext<SignatureResult>
  TransactionSignature: TransactionSignature
}

export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>

  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>

  publicKey: PublicKey
}

function promiseLog(c: any): any {
  console.info(c)
  return c
}

export class FanoutClient {
  connection: Connection
  wallet: Wallet
  provider: AnchorProvider

  static ID = new PublicKey('FTzBpXFpVYbhaaUhXyw2cHZrSYeMTfidybroFKocacZF')

  static async init(
    connection: Connection,
    wallet: Wallet
  ): Promise<FanoutClient> {
    return new FanoutClient(connection, wallet)
  }

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection
    this.wallet = wallet
    this.provider = new AnchorProvider(connection, wallet, {})
  }


  async fetch<T>(key: PublicKey, type: any): Promise<T> {
    let a = await this.connection.getAccountInfo(key)
    return type.fromAccountInfo(a)[0] as T
  }

  async getAccountInfo(key: PublicKey): Promise<AccountInfo<Buffer>> {
    let a = await this.connection.getAccountInfo(key)
    if (!a) {
      throw Error('Account not found')
    }
    return a
  }

  async getMembers({ fanout }: { fanout: PublicKey }): Promise<PublicKey[]> {
    const name = 'fanoutMembershipVoucher'
    const descriminator = BorshAccountsCoder.accountDiscriminator(name)
    const filters = [
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.concat([descriminator, fanout.toBuffer()])),
        },
      },
    ]
    const members = await this.connection.getProgramAccounts(FanoutClient.ID, {
      // Get the membership key
      dataSlice: {
        length: 32,
        offset: 8 + 32 + 8 + 8 + 1,
      },
      filters,
    })

    return members.map((mem) => new PublicKey(mem.account.data))
  }

  async executeBig<Output>(
    command: Promise<BigInstructionResult<Output>>,
    payer: PublicKey = this.wallet.publicKey,
    finality?: Finality
  ): Promise<Output> {
    const { instructions, signers, output } = await command
    if (instructions.length > 0) {
      await sendMultipleInstructions(
        new Map(),
        // @ts-ignore
        this.provider,
        instructions,
        signers,
        payer || this.wallet.publicKey,
        finality
      )
    }
    return output
  }

  async sendInstructions(
    instructions: TransactionInstruction[],
    signers: Signer[],
    payer?: PublicKey
  ): Promise<TransactionResult> {
    let tx = new Transaction()
    tx.feePayer = payer || this.wallet.publicKey
    tx.add(...instructions)
    tx.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash
    if (signers?.length > 0) {
      await tx.sign(...signers)
    } else {
      tx = await this.wallet.signTransaction(tx)
    }
    try {
      const sig = await this.connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: true,
      })
      return {
        RpcResponseAndContext: await this.connection.confirmTransaction(
          sig,
          this.connection.commitment
        ),
        TransactionSignature: sig,
      }
    } catch (e) {
      // @ts-ignore
      return e
    }
  }

  private async throwingSend(
    instructions: TransactionInstruction[],
    signers: Signer[],
    payer?: PublicKey
  ): Promise<TransactionResult> {
    let res = await this.sendInstructions(
      instructions,
      signers,
      payer || this.wallet.publicKey
    )
    if (res.RpcResponseAndContext.value.err != null) {
      console.log(
        await this.connection.getConfirmedTransaction(res.TransactionSignature)
      )
      throw new Error(JSON.stringify(res.RpcResponseAndContext.value.err))
    }
    return res
  }

  static async fanoutKey(
    name: String,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from('fanout-config'), Buffer.from(name)],
      programId
    )
  }

  static async fanoutForMintKey(
    fanout: PublicKey,
    mint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from('fanout-config'), fanout.toBuffer(), mint.toBuffer()],
      programId
    )
  }

  static async membershipVoucher(
    fanout: PublicKey,
    membershipKey: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('fanout-membership'),
        fanout.toBuffer(),
        membershipKey.toBuffer(),
      ],
      programId
    )
  }

  static async mintMembershipVoucher(
    fanoutForMintConfig: PublicKey,
    membershipKey: PublicKey,
    fanoutMint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('fanout-membership'),
        fanoutForMintConfig.toBuffer(),
        membershipKey.toBuffer(),
        fanoutMint.toBuffer(),
      ],
      programId
    )
  }

  static async freezeAuthority(
    mint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from('freeze-authority'), mint.toBuffer()],
      programId
    )
  }
  static async newUriAcccount(
    fanoutAccountKey: PublicKey,
    wallet: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from('fanout-new-uri'), fanoutAccountKey.toBuffer(), wallet.toBuffer()],
      programId
    )
  }

  static async nativeAccount(
    fanoutAccountKey: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from('fanout-native-account'), fanoutAccountKey.toBuffer()],
      programId
    )
  }

  async initializeFanoutInstructions(
    opts: InitializeFanoutArgs,
    mint: PublicKey
  ): Promise<
    InstructionResult<{ fanout: PublicKey; nativeAccount: PublicKey }>
  > {
    console.log(1)
    const [fanoutConfig, fanoutConfigBumpSeed] = await FanoutClient.fanoutKey(
      opts.name
    )
    console.log(2)
    const [holdingAccount, holdingAccountBumpSeed] =
      await FanoutClient.nativeAccount(fanoutConfig)
    console.log(3)
    const instructions: TransactionInstruction[] = []
    const signers: Signer[] = []
    let membershipMint = NATIVE_MINT

    instructions.push(
      createProcessInitInstruction(
        {
          authority: this.wallet.publicKey,
          holdingAccount: holdingAccount,
          fanout: fanoutConfig,
          mint,
        },
        {
          args: {
            mint,
            bumpSeed: fanoutConfigBumpSeed,
            nativeAccountBumpSeed: holdingAccountBumpSeed,
            totalShares: opts.totalShares,
            name: opts.name,
          },
        }
      )
    )
    return {
      output: {
        fanout: fanoutConfig,
        nativeAccount: holdingAccount,
      },
      instructions,
      signers,
    }
  }
  /*
  async initializeFanoutForMintInstructions(
    opts: InitializeFanoutForMintArgs
  ): Promise<
    InstructionResult<{ fanoutForMint: PublicKey; tokenAccount: PublicKey }>
  > {
    const [fanoutMintConfig, fanoutConfigBumpSeed] =
      await FanoutClient.fanoutForMintKey(opts.fanout, opts.mint);
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let tokenAccountForMint =
      opts.mintTokenAccount ||
      (await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        opts.mint,
        opts.fanout,
        true
      ));
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        opts.mint,
        tokenAccountForMint,
        opts.fanout,
        this.wallet.publicKey
      )
    );
    instructions.push(
      createProcessInitForMintInstruction(
        {
          authority: this.wallet.publicKey,
          mintHoldingAccount: tokenAccountForMint,
          fanout: opts.fanout,
          mint: opts.mint,
          fanoutForMint: fanoutMintConfig,
        },
        {
          bumpSeed: fanoutConfigBumpSeed,
        }
      )
    );

    return {
      output: {
        tokenAccount: tokenAccountForMint,
        fanoutForMint: fanoutMintConfig,
      },
      instructions,
      signers,
    };
  }
  */

  async addMemberWalletInstructions(
    fanout: PublicKey,
    membershipKey: PublicKey
  ): Promise<InstructionResult<{ membershipAccount: PublicKey }>> {
    console.log(fanout)
    const instructions: TransactionInstruction[] = []
    const signers: Signer[] = []

    instructions.push(
      createProcessAddMemberWalletInstruction(
        // @ts-ignore
        {
          authority: this.wallet.publicKey,
          fanout: fanout,
          member: membershipKey,
        }
      )
    )

    return {
      output: { membershipAccount: fanout },
      instructions,
      signers,
    }
  }
  /*

  async addMemberNftInstructions(
    opts: AddMemberArgs
  ): Promise<InstructionResult<{ membershipAccount: PublicKey }>> {
    const [membershipAccount, _vb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.membershipKey
    );
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    const [metadata, _md] = await PublicKey.findProgramAddress(
      [Buffer.from(MPL_TM_PREFIX), MPL_TM_BUF, opts.membershipKey.toBuffer()],
      MetadataProgram.PUBKEY
    );
    instructions.push(
      createProcessAddMemberNftInstruction(
        {
          authority: this.wallet.publicKey,
          fanout: opts.fanout,
          membershipAccount,
          mint: opts.membershipKey,
          metadata,
        },
        {
          args: {
            shares: opts.shares,
          },
        }
      )
    );

    return {
      output: {
        membershipAccount,
      },
      instructions,
      signers,
    };
  }

  async unstakeTokenMemberInstructions(opts: UnstakeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      membershipMintTokenAccount: PublicKey;
      stakeAccount: PublicKey;
    }>
  > {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let mint = opts.membershipMint;
    if (!mint) {
      let data = await this.fetch<Fanout>(opts.fanout, Fanout);
      mint = data.membershipMint as PublicKey;
    }
    const [voucher, _vbump] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.member
    );
    const stakeAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      voucher,
      true
    );
    const membershipMintTokenAccount =
      opts.membershipMintTokenAccount ||
      (await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        opts.member,
        true
      ));
    instructions.push(
      createProcessUnstakeInstruction({
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        fanout: opts.fanout,
        member: opts.member,
        memberStakeAccount: stakeAccount,
        membershipVoucher: voucher,
        membershipMint: mint,
        membershipMintTokenAccount: membershipMintTokenAccount,
      })
    );
    return {
      output: {
        membershipVoucher: voucher,
        membershipMintTokenAccount,
        stakeAccount,
      },
      instructions,
      signers,
    };
  }

  async stakeForTokenMemberInstructions(opts: StakeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      membershipMintTokenAccount: PublicKey;
      stakeAccount: PublicKey;
    }>
  > {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let mint = opts.membershipMint;
    let auth = opts.fanoutAuthority;
    if (!mint || !auth) {
      let data = await this.fetch<Fanout>(opts.fanout, Fanout);
      mint = data.membershipMint as PublicKey;
      auth = data.authority as PublicKey;
    }
    const [voucher, _vbump] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.member
    );
    const stakeAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      voucher,
      true
    );
    const membershipMintTokenAccount =
      opts.membershipMintTokenAccount ||
      (await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        auth,
        true
      ));
    try {
      await this.connection.getTokenAccountBalance(stakeAccount);
    } catch (e) {
      instructions.push(
        await Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          stakeAccount,
          voucher,
          opts.payer
        )
      );
    }
    try {
      await this.connection.getTokenAccountBalance(membershipMintTokenAccount);
    } catch (e) {
      throw new Error(
        "Membership mint token account for authority must be initialized"
      );
    }
    instructions.push(
      createProcessSetForTokenMemberStakeInstruction(
        {
          fanout: opts.fanout,
          authority: auth,
          member: opts.member,
          memberStakeAccount: stakeAccount,
          membershipVoucher: voucher,
          membershipMint: mint,
          membershipMintTokenAccount: membershipMintTokenAccount,
        },
        {
          shares: opts.shares,
        }
      )
    );
    return {
      output: {
        membershipVoucher: voucher,
        membershipMintTokenAccount,
        stakeAccount,
      },
      instructions,
      signers,
    };
  }

  async stakeTokenMemberInstructions(opts: StakeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      membershipMintTokenAccount: PublicKey;
      stakeAccount: PublicKey;
    }>
  > {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let mint = opts.membershipMint;
    if (!mint) {
      let data = await this.fetch<Fanout>(opts.fanout, Fanout);
      mint = data.membershipMint as PublicKey;
    }
    const [voucher, _vbump] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.member
    );
    const stakeAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      voucher,
      true
    );
    const membershipMintTokenAccount =
      opts.membershipMintTokenAccount ||
      (await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        opts.member,
        true
      ));
    try {
      await this.connection.getTokenAccountBalance(stakeAccount);
    } catch (e) {
      instructions.push(
        await Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          stakeAccount,
          voucher,
          opts.payer
        )
      );
    }
    try {
      await this.connection.getTokenAccountBalance(membershipMintTokenAccount);
    } catch (e) {
      throw new Error(
        "Membership mint token account for member must be initialized"
      );
    }
    instructions.push(
      createProcessSetTokenMemberStakeInstruction(
        {
          fanout: opts.fanout,
          member: opts.member,
          memberStakeAccount: stakeAccount,
          membershipVoucher: voucher,
          membershipMint: mint,
          membershipMintTokenAccount: membershipMintTokenAccount,
        },
        {
          shares: opts.shares,
        }
      )
    );
    return {
      output: {
        membershipVoucher: voucher,
        membershipMintTokenAccount,
        stakeAccount,
      },
      instructions,
      signers,
    };
  }
*/
  async signMetadataInstructions(
    opts: SignMetadata,
    args: UpdateArgs
  ): Promise<InstructionResult<{}>> {
    const authority = opts.authority
    const fanoutObj = await this.fetch<Fanout>(opts.fanout, Fanout)
    const holdingAccount = fanoutObj.accountKey as PublicKey

    const instructions: TransactionInstruction[] = []
    const signers: Signer[] = []
    const newUri = web3.Keypair.generate()

    instructions.push(
      createProcessSignMetadataInstruction(
        {
          newUri: opts.newUri,
          nft: opts.nft,
          ata: opts.ata,
          jare: new PublicKey('JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm'),
          // @ts-ignore
          mint: opts.mint,
          sourceAccount: opts.sourceAccount,
          tokenAccount: opts.tokenAccount,
          tokenAccount2: opts.tokenAccount2,
          fanout: opts.fanout,
          authority: authority as PublicKey,
          holdingAccount: holdingAccount,
          metadata: opts.metadata,
          tokenMetadataProgram: opts.tokenMetadataProgram,
          tokenProgram: opts.tokenProgram,
        },
        {
          args,
        }
      )
    )
    return {
      output: {},
      instructions,
      signers,
    }
  }
  /*
  async distributeTokenMemberInstructions(
    opts: DistributeTokenMemberArgs
  ): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      fanoutForMintMembershipVoucher?: PublicKey;
      holdingAccount: PublicKey;
    }>
  > {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let fanoutMint = opts.fanoutMint || NATIVE_MINT;
    let holdingAccount;
    let [fanoutForMint, fanoutForMintBump] =
      await FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);
    let fanoutMintMemberTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      fanoutMint,
      opts.member,
      true
    );
    let [
      fanoutForMintMembershipVoucher,
      fanoutForMintMembershipVoucherBumpSeed,
    ] = await FanoutClient.mintMembershipVoucher(
      fanoutForMint,
      opts.member,
      fanoutMint
    );

    if (opts.distributeForMint) {
      holdingAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        fanoutMint,
        opts.fanout,
        true
      );
      try {
        await this.connection.getTokenAccountBalance(
          fanoutMintMemberTokenAccount
        );
      } catch (e) {
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            fanoutMint,
            fanoutMintMemberTokenAccount,
            opts.member,
            opts.payer
          )
        );
      }
    } else {
      const [nativeAccount, _nativeAccountBump] =
        await FanoutClient.nativeAccount(opts.fanout);
      holdingAccount = nativeAccount;
    }
    const [membershipVoucher, membershipVoucherBump] =
      await FanoutClient.membershipVoucher(opts.fanout, opts.member);
    const stakeAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      opts.membershipMint,
      membershipVoucher,
      true
    );
    const membershipMintTokenAccount =
      opts.membershipMintTokenAccount ||
      (await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        opts.membershipMint,
        opts.member,
        true
      ));
    try {
      await this.connection.getTokenAccountBalance(stakeAccount);
    } catch (e) {
      instructions.push(
        await Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          opts.membershipMint,
          stakeAccount,
          membershipVoucher,
          opts.payer
        )
      );
    }
    instructions.push(
      createProcessDistributeTokenInstruction(
        {
          memberStakeAccount: stakeAccount,
          membershipMint: opts.membershipMint,
          fanoutForMint: fanoutForMint,
          fanoutMint: fanoutMint,
          membershipVoucher: membershipVoucher,
          fanoutForMintMembershipVoucher,
          holdingAccount,
          membershipMintTokenAccount: membershipMintTokenAccount,
          fanoutMintMemberTokenAccount,
          payer: opts.payer,
          member: opts.member,
          fanout: opts.fanout,
        },
        {
          distributeForMint: opts.distributeForMint,
        }
      )
    );

    return {
      output: {
        membershipVoucher,
        fanoutForMintMembershipVoucher,
        holdingAccount,
      },
      instructions,
      signers,
    };
  }

  async distributeAllInstructions({
    fanout,
    mint,
    payer,
  }: DistributeAllArgs): Promise<BigInstructionResult<null>> {
    const fanoutAcct = await Fanout.fromAccountAddress(this.connection, fanout);
    const members = await this.getMembers({ fanout });

    const instructions = await Promise.all(
      members.map(async (member) => {
        switch (fanoutAcct.membershipModel) {
          case MembershipModel.Token:
            return this.distributeTokenMemberInstructions({
              distributeForMint: !mint.equals(NATIVE_MINT),
              membershipMint: fanoutAcct.membershipMint!,
              fanout,
              member,
              fanoutMint: mint,
              payer: payer,
            });
          case MembershipModel.Wallet:
            return this.distributeWalletMemberInstructions({
              distributeForMint: !mint.equals(NATIVE_MINT),
              member,
              fanout,
              fanoutMint: mint,
              payer: payer,
            });
          case MembershipModel.NFT:
            const account = (
              await this.connection.getTokenLargestAccounts(member)
            ).value[0].address;
            const wallet = (await getTokenAccount(this.provider, account))
              .owner;
            return this.distributeNftMemberInstructions({
              distributeForMint: !mint.equals(NATIVE_MINT),
              fanout,
              fanoutMint: mint,
              membershipKey: member,
              member: wallet,
              payer: payer,
            });
        }
      })
    );

    // 3 at a time
    const grouped: InstructionResult<any>[][] = chunks(instructions, 3);

    return {
      instructions: grouped.map((i) => i.map((o) => o.instructions).flat()),
      signers: grouped.map((i) => i.map((o) => o.signers).flat()),
      output: null,
    };
  }

  async distributeAll(opts: DistributeAllArgs): Promise<null> {
    return this.executeBig(this.distributeAllInstructions(opts), opts.payer);
  }

  async distributeNftMemberInstructions(opts: DistributeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      fanoutForMintMembershipVoucher?: PublicKey;
      holdingAccount: PublicKey;
    }>
  > {
    if (!opts.membershipKey) {
      throw new Error("No membership key");
    }
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let fanoutMint = opts.fanoutMint || NATIVE_MINT;
    let holdingAccount;
    let [fanoutForMint, fanoutForMintBump] =
      await FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);

    let [
      fanoutForMintMembershipVoucher,
      fanoutForMintMembershipVoucherBumpSeed,
    ] = await FanoutClient.mintMembershipVoucher(
      fanoutForMint,
      opts.membershipKey,
      fanoutMint
    );
    let fanoutMintMemberTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      fanoutMint,
      opts.member,
      true
    );
    if (opts.distributeForMint) {
      holdingAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        fanoutMint,
        opts.fanout,
        true
      );
      try {
        await this.connection.getTokenAccountBalance(
          fanoutMintMemberTokenAccount
        );
      } catch (e) {
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            fanoutMint,
            fanoutMintMemberTokenAccount,
            opts.member,
            opts.payer
          )
        );
      }
    } else {
      const [nativeAccount, _nativeAccountBump] =
        await FanoutClient.nativeAccount(opts.fanout);
      holdingAccount = nativeAccount;
    }
    const membershipKeyTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      opts.membershipKey,
      opts.member,
      true
    );
    const [membershipVoucher, membershipVoucherBump] =
      await FanoutClient.membershipVoucher(opts.fanout, opts.membershipKey);
    instructions.push(
      createProcessDistributeNftInstruction(
        {
          fanoutForMint: fanoutForMint,
          fanoutMint: fanoutMint,
          membershipKey: opts.membershipKey,
          membershipVoucher: membershipVoucher,
          fanoutForMintMembershipVoucher,
          holdingAccount,
          membershipMintTokenAccount: membershipKeyTokenAccount,
          fanoutMintMemberTokenAccount,
          payer: opts.payer,
          member: opts.member,
          fanout: opts.fanout,
        },
        {
          distributeForMint: opts.distributeForMint,
        }
      )
    );

    return {
      output: {
        membershipVoucher,
        fanoutForMintMembershipVoucher,
        holdingAccount,
      },
      instructions,
      signers,
    };
  }

  async distributeWalletMemberInstructions(opts: DistributeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      fanoutForMintMembershipVoucher?: PublicKey;
      holdingAccount: PublicKey;
    }>
  > {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let fanoutMint = opts.fanoutMint || NATIVE_MINT;
    let holdingAccount;
    let [fanoutForMint, fanoutForMintBump] =
      await FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);
    let [
      fanoutForMintMembershipVoucher,
      fanoutForMintMembershipVoucherBumpSeed,
    ] = await FanoutClient.mintMembershipVoucher(
      fanoutForMint,
      opts.member,
      fanoutMint
    );
    let fanoutMintMemberTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      fanoutMint,
      opts.member,
      true
    );
    if (opts.distributeForMint) {
      holdingAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        fanoutMint,
        opts.fanout,
        true
      );
      try {
        await this.connection.getTokenAccountBalance(
          fanoutMintMemberTokenAccount
        );
      } catch (e) {
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            fanoutMint,
            fanoutMintMemberTokenAccount,
            opts.member,
            opts.payer
          )
        );
      }
    } else {
      const [nativeAccount, _nativeAccountBump] =
        await FanoutClient.nativeAccount(opts.fanout);
      holdingAccount = nativeAccount;
    }
    const [membershipVoucher, membershipVoucherBump] =
      await FanoutClient.membershipVoucher(opts.fanout, opts.member);
    instructions.push(
      createProcessDistributeWalletInstruction(
        {
          fanoutForMint: fanoutForMint,
          fanoutMint: fanoutMint,
          membershipVoucher: membershipVoucher,
          fanoutForMintMembershipVoucher,
          holdingAccount,
          fanoutMintMemberTokenAccount,
          payer: opts.payer,
          member: opts.member,
          fanout: opts.fanout,
        },
        {
          distributeForMint: opts.distributeForMint,
        }
      )
    );

    return {
      output: {
        membershipVoucher,
        fanoutForMintMembershipVoucher,
        holdingAccount,
      },
      instructions,
      signers,
    };
  }

  async transferSharesInstructions(
    opts: TransferSharesArgs
  ): Promise<InstructionResult<{}>> {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let [fromMembershipAccount, f_mvb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.fromMember
    );
    let [toMembershipAccount, tmvb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.toMember
    );
    instructions.push(
      createProcessTransferSharesInstruction(
        {
          fromMember: opts.fromMember,
          toMember: opts.toMember,
          authority: this.wallet.publicKey,
          fanout: opts.fanout,
          fromMembershipAccount,
          toMembershipAccount,
        },
        {
          shares: opts.shares,
        }
      )
    );
    return {
      output: {},
      instructions,
      signers,
    };
  }

  async removeMemberInstructions(
    opts: RemoveMemberArgs
  ): Promise<InstructionResult<{}>> {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let [voucher, f_mvb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.member
    );

    instructions.push(
      createProcessRemoveMemberInstruction({
        fanout: opts.fanout,
        member: opts.member,
        membershipAccount: voucher,
        authority: this.wallet.publicKey,
        destination: opts.destination,
      })
    );
    return {
      output: {},
      instructions,
      signers,
    };
  }

  async initializeFanout(
    opts: InitializeFanoutArgs
  ): Promise<{ fanout: PublicKey; nativeAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.initializeFanoutInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async initializeFanoutForMint(
    opts: InitializeFanoutForMintArgs
  ): Promise<{ fanoutForMint: PublicKey; tokenAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.initializeFanoutForMintInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async addMemberNft(
    opts: AddMemberArgs
  ): Promise<{ membershipAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.addMemberNftInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }
  */

  async addMemberWallet(
    fanout: PublicKey,
    membershipKey: PublicKey
  ): Promise<{ membershipAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.addMemberWalletInstructions(fanout, membershipKey)
    await this.throwingSend(instructions, signers, this.wallet.publicKey)
    return output
  }
  /*
  async stakeTokenMember(opts: StakeMemberArgs) {
    const { instructions, signers, output } =
      await this.stakeTokenMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async stakeForTokenMember(opts: StakeMemberArgs) {
    const { instructions, signers, output } =
      await this.stakeForTokenMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }
*/
  async signMetadata(opts: SignMetadata, args: UpdateArgs) {
    const { instructions, signers, output } =
      await this.signMetadataInstructions(opts, args)
    await this.throwingSend(instructions, signers, this.wallet.publicKey)
    return output
  }
  /*
  async removeMember(opts: RemoveMemberArgs) {
    let {
      instructions: remove_ix,
      signers: remove_signers,
      output,
    } = await this.removeMemberInstructions(opts);
    await this.throwingSend(
      [...remove_ix],
      [...remove_signers],
      this.wallet.publicKey
    );
    return output;
  }

  async transferShares(opts: TransferSharesArgs) {
    let data = await this.fetch<Fanout>(opts.fanout, Fanout);
    const {
      instructions: transfer_ix,
      signers: transfer_signers,
      output,
    } = await this.transferSharesInstructions(opts);
    if (
      data.membershipModel != MembershipModel.Wallet &&
      data.membershipModel != MembershipModel.NFT
    ) {
      throw Error("Transfer is only supported in NFT and Wallet fanouts");
    }
    await this.throwingSend(
      [...transfer_ix],
      [...transfer_signers],
      this.wallet.publicKey
    );
    return output;
  }

  async unstakeTokenMember(opts: UnstakeMemberArgs) {
    let { fanout, member, membershipMint, payer } = opts;
    if (!membershipMint) {
      let data = await this.fetch<Fanout>(opts.fanout, Fanout);
      membershipMint = data.membershipMint as PublicKey;
    }
    const {
      instructions: unstake_ix,
      signers: unstake_signers,
      output,
    } = await this.unstakeTokenMemberInstructions(opts);
    const { instructions: dist_ix, signers: dist_signers } =
      await this.distributeTokenMemberInstructions({
        distributeForMint: false,
        fanout,
        member,
        membershipMint,
        payer,
      });
    await this.throwingSend(
      [...dist_ix, ...unstake_ix],
      [...unstake_signers, ...dist_signers],
      this.wallet.publicKey
    );
    return output;
  }

  async distributeNft(opts: DistributeMemberArgs): Promise<{
    membershipVoucher: PublicKey;
    fanoutForMintMembershipVoucher?: PublicKey;
    holdingAccount: PublicKey;
  }> {
    const { instructions, signers, output } =
      await this.distributeNftMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async distributeWallet(opts: DistributeMemberArgs): Promise<{
    membershipVoucher: PublicKey;
    fanoutForMintMembershipVoucher?: PublicKey;
    holdingAccount: PublicKey;
  }> {
    const { instructions, signers, output } =
      await this.distributeWalletMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async distributeToken(opts: DistributeTokenMemberArgs): Promise<{
    membershipVoucher: PublicKey;
    fanoutForMintMembershipVoucher?: PublicKey;
    holdingAccount: PublicKey;
  }> {
    const { instructions, signers, output } =
      await this.distributeTokenMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  } */
}
