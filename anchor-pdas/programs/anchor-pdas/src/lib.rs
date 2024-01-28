use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint, Token};

declare_id!("BY4GEPxH3TxvWtKi1s4pGSyMnXW3ekkS5kR1JojuQ98B");
#[program]
pub mod anchor_pdas {
    use anchor_spl::token;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.name = name;

        Ok(())
    }

    pub fn change_name(ctx: Context<ChangeName>, name: String) -> Result<()> {
        
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.name = name;        
        
        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNft>) -> Result<()> {

        let accounts = token::Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.receiver_token_address.to_account_info(),
            authority: ctx.accounts.user.to_account_info()
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(), 
            accounts
        );

        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1,
        seeds = [b"user-stats", user.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct ChangeName<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump)]
    pub user_stats: Account<'info, UserStats>,
}

#[derive(Accounts)]
pub struct TransferNft<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = sender_token_account.owner == user.key()
    )]
    pub sender_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
    )]
    pub receiver_token_address: Account<'info, TokenAccount>,

    pub nft_mint_address: Account<'info, Mint>,

    pub token_program: Program<'info, Token>

}


#[account]
pub struct UserStats { // 8 discriminator
    level: u16, // 2 bytes
    name: String // 4 + 80
}