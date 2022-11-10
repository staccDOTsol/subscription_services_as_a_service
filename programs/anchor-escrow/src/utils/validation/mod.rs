use crate::error::UpdateMetadataError;
use crate::state::Fanout;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program_memory::sol_memcmp;
use anchor_lang::solana_program::pubkey::PUBKEY_BYTES;
use anchor_spl::token::TokenAccount;
pub fn cmp_pubkeys(a: &Pubkey, b: &Pubkey) -> bool {
    sol_memcmp(a.as_ref(), b.as_ref(), PUBKEY_BYTES) == 0
}

pub fn assert_derivation(
    program_id: &Pubkey,
    account: &AccountInfo,
    path: &[&[u8]],
    error: Option<error::Error>,
) -> Result<u8> {
    let (key, bump) = Pubkey::find_program_address(path, program_id);
    if !cmp_pubkeys(&key, account.key) {
        if let Some(err) = error {
            msg!("Derivation {:?}", err);
            return Err(err);
        }
        msg!("DerivedKeyInvalid");
        return Err(UpdateMetadataError::DerivedKeyInvalid.into());
    }
    Ok(bump)
}

pub fn assert_owned_by(account: &AccountInfo, owner: &Pubkey) -> Result<()> {
    if !cmp_pubkeys(account.owner, owner) {
        Err(UpdateMetadataError::IncorrectOwner.into())
    } else {
        Ok(())
    }
}

pub fn assert_ata(
    account: &AccountInfo,
    target: &Pubkey,
    mint: &Pubkey,
    err: Option<error::Error>,
) -> Result<u8> {
    assert_derivation(
        &anchor_spl::associated_token::ID,
        &account.to_account_info(),
        &[
            target.as_ref(),
            anchor_spl::token::ID.as_ref(),
            mint.as_ref(),
        ],
        err,
    )
}

pub fn assert_shares_distributed(fanout: &Account<Fanout>) -> Result<()> {
    if fanout.total_available_shares != 0 {
        return Err(UpdateMetadataError::SharesArentAtMax.into());
    }
    Ok(())
}

pub fn assert_holding(
    owner: &AccountInfo,
    token_account: &Account<TokenAccount>,
    mint_info: &AccountInfo,
) -> Result<()> {
    assert_owned_by(mint_info, &spl_token::id())?;
    let token_account_info = token_account.to_account_info();
    assert_owned_by(&token_account_info, &spl_token::id())?;
    if !cmp_pubkeys(&token_account.owner, owner.key) {
        return Err(UpdateMetadataError::IncorrectOwner.into());
    }
    if token_account.amount < 1 {
        return Err(UpdateMetadataError::WalletDoesNotOwnMembershipToken.into());
    }
    if !cmp_pubkeys(&token_account.mint, &mint_info.key()) {
        return Err(UpdateMetadataError::MintDoesNotMatch.into());
    }
    Ok(())
}

pub fn assert_owned_by_one(account: &AccountInfo, owners: Vec<&Pubkey>) -> Result<()> {
    for o in owners {
        let res = assert_owned_by(account, o);
        if res.is_ok() {
            return res;
        }
    }
    Err(UpdateMetadataError::IncorrectOwner.into())
}

#[cfg(test)]
mod tests {
    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn test_multi_owner_check() {
        let owner = Pubkey::new_unique();
        let owner1 = Pubkey::new_unique();
        let owner2 = Pubkey::new_unique();
        let ad = Pubkey::new_unique();
        let actual_owner = Pubkey::new_unique();
        let lam = &mut 10000;
        let a = AccountInfo::new(&ad, false, false, lam, &mut [0; 0], &actual_owner, false, 0);

        let e = assert_owned_by_one(&a, vec![&owner, &owner2, &owner1]);

        assert!(e.is_err());

        let e = assert_owned_by_one(&a, vec![&owner, &actual_owner, &owner1]);

        assert!(e.is_ok());
    }
}
