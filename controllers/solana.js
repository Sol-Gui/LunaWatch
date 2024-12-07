const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = require('cross-fetch');
const { Metaplex } = require('@metaplex-foundation/js');
const { QueryDatabase } = require('../public/js/database/database.js');

const USDC_DECIMALS = 6;
const connection = new Connection(process.env.SOLANA_ENDPOINT);
const metaplex = new Metaplex(connection);

async function getMetadata(contract_address) {

    try {
        const mintPublicKey = new PublicKey(contract_address);

        const metadata = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

        return metadata;
    } catch (error) {
        console.error('Error fetching token metadata:', error.message);
        return null;
    }
}


// apply decimals as parameter
async function fetch_price_jupiter(contract_address) {
    
    let metadata = await getMetadata(contract_address)
  
    const token_decimals = metadata.mint.decimals;

    const quoteResponse = await (
        await fetch(`
https://quote-api.jup.ag/v6/quote?inputMint=${contract_address}\
&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\
&amount=${1*10**token_decimals}\
&slippageBps=50`
        )
      ).json();
    
    return quoteResponse.outAmount/10**USDC_DECIMALS;
}

async function tokensPage(req, res) {
    let pg = parseInt(req.params.pg, 10);
    if (!pg || !Number.isInteger(pg) || pg <= 0) { pg = 1 };


    try {
        let SolTokenDb = await QueryDatabase("SELECT * FROM crypto_sol ORDER BY id ASC LIMIT ? OFFSET ?;", [5, pg > 1 ? pg * 5 : pg-1]);

        await Promise.all(SolTokenDb[0].map(async (token) => {
            try {
                const priceUsd = await fetch_price_jupiter(token.ca);
                token.priceUsd = priceUsd;
            } catch (err) {
                token.priceUsd = 'error fetching the price :(';
            }
        }));
    
        res.render('blockchains/solana', { Tokens: SolTokenDb[0] });
        // USAR O CA DA DATABASE PARA PROCURAR PELOS METADADOS
    } catch (error) {
        res.status(500).send('An error occurred while fetching Solana tokens.');
    }
}


async function pricePage(req, res) {
    let ca = req.params.ca;

    try {
        const result = await fetch_price_jupiter(ca);

        res.render('token_pages/token_page_sol', { token: result });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).send('Error fetching price');
    }
}

module.exports = { fetch_price_jupiter, pricePage, getMetadata, tokensPage }