/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  while (true) {
    await ns.weaken(ns.getHostname());
  }
}
