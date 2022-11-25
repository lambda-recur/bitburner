/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const target = <string>ns.args[0];

  await ns.weaken(target)
}
