/** @param {NS} ns */

import { NS, StockOrderObject } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  if (!ns.stock.has4SData()) {
    ns.print("Purchasing 4SData | " + ns.stock.purchase4SMarketData());
  }
  if (!ns.stock.has4SDataTIXAPI()) {
    ns.print(
      "Purchasing 4SDataTIXApi | " + ns.stock.purchase4SMarketDataTixApi(),
    );
  }
  if (!ns.stock.hasTIXAPIAccess()) {
    ns.print("Purchasing 4SData | " + ns.stock.purchaseTixApi());
  }
  if (!ns.stock.hasWSEAccount()) {
    ns.print("Purchasing 4SData | " + ns.stock.purchaseWseAccount());
  }
  if (
    !(ns.stock.hasTIXAPIAccess() &&
      ns.stock.hasWSEAccount())
  ) {
    ns.print(
      "'StockLoop.js' could not purchase minimum required access privileges.",
    );
  } else {
    const symbols = <string[]>ns.args;
    const longOrShort : {[key:string]: boolean} = {};
    let funds = ns.getServerMoneyAvailable("home");
    for (const symbol of symbols){
      longOrShort[symbol] = false;
    }
    while(symbols){
      for (const symbol of symbols){
        const StockOrder = ns.stock.getOrders();
        funds = ns.getServerMoneyAvailable("home");
        if (Object.keys(longOrShort).includes(symbol)) {
          const long = longOrShort[symbol];
          const positions = ns.stock.getPosition(symbol);
          if (long){
            if (!Object.keys(StockOrder).includes(symbol)){
              if (!(positions[0] == 0)){
                const limitSellPrice = (positions[1] * 1.5);
                ns.stock.placeOrder(symbol, positions[0], limitSellPrice, "Limit Sell Order", "Long");
                ns.stock.placeOrder(symbol, Math.min(ns.stock.getMaxShares(symbol), positions[0] + Math.floor(funds / symbols.length / limitSellPrice)), limitSellPrice, "Limit Buy Order", "Short");
                longOrShort[symbol] = true;
              }
              else {
                const sharesToBuy = Math.min(ns.stock.getMaxShares(symbol), Math.floor(funds / symbols.length / ns.stock.getPrice(symbol)));
                ns.stock.buyStock(symbol, sharesToBuy);
              }
            }
          }
          else {
            if (!Object.keys(StockOrder).includes(symbol)) {
              if (!(positions[2] == 0)) {
                const limitBuyPrice= (positions[3] / 1.5 / 1.5);
                ns.stock.placeOrder(symbol, positions[2], limitBuyPrice, "Limit Sell Order", "Short");
                ns.stock.placeOrder(symbol, Math.min(ns.stock.getMaxShares(symbol), positions[2] + Math.floor(funds / symbols.length / limitBuyPrice)), limitBuyPrice, "Limit Buy Order", "Long");
                longOrShort[symbol] = false;
              }
              else {
                const shortsToBuy = Math.min(ns.stock.getMaxShares(symbol), Math.floor(funds / symbols.length / ns.stock.getPrice(symbol)));
                ns.stock.buyShort(symbol, shortsToBuy);
              }
            }
          }
        }
      }
      await ns.sleep (450000);
    }
  }
}
