use anchor_lang::prelude::*;

pub mod error;
pub mod processors;
pub mod state;
pub mod utils;
use crate::processors::update_metadata::arg::{UpdateArgs, NewUriArgs};

use processors::*;
declare_id!("5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW");

#[program]
pub mod update_metadata {

    use super::*;

    pub fn process_init(ctx: Context<InitializeFanout>, args: InitializeFanoutArgs) -> Result<()> {
        init(ctx, args)
    }

    pub fn process_add_member_wallet(ctx: Context<AddMemberWallet>) -> Result<()> {
        add_member_wallet(ctx)
    }
    pub fn process_sign_metadata(ctx: Context<SignMetadata>, args: UpdateArgs) -> Result<()> {
        sign_metadata(ctx, args)
    }
    pub fn process_pass_ua_back(ctx: Context<PassUaBack>) -> Result<()> {
        pass_ua_back(ctx)
    }
    pub fn process_submit_uri(ctx: Context<SubmitUri>, args:NewUriArgs) -> Result<()> {
        submit_uri(ctx, args)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
