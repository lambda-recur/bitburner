/** @param {NS} ns */

async function main(ns) {
    if (!ns.stock.has4SData()) {
        ns.print("Purchasing 4SData | " + ns.stock.purchase4SMarketData());
    }
    if (!ns.stock.has4SDataTIXAPI()) {
        ns.print("Purchasing 4SDataTIXApi | " + ns.stock.purchase4SMarketDataTixApi());
    }
    if (!ns.stock.hasTIXAPIAccess()) {
        ns.print("Purchasing 4SData | " + ns.stock.purchaseTixApi());
    }
    if (!ns.stock.hasWSEAccount()) {
        ns.print("Purchasing 4SData | " + ns.stock.purchaseWseAccount());
    }
    if (!(ns.stock.hasTIXAPIAccess() && ns.stock.hasWSEAccount())) {
        ns.print("'StockLoop.js' could not purchase minimum required access privileges.");
    } else {
        const symbols = ns.args;
        const longOrShort = {};
        let funds = ns.getServerMoneyAvailable("home");
        for (const symbol of symbols){
            longOrShort[symbol] = false;
        }
        while(symbols){
            for (const symbol1 of symbols){
                const StockOrder = ns.stock.getOrders();
                funds = ns.getServerMoneyAvailable("home");
                if (Object.keys(longOrShort).includes(symbol1)) {
                    const __long = longOrShort[symbol1];
                    const positions = ns.stock.getPosition(symbol1);
                    if (__long) {
                        if (!Object.keys(StockOrder).includes(symbol1)) {
                            if (!(positions[0] == 0)) {
                                const limitSellPrice = positions[1] * 1.5;
                                ns.stock.placeOrder(symbol1, positions[0], limitSellPrice, "Limit Sell Order", "Long");
                                ns.stock.placeOrder(symbol1, Math.min(ns.stock.getMaxShares(symbol1), positions[0] + Math.floor(funds / symbols.length / limitSellPrice)), limitSellPrice, "Limit Buy Order", "Short");
                                longOrShort[symbol1] = true;
                            } else {
                                const sharesToBuy = Math.min(ns.stock.getMaxShares(symbol1), Math.floor(funds / symbols.length / ns.stock.getPrice(symbol1)));
                                ns.stock.buyStock(symbol1, sharesToBuy);
                            }
                        }
                    } else {
                        if (!Object.keys(StockOrder).includes(symbol1)) {
                            if (!(positions[2] == 0)) {
                                const limitBuyPrice = positions[3] / 1.5 / 1.5;
                                ns.stock.placeOrder(symbol1, positions[2], limitBuyPrice, "Limit Sell Order", "Short");
                                ns.stock.placeOrder(symbol1, Math.min(ns.stock.getMaxShares(symbol1), positions[2] + Math.floor(funds / symbols.length / limitBuyPrice)), limitBuyPrice, "Limit Buy Order", "Long");
                                longOrShort[symbol1] = false;
                            } else {
                                const shortsToBuy = Math.min(ns.stock.getMaxShares(symbol1), Math.floor(funds / symbols.length / ns.stock.getPrice(symbol1)));
                                ns.stock.buyShort(symbol1, shortsToBuy);
                            }
                        }
                    }
                }
            }
            await ns.sleep(450000);
        }
    }
}
export { main as main };
