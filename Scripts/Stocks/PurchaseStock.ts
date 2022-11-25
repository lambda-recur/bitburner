/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const symbol = <string>ns.args[0];
  const longOrShort = <string>ns.args[1];
  const position = ns.stock.getPosition(symbol);
  let funds : number;
  if (ns.args[2]) {
    funds = <number>ns.args[2];
  }
  else {
    funds = <number>ns.getServerMoneyAvailable("home");
  }
  if (longOrShort == "long") {
    const shortPrice = ns.stock.sellShort(symbol, position[2]);
    funds += shortPrice * position[2];
    ns.stock.buyStock(symbol, Math.min(Math.floor(funds / ns.stock.getPrice(symbol)), ns.stock.getMaxShares(symbol)));
  }
  else {
    const stockPrice = ns.stock.sellStock(symbol, position[0]);
    funds += stockPrice * position[0];
    ns.stock.buyShort(symbol, Math.min(Math.floor(funds / ns.stock.getPrice(symbol)), ns.stock.getMaxShares(symbol)));
  }
}
