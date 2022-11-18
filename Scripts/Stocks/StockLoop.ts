/** @param {NS} ns */

import { NS, StockOrderObject } from "./bitburner.d.ts";

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
    !(ns.stock.has4SData() &&
      ns.stock.has4SDataTIXAPI() &&
      ns.stock.hasTIXAPIAccess() &&
      ns.stock.hasWSEAccount())
  ) {
    ns.tprint(
      "'StockLoop.js' could not purchase all required access privileges.",
    );
  } else {
    const symbols = <string[]> ns.stock.getSymbols();
    ns.tprint(
      "Placed buy order | " +
        ns.stock.placeOrder(symbols[0], 1, 0.01, "Limit Buy Order", "L"),
    );
    const orders = ns.stock.getOrders();
    for (const mySymbol in Object.keys(orders)) {
      for (const ordersBySymbol in <StockOrderObject[]> orders[mySymbol]) {
        for (let i = 0; i < ordersBySymbol.length; ++i) {
          const order = <StockOrderObject><unknown>ordersBySymbol[i];
          await ns.stock.cancelOrder(
            mySymbol,
            order.shares,
            order.price,
            order.type,
            order.position,
          );
        }
      }
    }
  }
}
