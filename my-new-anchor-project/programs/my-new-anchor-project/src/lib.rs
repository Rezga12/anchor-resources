use anchor_lang::prelude::*;

declare_id!("8ZUasthCjMrfmkLvdGe6im4eYT92tUzN7gwmsMBfVkPX");

#[program]
pub mod my_new_anchor_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, age: u8) -> Result<()> {


        require!(name.len() < 50, CustomErrors::NameLengthError);

        ctx.accounts.my_account.age = age;
        ctx.accounts.my_account.name = name;     
        ctx.accounts.my_account.signer_address = *ctx.accounts.user.key; 
        ctx.accounts.my_account.bump = ctx.bumps.my_account; 

        Ok(())
    }

    // pub fn close_account(ctx: Context<CloseAccount>) -> Result<()> {
    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: checking in instruction
    pub additional_address: AccountInfo<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + 32 + 200 + 4 + 8,
        seeds = [b"my-account", user.key().as_ref(), additional_address.key().as_ref()],
        bump
    )]
    pub my_account: Account<'info, MyFirstAnchorAccount>,
    pub system_program: Program<'info, System>
}

// #[derive(Accounts)]
// pub struct CloseAccount<'info> {
//     #[account(
//         mut,
//         address = my_account.signer_address
//     )]
//     pub user: Signer<'info>,

//     #[account(
//         mut,
//         seeds = [b"my-account", user.key().as_ref(), additional_address.key().as_ref()],
//         bump = my_account.bump,
//         close = user
//     )]
//     pub my_account: Account<'info, MyFirstAnchorAccount>,
// }

// 
#[account]
pub struct MyFirstAnchorAccount {
    
    pub signer_address: Pubkey, // 32
    pub name: String, // 50 * 4 
    pub age: u8, // 8,
    pub bump: u8,
}

#[error_code]
pub enum CustomErrors {
    #[msg("Name length thould be lower than 50 ")]
    NameLengthError
}