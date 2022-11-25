/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const script = <string>ns.args[0];
  const targets = <string[]>ns.args.slice(1);
  const threads = Math.floor(ns.getServerMaxRam(ns.getHostname()) / ns.getScriptRam(script) / targets.length);
  async function initiate (target : string) {
      const hackPerThread = ns.hackAnalyze(target) * ns.getServerMaxMoney(target);
      const maxGrowPerThread = 0.9 * ns.getServerMaxMoney(target) / ns.growthAnalyze(target, 10, ns.getServer(ns.getHostname()).cpuCores);
      const maxGrow = maxGrowPerThread * threads;
      const initHack = Math.min(Math.floor(maxGrow / hackPerThread), threads);
      if (targets.indexOf(target) < targets.length - 1) {
          await ns.run(script, threads, target, threads, initHack);
      } else {
          await ns.spawn(script, threads, target, threads, initHack);
      }
      return target;
  }
  await targets.forEach(initiate);
}
