use anchor_lang::prelude::*;
use mpl_token_metadata::state::Creator;
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct UpdateArgs {
    pub uri: String,
    pub name: String,
    pub symbol: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
}
