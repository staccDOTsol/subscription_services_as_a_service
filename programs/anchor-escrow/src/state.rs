use anchor_lang::prelude::*;
use std::default::Default;
pub const HOLDING_ACCOUNT_SIZE: usize = 1;

pub const FANOUT_MEMBERSHIP_VOUCHER_SIZE: usize = 32 + 8 + 8 + 1 + 32 + 8 + 64;
#[account]
#[derive(Default, Debug)]
pub struct FanoutMembershipVoucher {
    pub fanout: Pubkey,
    pub total_inflow: u64,
    pub last_inflow: u64,
    pub bump_seed: u8,
    pub membership_key: Pubkey,
    pub shares: u64,
}
#[account]
#[derive(Default, Debug)]
pub struct Fanout {
    pub authority: Pubkey,           //32
    pub name: String,                //50
    pub account_key: Pubkey,         //32
    pub total_shares: u64,           //8
    pub bump_seed: u8,               //1
    pub account_owner_bump_seed: u8, //1
    pub total_available_shares: u64, //8
    pub mint: Pubkey,                //8
    pub shares: Vec<u64>,
    pub trait_options: Vec<String>,
    pub minted: u64
}

#[account]
#[derive(Default, Debug, PartialEq)]
pub struct NewUri {
    pub authority: Pubkey,           //32
    pub fanout: Pubkey,                //32
    pub uri: String  ,                //50
    pub bump: u8
}