import {clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram} from "@solana/web3.js";
import {AnchorProvider, BN, Program} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {nftUpdateAuthority, sendTransaction} from "./utils/nft-functions";
import {createInitializeMint2Instruction} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl('devnet'));
const programID = new PublicKey('8ZUasthCjMrfmkLvdGe6im4eYT92tUzN7gwmsMBfVkPX');
const keypair = nftUpdateAuthority;
const provider = new AnchorProvider(connection, new NodeWallet(keypair), {})
export type MyNewAnchorProject = {
    "version": "0.1.0",
    "name": "my_new_anchor_project",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "additionalAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "myAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "age",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "myFirstAnchorAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "signerAddress",
                        "type": "publicKey"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "age",
                        "type": "u8"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "NameLengthError",
            "msg": "Name length thould be lower than 50 "
        }
    ]
};

export const IDL: MyNewAnchorProject = {
    "version": "0.1.0",
    "name": "my_new_anchor_project",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "additionalAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "myAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "age",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "myFirstAnchorAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "signerAddress",
                        "type": "publicKey"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "age",
                        "type": "u8"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "NameLengthError",
            "msg": "Name length thould be lower than 50 "
        }
    ]
};
const program = new Program(IDL, programID, provider) as Program<MyNewAnchorProject>;

async function main(){


    const additionalAddress = Keypair.generate().publicKey;

    const [pda, bump] = PublicKey.findProgramAddressSync([
        Buffer.from("my-account"),
        keypair.publicKey.toBytes(),
        additionalAddress.toBytes()
    ], programID)

    const txId = await program.methods.initialize('rezo', new BN(1)).accounts({
        user: keypair.publicKey,
        myAccount: pda,
        additionalAddress: additionalAddress,
        systemProgram: SystemProgram.programId
    }).rpc();

    console.log("txId: ", txId);
}

async function fetchAccount() {

    // const all = await program.account.myFirstAnchorAccount.all();

    const filteredAccounts = await connection.getProgramAccounts(programID, {
        filters: [
            {
                memcmp: {
                    offset: 8,
                    bytes: keypair.publicKey.toBase58()
                }
            }
        ]
    })

    filteredAccounts.map(x => {
        const parsed = program.coder.accounts.decode('myFirstAnchorAccount', x.account.data);
        console.log('parsed: ', parsed);
    })

}

fetchAccount();

// main();

