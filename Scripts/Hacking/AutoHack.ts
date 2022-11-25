/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
    const target = <string>ns.args[0];
    const threads = <number>ns.args[1]
    const max = ns.getServerMaxMoney(target);
    const moneyThreshold = max * 0.90;
    const access = ns.hasRootAccess(target);
    let growMultiplier;
    let growAmount;
    let hackAmount;
    const hack = <number>ns.args[2];
    while (access) {
        while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
            await ns.weaken(target, {
                threads: threads
            });
        }
        while (ns.getServerMoneyAvailable(target) < moneyThreshold) {
            growMultiplier = await ns.grow(target);
            const newGrowAmount = (growMultiplier - 1) / growMultiplier * ns.getServerMoneyAvailable(target);
            growAmount =(growAmount) ? Math.max(growAmount, newGrowAmount) : newGrowAmount;
            await ns.weaken(target);
        }
        while (!(hackAmount = await ns.hack(target, { threads: hack}))
            && (ns.getServerMoneyAvailable(target) > moneyThreshold)
            && (await ns.weaken(target))) {
            if (hackAmount == 1) {
                await ns.grow(target);
                await ns.weaken(target);
            }
        }
    }
}
