use crate::state::Fanout;
use crate::utils::validation::assert_owned_by;
use anchor_lang::prelude::*;
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct InitializeFanoutArgs {
    pub bump_seed: u8,
    pub native_account_bump_seed: u8,
    pub name: String,
    pub total_shares: u64,
    pub shares: Vec<u64>,
    pub trait_options: Vec<String>,
    pub mint: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: InitializeFanoutArgs)]
pub struct InitializeFanout<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
    init,
    space = 3200,
    seeds = [b"upgrad00r-config", args.name.as_bytes()],
    bump,
    payer = authority
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(
    init,
    space = 1,
    seeds = [b"upgrad00r-native-account", fanout.key().as_ref()],
    bump,
    payer = authority
    )
    ]
    /// CHECK: Native Account
    pub holding_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: mint
    pub mint: UncheckedAccount<'info>,
}
pub fn init(ctx: Context<InitializeFanout>, args: InitializeFanoutArgs) -> Result<()> {
    let fanout = &mut ctx.accounts.fanout;
    fanout.authority = ctx.accounts.authority.to_account_info().key();
    let mint = ctx.accounts.mint.to_account_info();
    assert_owned_by(&mint, &spl_token::id())?;
    fanout.mint = mint.to_account_info().key();
    fanout.account_key = ctx.accounts.holding_account.to_account_info().key();
    fanout.name = args.name;
    fanout.total_shares = args.total_shares;
    fanout.total_available_shares = args.total_shares;
    fanout.bump_seed = args.bump_seed;

    fanout.trait_options = args.trait_options;

    fanout.shares = args.shares;
    Ok(())
}
