/** @param {NS} ns */

import { NS } from "./bitburner.d.ts"
export async function main(ns: NS): Promise<void> {
  const target = <string>ns.args[0]
  const moneyThreshold = <number>ns.getServerMaxMoney(target) * 0.90
  const securityThreshold = <number>ns.getServerMinSecurityLevel(target) + 5
  const access = <boolean>ns.hasRootAccess(target)

  while (access) {
    if (<number>ns.getServerSecurityLevel(target) > securityThreshold) {
      await ns.weaken(target)
    }
    else if (await ns.grow(target) < 0.01) {
      while ( <number>ns.getServerSecurityLevel(target) > securityThreshold
              && <number>ns.getServerMoneyAvailable(target) > moneyThreshold) {
        await ns.hack(target)
      }
    }
  }
}