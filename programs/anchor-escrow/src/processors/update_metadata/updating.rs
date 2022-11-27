
use std::io::Cursor;
use std::io::Write;
use mpl_token_metadata::instruction::create_metadata_accounts_v2;
use crate::error::UpdateMetadataError;
use crate::processors::update_metadata::arg::UpdateArgs;
use crate::processors::update_metadata::arg::NewUriArgs;

use crate::state::Fanout;
use crate::state::NewUri;
use crate::utils::validation::assert_ata;
use crate::utils::validation::assert_owned_by;
use anchor_lang::prelude::*;
use mpl_token_metadata::instruction::create_master_edition_v3;
use mpl_token_metadata::{
    instruction::update_metadata_accounts,
    state::{Collection,
Metadata,
TokenMetadataAccount,
MAX_NAME_LENGTH,


MAX_SYMBOL_LENGTH,
MAX_URI_LENGTH 
    }};

use anchor_spl::token::{Mint, TokenAccount};
use spl_token::solana_program::program::invoke_signed;

pub fn puff_out_data_fields(metadata: &mut UpdateArgs) {
    metadata.name = puffed_out_string(&metadata.name, MAX_NAME_LENGTH);
    metadata.symbol = puffed_out_string(&metadata.symbol, MAX_SYMBOL_LENGTH);
    metadata.uri = puffed_out_string(&metadata.uri, MAX_URI_LENGTH);
}

/// Pads the string to the desired size with `0u8`s.
/// NOTE: it is assumed that the string's size is never larger than the given size.
pub fn puffed_out_string(s: &str, size: usize) -> String {
    let mut array_of_zeroes = vec![];
    let puff_amount = size - s.len();
    while array_of_zeroes.len() < puff_amount {
        array_of_zeroes.push(0u8);
    }
    s.to_owned() + std::str::from_utf8(&array_of_zeroes).unwrap()
}

#[derive(AnchorSerialize, AnchorDeserialize, Accounts)]
pub struct SubmitUri<'info> {
    #[account(mut, address = Pubkey::new_from_array( [
        255,   0, 198, 221,  91, 179,  95, 217,
        235, 252, 230, 235, 184, 236,  83,  33,
        125,  83,  29, 240, 249,  54, 193,  84,
        181, 105, 175, 234,  16, 224,  11, 206
      ]))]
    /// CHECK: Checked in Program
    pub authority: Signer<'info>,
    #[account(
    seeds = [b"FUS00r-config", fanout.name.as_bytes()],
    bump
    )]
    pub fanout: Account<'info, Fanout>,

    /// CHECK: it's  wallet
    pub wallet: UncheckedAccount<'info>,
    #[account(
    init_if_needed,
    space = 160,
    seeds = [b"FUS00r-new-uri", fanout.key().as_ref(), wallet.key().as_ref()],
    bump,
    payer = authority
    )
    ]
    pub new_uri: Account<'info, NewUri>,
    pub system_program: Program<'info, System>,
    pub rent_key: Sysvar<'info, Rent>,

}


pub fn submit_uri(ctx: Context<SubmitUri>, args: NewUriArgs) -> Result<()> {
    
        let wallet = &ctx.accounts.wallet;
        let fanout = &ctx.accounts.fanout;
        let new_uri: &mut Account<NewUri> = &mut ctx.accounts.new_uri;

        new_uri.bump = args.bump;
        new_uri.uri = args.uri;
        new_uri.authority = wallet.key();
        new_uri.fanout = fanout.key();
    Ok(())

}

#[derive(AnchorSerialize, AnchorDeserialize, Accounts)]
pub struct DrainEmAll<'info> {
    #[account(mut,  address=Pubkey::new_from_array([
        255,   0, 198, 221,  91, 179,  95, 217,
        235, 252, 230, 235, 184, 236,  83,  33,
        125,  83,  29, 240, 249,  54, 193,  84,
        181, 105, 175, 234,  16, 224,  11, 206
      ]))]
      
    /// CHECK: Checked in Program
    pub authority: Signer<'info>,
        #[account(mut,
            seeds = [b"FUS00r-new-uri", fanout.key().as_ref(), user.key().as_ref()],
            bump 
        )]
    pub new_uri: Account<'info, NewUri>,
        #[account(
            seeds = [b"FUS00r-config", fanout.name.as_bytes()],
            bump
        )]
    pub fanout: Account<'info, Fanout>,
    /// CHECK: hes an innocent bystander
    pub user: UncheckedAccount<'info>

}


pub fn drain_em_all(ctx: Context<DrainEmAll>) -> Result<()> {
    let info = ctx.accounts.new_uri.to_account_info();
    if info.lamports() != 0 {
        **ctx.accounts.authority.to_account_info().try_borrow_mut_lamports()? +=
        **ctx.accounts.new_uri.to_account_info().try_borrow_lamports()?;
        **ctx.accounts.new_uri.to_account_info().try_borrow_mut_lamports()? = 0;

        let mut data = info.try_borrow_mut_data()?;
        for byte in data.iter_mut() {
            *byte = 0;
        }

        let dst: &mut [u8] = &mut data;
        let mut cursor = Cursor::new(dst);
        cursor.write_all(&[138])
            .map_err(|_| error!(ErrorCode::AccountDidNotSerialize))
            .unwrap();
    }
    
    Ok(())
}
#[derive(AnchorSerialize, AnchorDeserialize, Accounts)]
pub struct SignMetadata<'info> {
    #[account(mut)]
    /// CHECK: Checked in Program
    pub authority: Signer<'info>,
    #[account(mut,
    seeds = [b"FUS00r-config", fanout.name.as_bytes()],
    bump 
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(
    constraint = fanout.account_key == holding_account.key(),
    seeds = [b"FUS00r-native-account", fanout.key().as_ref()],
    bump 
    )]
    /// CHECK: Checked in Program
    pub holding_account: UncheckedAccount<'info>,
    /// SPL token account containing the token of the sale to be canceled.
    #[account(mut)]
    pub source_account: Box<Account<'info, TokenAccount>>,
    /// SPL token account containing the token of the sale to be canceled.
    #[account(mut)]
    pub source_burn1: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub source_burn2: Box<Account<'info, TokenAccount>>,
    /// SPL token account containing the token of the sale to be canceled.
    #[account(mut)]
    pub token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub token_account2: Box<Account<'info, TokenAccount>>,
    #[account(constraint = fanout.key() == new_uri.fanout,
    constraint = authority.key() == new_uri.authority,
        seeds = [b"FUS00r-new-uri", fanout.key().as_ref(), authority.key().as_ref()],
        bump )
        ]
        pub new_uri: Account<'info, NewUri>,
        #[account(mut)]

    /// CHECK: Checked in Program
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: Checked in Program
    pub token_program: UncheckedAccount<'info>,

    #[account(address=mpl_token_metadata::id())]
    /// CHECK: Checked in Program
    pub token_metadata_program: UncheckedAccount<'info>,
    #[account(constraint = fanout.mint == mint.key())]
    pub mint: Box<Account<'info, Mint>>,

    #[account(mut, address=Pubkey::new_from_array([
        255,   0, 198, 221,  91, 179,  95, 217,
        235, 252, 230, 235, 184, 236,  83,  33,
        125,  83,  29, 240, 249,  54, 193,  84,
        181, 105, 175, 234,  16, 224,  11, 206
      ]))]
    /// CHECK: Checked in Program
    pub jare: Signer<'info>,
    #[account(mut)]
    /// CHECK: Checked in Program
    pub metadata_new_mint_authority: UncheckedAccount<'info>,

    
    #[account(mut)]
    /// CHECK: check
    pub new_metadata_key: UncheckedAccount<'info>,
    /// CHECK: Checked in Program
    pub ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    /// CHECK: Checked in Program
    pub nft: Box<Account<'info, Mint>>,
    #[account(mut)]
    /// CHECK: Checked in Program
    pub mint_burn2: Box<Account<'info, Mint>>,
    #[account(mut)]
    /// CHECK: Checked in Program
    pub metadata_new_mint: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: Checked in Program
    pub metadata_new_edition: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    
}


pub fn sign_metadata(ctx: Context<SignMetadata>, args: UpdateArgs) -> Result<()> {
    let metadata = &ctx.accounts.metadata.to_account_info();
    let holding_account = &ctx.accounts.holding_account.to_account_info();
    let fanout = &mut ctx.accounts.fanout;

    let authority_info = &ctx.accounts.authority.to_account_info();
    let source_info = &ctx.accounts.source_account.to_account_info();
    let token_account_info = &ctx.accounts.token_account.to_account_info();
    let token_account_info2 = &ctx.accounts.token_account2.to_account_info();
    let token_program_id = &ctx.accounts.token_program.to_account_info();
    let jare_info = &ctx.accounts.jare.to_account_info();
    let md = Metadata::from_account_info(metadata)?;
    
    let mut mut_args = args;

    assert_ata(
        &ctx.accounts.ata.to_account_info(),
        &authority_info.key(),
        &ctx.accounts.nft.key(),
        Some(UpdateMetadataError::IncorrectOwner.into()),
    )?;
    msg!("1");
    assert_ata(
        &token_account_info,
        &fanout.authority,
        &ctx.accounts.mint.key(),
        Some(UpdateMetadataError::IncorrectOwner.into()),
    )?;

    msg!("3");
    assert_owned_by(&metadata, &mpl_token_metadata::id())?;
    msg!("4");
    let mut counter = 0;
    let mut mine: u64 = 1;
    let mut yours: u64 = 0;
    for to in fanout.trait_options.iter() {
        let val: u64 = fanout.shares[counter].try_into().unwrap();
        msg!(
            "[{}] - {:?} = {}",
            counter, to, val
        );
        counter = counter + 1;
        if to == &mut_args.to && val == mut_args.val {
            msg!("winner winner chickum dinner");
            fanout.minted = fanout.minted.checked_add(1)
            .ok_or(UpdateMetadataError::NumericalOverflow)? as u64;
            let perc = val
                .checked_div(10000)
                .ok_or(UpdateMetadataError::NumericalOverflow)? as u64;
            yours = perc
            .checked_mul(fanout.minted)
            .ok_or(UpdateMetadataError::NumericalOverflow)?
                .checked_mul(9862)
                .ok_or(UpdateMetadataError::NumericalOverflow)? as u64;
             mine = perc
             .checked_mul(fanout.minted)
             .ok_or(UpdateMetadataError::NumericalOverflow)?
                .checked_mul(138)
                .ok_or(UpdateMetadataError::NumericalOverflow)? as u64;
      break;
    
             }
        }
        msg!("8");
    let new_uri = &ctx.accounts.new_uri;
    msg!("9");
    if new_uri.uri != mut_args.uri {
        return Err(UpdateMetadataError::InvalidMetadata.into());

    }
    msg!("10");

    let mut owned_string: String = "https://".to_owned();
    let borrowed_string: String = mut_args.uri.to_owned();
    let another_owned_string: String = ".ipfs.dweb.link?ext=json".to_owned();
    
    owned_string.push_str(&borrowed_string);
    owned_string.push_str(&another_owned_string);

    puff_out_data_fields(&mut mut_args);
    msg!("11");

    spl_token_transfer(TokenTransferParams {
        source: source_info.clone(),
        destination: token_account_info.clone(),
        amount: yours,
        authority: authority_info.clone(),
        authority_signer_seeds: &[],
        token_program: token_program_id.clone(),
    })?;
    msg!("12");

    spl_token_transfer(TokenTransferParams {
        source: source_info.clone(),
        destination: token_account_info2.clone(),
        amount: mine,
        authority: authority_info.clone(),
        authority_signer_seeds: &[],
        token_program: token_program_id.clone(),
    })?;
    msg!("13");

    let master_edition_infos = vec![
        ctx.accounts.metadata_new_edition.to_account_info(),
        ctx.accounts.metadata_new_mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.rent.to_account_info(),
        ctx.accounts.new_metadata_key.to_account_info(),
        ctx.accounts.authority.to_account_info(),
    ];

    let metadata_infos = [
        ctx.accounts.token_metadata_program.to_account_info().clone(),
        ctx.accounts.new_metadata_key.to_account_info().clone(),
        ctx.accounts.metadata_new_mint.to_account_info().clone(),
        ctx.accounts.metadata_new_mint_authority.to_account_info().clone(),
        ctx.accounts.authority.to_account_info().clone(),
        ctx.accounts.holding_account.to_account_info().clone(),
        ctx.accounts.system_program.to_account_info(),

        ctx.accounts.rent.to_account_info().clone(),
    ];
    msg!("15");
    let creators: Vec<mpl_token_metadata::state::Creator> =
        vec![mpl_token_metadata::state::Creator {
            address: ctx.accounts.jare.key(),
            verified: false,
            share: 50,
        },
        mpl_token_metadata::state::Creator {
            address: ctx.accounts.authority.key(),
            verified: true,
            share: 50,
        }];

        msg!("16");

    invoke_signed(
        &create_metadata_accounts_v2(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.new_metadata_key.key(),
            ctx.accounts.metadata_new_mint.key(),
            ctx.accounts.metadata_new_mint_authority.key(),
            ctx.accounts.authority.key(),
            ctx.accounts.jare.key(),
            md.data.name,
             md.data.symbol,
             owned_string,
             Some(creators),
             138,
            true,
            true,
            Some(Collection {verified:
                true, 
                key:
                Pubkey::new_from_array(  [
                    12,  85,  96,   8,  94, 242,  20, 151,
                    67, 206,  37, 233, 160,   3,  57, 165,
                   179, 182, 252, 120, 187, 198, 238, 173,
                    96,  44, 117, 135, 202,  33, 202, 106
                 ]) }),
            None,
        ),
        metadata_infos.as_slice(),
        &[&[
            "FUS00r-native-account".as_bytes(),
            ctx.accounts.fanout.key().as_ref(),
            &[*ctx.bumps.get("holding_account").unwrap()],
        ]],
    )?;
    msg!("16");

    
    invoke_signed(
        &create_master_edition_v3(
            mpl_token_metadata::id(),
            ctx.accounts.metadata_new_edition.key(),
            ctx.accounts.metadata_new_mint.key(),
            ctx.accounts.jare.key(),
            ctx.accounts.authority.key(),
            ctx.accounts.new_metadata_key.key(),
            ctx.accounts.authority.key(),
            Some(0),
        ),
        master_edition_infos.as_slice(),
        &[&[
            "FUS00r-native-account".as_bytes(),
            ctx.accounts.fanout.key().as_ref(),
            &[*ctx.bumps.get("holding_account").unwrap()],
        ]],
    )?;
    msg!("14");

    msg!("17");
    invoke_signed(
        &spl_token::instruction::burn(
            &ctx.accounts.token_program.key(),
            &ctx.accounts.source_burn1.key(),
            &ctx.accounts.nft.key(),
            &ctx.accounts.authority.key(),
            &[],
            1,
        )?,
        &[ctx.accounts.source_burn1.to_account_info(),
         ctx.accounts.nft.to_account_info(),
          ctx.accounts.authority.to_account_info(), 
          ctx.accounts.token_program.to_account_info()],
          &[&[
            "FUS00r-native-account".as_bytes(),
            ctx.accounts.fanout.key().as_ref(),
            &[*ctx.bumps.get("holding_account").unwrap()],
        ]],
    )?;
    msg!("18");
    invoke_signed(
        &spl_token::instruction::burn(
            &ctx.accounts.token_program.key(),
            &ctx.accounts.source_burn2.key(),
            &ctx.accounts.mint_burn2.key(),
            &ctx.accounts.authority.key(),
            &[],
            1,
        )?,
        &[ctx.accounts.source_burn2.to_account_info(),
         ctx.accounts.mint_burn2.to_account_info(),
          ctx.accounts.authority.to_account_info(), 
          ctx.accounts.token_program.to_account_info()],
          &[&[
            "FUS00r-native-account".as_bytes(),
            ctx.accounts.fanout.key().as_ref(),
            &[*ctx.bumps.get("holding_account").unwrap()],
        ]],
    )

    .map_err(|e| {
        error::Error::ProgramError(ProgramErrorWithOrigin {
            program_error: e,
            error_origin: None,
            compared_values: None,
        })
    })?;
    msg!("14");
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Accounts)]
pub struct PassUaBack<'info> {
    #[account(mut,
        constraint = fanout.authority == authority.key(),
)]
    /// CHECK: Checked in Program
    pub authority: Signer<'info>,
    #[account(
    seeds = [b"FUS00r-config", fanout.name.as_bytes()],
    bump
    )]
    pub fanout: Account<'info, Fanout>,
    #[account(
    constraint = fanout.account_key == holding_account.key(),
    seeds = [b"FUS00r-native-account", fanout.key().as_ref()],
    bump
    )]
    /// CHECK: Checked in Program
    pub holding_account: UncheckedAccount<'info>,
    /// SPL token account containing the token of the sale to be canceled.
    #[account(mut)]
    /// CHECK: Checked in Program
    pub metadata: UncheckedAccount<'info>,

    #[account(address=mpl_token_metadata::id())]
    /// CHECK: Checked in Program
    pub token_metadata_program: UncheckedAccount<'info>,
}

pub fn pass_ua_back(ctx: Context<PassUaBack>) -> Result<()> {
    let metadata = ctx.accounts.metadata.to_account_info();
    let holding_account = &ctx.accounts.holding_account;
    let md = Metadata::from_account_info(&metadata)?;

    assert_owned_by(&metadata, &mpl_token_metadata::id())?;
    let meta_data = metadata.try_borrow_data()?;
    if meta_data[0] != mpl_token_metadata::state::Key::MetadataV1 as u8 {
        return Err(UpdateMetadataError::InvalidMetadata.into());
    }

    invoke_signed(
        &update_metadata_accounts(
            ctx.accounts.token_metadata_program.key(),
            metadata.key(),
            holding_account.key(),
            Some(ctx.accounts.fanout.authority),
            Some(md.data),
            Some(true)
        ),
        &[metadata.to_owned(), holding_account.to_account_info()],
        &[&[
            "FUS00r-native-account".as_bytes(),
            ctx.accounts.fanout.key().as_ref(),
            &[*ctx.bumps.get("holding_account").unwrap()],
        ]],
    )
    .map_err(|e| {
        error::Error::ProgramError(ProgramErrorWithOrigin {
            program_error: e,
            error_origin: None,
            compared_values: None,
        })
    })?;
    Ok(())
}

struct TokenTransferParams<'a: 'b, 'b> {
    /// CHECK: Checked in Program
    source: AccountInfo<'a>,
    /// CHECK: Checked in Program
    destination: AccountInfo<'a>,
    amount: u64,
    /// CHECK: Checked in Program
    authority: AccountInfo<'a>,
    authority_signer_seeds: &'b [&'b [u8]],
    /// CHECK: Checked in Program
    token_program: AccountInfo<'a>,
}
/// Issue a spl_token `Transfer` instruction.
#[inline(always)]
fn spl_token_transfer(params: TokenTransferParams<'_, '_>) -> Result<()> {
    let TokenTransferParams {
        source,
        destination,
        authority,
        token_program,
        amount,
        authority_signer_seeds,
    } = params;
    let result = invoke_signed(
        &spl_token::instruction::transfer(
            token_program.key,
            source.key,
            destination.key,
            authority.key,
            &[],
            amount,
        )?,
        &[source, destination, authority, token_program],
        &[authority_signer_seeds],
    );

    result.map_err(|_| UpdateMetadataError::InvalidMetadata.into())
}
