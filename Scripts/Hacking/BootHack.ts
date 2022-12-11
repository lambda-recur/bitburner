/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const script = <string> ns.args[0];
  const targets = <string[]> ns.args.slice(1);
  let threads: number;
  if (script == "AutoHack.js") {
    threads = Math.floor(
      ns.getServerMaxRam(ns.getHostname()) / ns.getScriptRam(script) /
        targets.length,
    );
  } else if (script == "BatchHack.js") {
    threads = Math.floor(
      (ns.getServerMaxRam(ns.getHostname()) - ns.getScriptRam("BatchHack.js")) /
        ns.getScriptRam("Weaken.js") /
        targets.length,
    );
  }
  async function initiate(target: string) {
    const hackPerThread = ns.hackAnalyze(target) * ns.getServerMaxMoney(target);
    const maxGrowPerThread = 0.9 * ns.getServerMaxMoney(target) /
      ns.growthAnalyze(target, 10, ns.getServer(ns.getHostname()).cpuCores);
    const maxGrow = maxGrowPerThread * threads;
    const initHack = Math.min(Math.floor(maxGrow / hackPerThread), threads);
    if (targets.indexOf(target) < targets.length - 1) {
      if (script == "AutoHack.js") {
        await ns.run(script, threads, target, threads, initHack);
      } else if (script == "BatchHack.js") {
        await ns.run(script, 1, target, threads);
      }
    } else {
      if (script == "AutoHack.js") {
        await ns.spawn(script, threads, target, threads, initHack);
      } else if (script == "BatchHack.js") {
        await ns.spawn(script, 1, target, threads);
      }
    }
    return target;
  }
  await targets.forEach(initiate);
}
