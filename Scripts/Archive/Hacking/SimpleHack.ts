/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";
export async function main(ns: NS): Promise<void> {
  const target = <string> ns.args[0];
  const moneyThreshold = <number> ns.getServerMaxMoney(target) * 0.90;
  const securityThreshold = <number> ns.getServerMinSecurityLevel(target) + 5;
  const access = <boolean> ns.hasRootAccess(target);

  while (access) {
    const security = <number> ns.getServerSecurityLevel(target);
    if (security > securityThreshold) {
      await ns.weaken(target);
    } else {
      if (<number> ns.getServerMoneyAvailable(target) < moneyThreshold) {
        await ns.grow(target);
      } else {
        await ns.hack(target);
      }
    }
  }
}
