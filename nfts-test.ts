import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import {getMetaplex, sendTransaction} from "./utils/nft-functions";
import {TokenStandard} from "@metaplex-foundation/mpl-token-metadata";

const connection = new Connection(clusterApiUrl('devnet'))
const metaplex = getMetaplex(connection);
const keypair = Keypair.fromSecretKey(Uint8Array.from([15, 162, 63, 18, 220, 29, 162, 172, 7, 0, 0, 0, 0, 0, 0, 0, 0, 244, 149, 193, 213, 13, 140, 246, 187, 125, 13, 236, 2, 174, 190, 130, 105, 60, 219, 239, 127, 170, 61, 50, 186, 169, 249, 102, 76, 214, 233, 24, 10, 144, 53, 145, 85, 101, 96, 1, 255, 152, 159, 120, 89, 57, 236, 113]))

async function main() {

    const newAddress = Keypair.generate();
    const createBuilder = await metaplex.nfts().builders().create({
        name: "new nft",
        uri: 'https://assets.defiland.app/aa/my_nft.json',
        // creators: [
        //     // {
        //     //     address: new PublicKey('4gmxKWHq2bzvnJUziaNw4cQqJ6vYf7UXJ3EByf6Ubcw8'),
        //     //     share: 100,
        //     //     authority: keypair
        //     // }
        // ],
        // symbol: 'RZG',
        isMutable: true,
        useNewMint: newAddress,
        // tokenAddress:newAddress.publicKey, // token account address
        updateAuthority: keypair,
        // maxSupply: 1,
        mintAuthority: keypair,
        // uses: {total: 10, remaining: 10, useMethod: UseMethod.Multiple},
        // collectionAuthority: keypair,
        sellerFeeBasisPoints: 500,
        // isCollection: false,
        tokenOwner: keypair.publicKey,
        // useExistingMint: newAddress.publicKey
        tokenStandard: TokenStandard.NonFungible,
        collection: new PublicKey('4E3nzQrb8BUvLXEPL5MbuC4stgrHfx8zdRHGYKgjT48z'),
        collectionAuthority: keypair,
    }, {
        payer: keypair
    });

    let ixs = createBuilder.getInstructions()

    const txId = await sendTransaction(ixs, connection, [keypair, newAddress])

    console.log('txId: ', txId)
}

main();