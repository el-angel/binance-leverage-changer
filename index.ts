require('dotenv').config();
import client from 'binance-api-node';

const api = process.env.API_KEY;
const secret = process.env.SECRET_KEY;

const useLeverage = process.env.LEVERAGE;

const binance = client({
    apiKey: api,
    apiSecret: secret,
});

const sleep = async (timeout: number): Promise<void> =>
    new Promise((resolve) =>
        setTimeout(() => {
            resolve(undefined);
        }, timeout)
    );

(async () => {
    const acc = await binance.futuresExchangeInfo();

    const symbols = acc.symbols.map((a) => a.symbol);

    symbols.reduce(async (p, symbol) => {
        await p;
        await sleep(500);
        console.log(symbol);

        try {
            const changeType = await binance.futuresMarginType({
                symbol: symbol,
                marginType: 'ISOLATED',
            });

            console.log(symbol, changeType.msg, changeType.code);
        } catch (e) {}

        try {
            const changeLev = await binance.futuresLeverage({
                symbol,
                leverage: useLeverage,
            });

            console.log(symbol, changeLev.leverage);
        } catch (e) {}

        console.log('--------------------------');

        return Promise.resolve();
    }, Promise.resolve());
})();

