/// <reference types="node" />
import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as beet from '@metaplex-foundation/beet';
import { Key } from '../types/Key';
import { EscrowAuthority } from '../types/EscrowAuthority';
export declare type TokenOwnedEscrowArgs = {
    key: Key;
    baseToken: web3.PublicKey;
    authority: EscrowAuthority;
    bump: number;
};
export declare class TokenOwnedEscrow implements TokenOwnedEscrowArgs {
    readonly key: Key;
    readonly baseToken: web3.PublicKey;
    readonly authority: EscrowAuthority;
    readonly bump: number;
    private constructor();
    static fromArgs(args: TokenOwnedEscrowArgs): TokenOwnedEscrow;
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [TokenOwnedEscrow, number];
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey): Promise<TokenOwnedEscrow>;
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        key: any;
        bump: any;
        baseToken: any;
        authority: any;
    }>;
    static deserialize(buf: Buffer, offset?: number): [TokenOwnedEscrow, number];
    serialize(): [Buffer, number];
    static get byteSize(): number;
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    pretty(): {
        key: string;
        baseToken: string;
        authority: string;
        bump: number;
    };
}
export declare const tokenOwnedEscrowBeet: beet.BeetStruct<TokenOwnedEscrow, TokenOwnedEscrowArgs>;
