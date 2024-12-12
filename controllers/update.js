const { QueryDatabase } = require('../public/js/database/database.js')
const { fetch_price_jupiter } = require('../controllers/solana.js')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let editList = [10,20,30,40,50,0]
let n = 0
async function processLoop() {
  try {
      const timestamp = Date.now() - (3 * 60 * 60 * 1000);
      const now = new Date();

      if (!editList.includes(now.getMinutes())) {n = 0}

      if ([5,10,15,20,25,30,35,40,45,50,55,0].includes(now.getMinutes())) {
          const len = await QueryDatabase("SELECT ca AS contract_address, decimals, id FROM crypto_sol");

          for (const el of len[0]) {
              const priceToken = await fetch_price_jupiter(el.contract_address, el.decimals);
              await QueryDatabase("UPDATE crypto_sol SET last_price = ? WHERE id = ?", [priceToken, el.id])

              const isOpen = await QueryDatabase("SELECT H_open FROM crypto_sol WHERE ca = ?", [el.contract_address]);
              if (!isOpen[0][0]?.H_open || isOpen[0][0]?.H_open <= 0.000000001) {
                  await QueryDatabase("UPDATE crypto_sol SET H_open = ? WHERE ca = ?", [priceToken, el.contract_address]);
              }

              const high = await QueryDatabase("SELECT H_high FROM crypto_sol WHERE ca = ?", [el.contract_address]);
              const low = await QueryDatabase("SELECT H_low FROM crypto_sol WHERE ca = ?", [el.contract_address]);

              if (priceToken > high[0][0]?.H_high) {
                  await QueryDatabase("UPDATE crypto_sol SET H_high = ? WHERE ca = ?", [priceToken, el.contract_address]);
              }

              if (priceToken < low[0][0]?.H_low) {
                  await QueryDatabase("UPDATE crypto_sol SET H_low = ? WHERE ca = ?", [priceToken, el.contract_address]);
              }

              await QueryDatabase("UPDATE crypto_sol SET H_close = ? WHERE ca = ?", [priceToken, el.contract_address]);
              await sleep(1500);
          }
      }

      if (editList.includes(now.getMinutes())) {
          n = 1
          if (n == 1) {
              const id = await QueryDatabase("SELECT id FROM users");
              for (const id_u of id[0]) {
                  let open = 0;
                  let high = 0;
                  let low = 0;
                  let close = 0;

                  const len = await QueryDatabase(`
                      SELECT p.quantity AS quantity_owned, cs.ca AS contract_address, 
                      cs.decimals AS decimals FROM portfolio p JOIN crypto_sol cs 
                      ON  p.crypto_id = cs.id 
                      WHERE p.user_id = ?; `, id_u.id);
                  
                  for (const el of len[0]) {
                      const chartData = await QueryDatabase("SELECT H_open, H_high, H_low, H_close FROM crypto_sol WHERE ca = ?", [el.contract_address]);
                      try {
                        const existOpen = await QueryDatabase("SELECT open FROM portfolio_chart WHERE user_id = ? ORDER BY chart_id DESC LIMIT 1", [id_u.id]);        

                        if (!existOpen[0][0].open) {
                            open += parseFloat((chartData[0][0]?.H_open * el.quantity_owned).toFixed(5))
                        } else {
                            const lastClose = await QueryDatabase("SELECT close FROM portfolio_chart WHERE user_id = ? ORDER BY chart_id DESC LIMIT 1", [id_u.id])
                            open = lastClose[0][0].close
                        }
                      } catch (err) {
                        open += parseFloat((chartData[0][0]?.H_open * el.quantity_owned).toFixed(5));
                      }
                      high += parseFloat((chartData[0][0]?.H_high * el.quantity_owned).toFixed(5));
                      low += parseFloat((chartData[0][0]?.H_low * el.quantity_owned).toFixed(5));
                      close += parseFloat((chartData[0][0]?.H_close * el.quantity_owned).toFixed(5));
                      const isOpen = await QueryDatabase("SELECT H_open FROM crypto_sol WHERE ca = ?", [el.contract_address]);
                      if (isOpen[0][0]?.H_open) {
                          await QueryDatabase("UPDATE crypto_sol SET H_open = ? WHERE ca = ?", [0, el.contract_address]);
                      }
                  }

                  await QueryDatabase(`INSERT INTO portfolio_chart 
                      (user_id, timestamp, open, high, low, close) 
                      VALUES (?, ?, ?, ?, ?, ?)`, [id_u.id, timestamp, open, high, low, close]);
              }
          }
      }
  } catch (err) {
      console.error(err);
      throw err;
  }

  setTimeout(processLoop, 45000);
}

module.exports = { processLoop }