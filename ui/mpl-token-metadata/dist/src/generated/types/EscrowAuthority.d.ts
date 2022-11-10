import * as beet from '@metaplex-foundation/beet';
export declare enum EscrowAuthority {
    TokenOwner = 0,
    Creator = 1
}
export declare const escrowAuthorityBeet: beet.FixedSizeBeet<EscrowAuthority, EscrowAuthority>;
