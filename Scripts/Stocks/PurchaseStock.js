/** @param {NS} ns */

async function main(ns) {
    const symbol = ns.args[0];
    const longOrShort = ns.args[1];
    const position = ns.stock.getPosition(symbol);
    let funds;
    if (ns.args[2]) {
        funds = ns.args[2];
    } else {
        funds = ns.getServerMoneyAvailable("home");
    }
    if (longOrShort == "long") {
        const shortPrice = ns.stock.sellShort(symbol, position[2]);
        funds += shortPrice * position[2];
        ns.stock.buyStock(symbol, Math.min(Math.floor(funds / ns.stock.getPrice(symbol)), ns.stock.getMaxShares(symbol)));
    } else {
        const stockPrice = ns.stock.sellStock(symbol, position[0]);
        funds += stockPrice * position[0];
        ns.stock.buyShort(symbol, Math.min(Math.floor(funds / ns.stock.getPrice(symbol)), ns.stock.getMaxShares(symbol)));
    }
}
export { main as main };
