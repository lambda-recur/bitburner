/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const target = <string> ns.args[0];
  const threads = <number> ns.args[1];
  const ratio = <number> ns.args[2];
  const hack = Math.floor(threads / ratio);
  const moneyThreshold = <number> ns.getServerMaxMoney(target) * 0.90;
  const access = <boolean> ns.hasRootAccess(target);

  while (access) {
    while (
      ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)
    ) {
      await ns.weaken(target, { threads: threads });
    }
    while (ns.getServerMoneyAvailable(target) < moneyThreshold) {
      await ns.grow(target, { threads: threads });
      await ns.weaken(target, { threads: threads});
    }
    await ns.grow(target, { threads: threads });
    await ns.weaken(target, { threads: threads });
    await ns.hack(target, { threads: hack });
    await ns.weaken(target, { threads: threads });
  }
}
