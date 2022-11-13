/** @param {NS} ns */

import { NS } from "./bitburner.d.ts"
export async function main(ns: NS): Promise<void> {
  const target : string = <string>ns.args[0]
  const stash : number = ns.getServerMoneyAvailable(target)
  const moneyThreshold : number = ns.getServerMaxMoney(target) * 0.90
  const security : number = ns.getServerSecurityLevel(target)
  const securityThreshold : number = ns.getServerMinSecurityLevel(target) + 5
  const access : Boolean = ns.hasRootAccess(target)

  while (access) {
    if (security > securityThreshold) {
        await ns.weaken(target)
    }
    if (stash < moneyThreshold) {
        await ns.grow(target)
    }
    else {
        await ns.hack(target)
    }
  }
}