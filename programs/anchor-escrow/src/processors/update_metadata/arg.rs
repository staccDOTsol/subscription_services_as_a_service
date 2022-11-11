use anchor_lang::prelude::*;
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct UpdateArgs {
    pub uri: String,
    pub name: String,
    pub symbol: String,
    pub seller_fee_basis_points: u16,
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct NewUriArgs {
    pub uri: String,
    pub bump: u8
}
