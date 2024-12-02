// Fetching price through Jupiter API

const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = require('cross-fetch');

const USDC_DECIMALS = 6;
const connection = new Connection('https://api.mainnet-beta.solana.com');

async function fetch_price_jupiter(contract_address) {

    let mint = await connection.getParsedAccountInfo(
      new PublicKey(contract_address)
    )

    const token_decimals = mint.value.data.parsed.info.decimals;

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
 
module.exports = { fetch_price_jupiter }