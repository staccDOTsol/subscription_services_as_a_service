import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
export declare class CreateMasterEditionArgs extends Borsh.Data<{
    maxSupply: BN | null;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    maxSupply: BN | null;
}
export declare type CreateMasterEditionParams = {
    edition: PublicKey;
    metadata: PublicKey;
    updateAuthority: PublicKey;
    mint: PublicKey;
    mintAuthority: PublicKey;
    maxSupply?: BN;
};
export declare class CreateMasterEdition extends Transaction {
    constructor(options: TransactionCtorFields, params: CreateMasterEditionParams);
}
