use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

declare_id!("4aGBnhYzh4o8bDSZNAUmix61KHkAthDQawprUaXwbGb2");

#[program]
pub mod anchor_test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {

        msg!("say hi!");

        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, data: u64) -> Result<()> {
        if ctx.accounts.token_account.amount > 0 {
            ctx.accounts.my_account.number = data;
        }

        msg!("Account Has Been Set");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer, 
        space = 48
    )]
    pub my_account: Account<'info, MyAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,

    #[account(
        has_one = owner, 
        constraint = my_account.mint == token_account.mint
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub owner: Signer<'info>
}


#[account]
#[derive(Default)]
pub struct MyAccount {
    number: u64,
    mint: Pubkey
}