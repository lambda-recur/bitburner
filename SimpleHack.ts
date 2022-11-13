/** @param {NS} ns */

import { NS } from "./bitburner.d.ts"
export async function main(ns: NS): Promise<void> {
  const target = <string>ns.args[0]
  let stash = <number>ns.getServerMoneyAvailable(target)
  const moneyThreshold = <number>ns.getServerMaxMoney(target) * 0.90
  let security = <number>ns.getServerSecurityLevel(target)
  const securityThreshold = <number>ns.getServerMinSecurityLevel(target) + 5
  const access = <boolean>ns.hasRootAccess(target)

  while (access) {
    if (security > securityThreshold) {
      await ns.weaken(target)
      security = <number>ns.getServerSecurityLevel(target)
    }
    else if (await ns.grow(target) < 0.01) {
      while ( security > securityThreshold && stash > moneyThreshold) {
        await ns.hack(target)
        stash = <number>ns.getServerMoneyAvailable(target)
      }
    }
  }
}