use crate::state::{Fanout, FanoutMembershipVoucher};
use crate::utils::validation::{assert_owned_by, assert_owned_by_one};
use anchor_lang::prelude::*;
use anchor_spl::token::Token;
pub const FANOUT_MEMBERSHIP_VOUCHER_SIZE: usize = 32 + 8 + 8 + 1 + 32 + 8 + 64;

#[derive(Accounts)]
#[instruction()]
pub struct AddMemberWallet<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Checked in program
    pub member: UncheckedAccount<'info>,
    #[account(
    mut,
    seeds = [b"fanout-config", fanout.name.as_bytes()],
    has_one = authority,
    bump = fanout.bump_seed,
    )]
    pub fanout: Account<'info, Fanout>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

pub fn add_member_wallet(ctx: Context<AddMemberWallet>) -> Result<()> {
    let fanout = &mut ctx.accounts.fanout;
    let member = &ctx.accounts.member;

    assert_owned_by(&fanout.to_account_info(), &crate::ID)?;
    assert_owned_by_one(&member.to_account_info(), vec![&System::id(), &crate::id()])?;
    fanout.total_available_shares = 0;
    Ok(())
}
