use crate::error::{OrArithError, UpdateMetadataError};
use anchor_lang::prelude::*;

pub fn calculate_inflow_change(total_inflow: u64, last_inflow: u64) -> Result<u64> {
    let diff: u64 = total_inflow.checked_sub(last_inflow).or_arith_error()?;
    Ok(diff)
}

pub fn current_lamports(
    rent: &Sysvar<Rent>,
    size: usize,
    holding_account_lamports: u64,
) -> Result<u64> {
    let subtract_size = rent.minimum_balance(size).max(1);
    holding_account_lamports
        .checked_sub(subtract_size)
        .ok_or_else(|| UpdateMetadataError::NumericalOverflow.into())
}
