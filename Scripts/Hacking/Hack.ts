/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const target = <string>ns.args[0];
  let affectStock : boolean;
  if (ns.args[1]) {
    affectStock = <boolean>ns.args[1];
  }
  else {
    affectStock = false;
  }
  await ns.hack(target, {stock: affectStock})
}
