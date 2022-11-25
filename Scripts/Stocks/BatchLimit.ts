/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

function stageRest(loopInit: number, stage: number, initBuffer: number) {
  return (loopInit + stage * initBuffer - performance.now());
}
function longOrShort(position: number[]) {
  return (position[0] > position[2])
}

export async function main(ns: NS): Promise<void> {
  const target = <string> ns.args[0];
  const symbol = <string>ns.args[1];
  let position = ns.stock.getPosition(symbol);
  const here = <string> ns.getHostname();
  const weaken = "Weaken.js";
  const hack = "Hack.js";
  const grow = "Grow.js";
  let threads = Math.floor(
    (ns.getServerMaxRam(here) - ns.getServerUsedRam(here) - 32) /
      ns.getScriptRam("Hack.js"),
  );
  const hackPerThread = ns.hackAnalyze(target) * ns.getServerMaxMoney(target);
  const maxGrowPerThread = 0.9 * ns.getServerMaxMoney(target) /
    ns.growthAnalyze(target, 10, ns.getServer(ns.getHostname()).cpuCores);
  const maxGrow = maxGrowPerThread * threads;
  const hackToGrowRatio = maxGrow / hackPerThread / threads;
  const weakenRatio1 = (0.004 / 0.05 / hackToGrowRatio) /
    ((0.004 / 0.05 / hackToGrowRatio) + (1 / hackToGrowRatio));
  const weakenRatio2 = 0.002 / 0.05 /
    ((0.002 / 0.05) + 1);
  const growRatio = (1 / hackToGrowRatio) /
    ((0.004 / 0.05 / hackToGrowRatio) + (1 / hackToGrowRatio));
  const hackRatio = 1 /
    ((0.002 / 0.05) + 1);
  const minSecurity = ns.getServerMinSecurityLevel(target);
  const timingLimit = 200;
  const maxScripts = 500;
  let security;
  await ns.tail();
  while (minSecurity <= (security = ns.getServerSecurityLevel(target))) {
    threads = Math.floor(
      (ns.getServerMaxRam(here) - ns.getServerUsedRam(here) - 32) /
        ns.getScriptRam("Weaken.js"),
    );
    if (minSecurity < security) {
      await ns.run(weaken, threads, target);
      await ns.sleep(ns.getWeakenTime(target) + timingLimit);
    }
    ns.print(target + "'s security is minimized");

    let growExecTime = ns.getGrowTime(target);
    let weakenExecTime = ns.getWeakenTime(target);
    let hackExecTime = ns.getHackTime(target);
    const minThreads = Math.ceil(weakenRatio2 / weakenRatio1) + Math.ceil(weakenRatio2 / growRatio);
    const initBuffer = Math.max(
      timingLimit,
      weakenExecTime / maxScripts / 2,
      weakenExecTime * (minThreads / threads),
    );
    const cycles = Math.ceil(weakenExecTime / initBuffer);
    const initThreads = Math.floor(Math.floor(threads / cycles) * 2);
    const weakenThreads1 = Math.ceil(initThreads * weakenRatio1);
    const weakenThreads2 = Math.ceil(initThreads * weakenRatio2);
    const growThreads = Math.ceil(initThreads * growRatio);
    const hackThreads = Math.ceil(initThreads * hackRatio);
    const weakenQueue1: number[] = [];
    const weakenQueue2: number[] = [];

    const loopInit = performance.now();
    let stage = 0;
    let weaken1: number | undefined;
    let weaken2: number | undefined;
    while (
      (security = ns.getServerSecurityLevel(target)) <=
        minSecurity + growThreads * 0.004
    ) {
      position = ns.stock.getPosition(symbol);
      growExecTime = ns.getGrowTime(target);
      weakenExecTime = ns.getWeakenTime(target);
      hackExecTime = ns.getHackTime(target);
      weaken1 = weakenQueue1[0];
      weaken2 = weakenQueue2[0];

      if (Math.ceil((performance.now() + growExecTime) / initBuffer) % 2 == 0 && longOrShort(position)) {
        ns.run(weaken, weakenThreads1, target, stage);
        weakenQueue1.push(performance.now() + weakenExecTime);
      } else if (Math.ceil((performance.now() + growExecTime) / initBuffer) % 2 == 0) {
        ns.run(weaken, weakenThreads2, target, stage);
        weakenQueue2.push(performance.now() + weakenExecTime);
      }
      if (
        weaken1 &&
        (Math.ceil((performance.now() + growExecTime) / initBuffer) % 2 == 1) &&
        (weaken1 - growExecTime - performance.now() < initBuffer)
      ) {
        weakenQueue1.shift();
        ns.run(grow, growThreads, target, true, stage);
      }
      if (
        weaken2 &&
        (Math.ceil((performance.now() + hackExecTime) / initBuffer) % 2 == 1) &&
        (weaken2 - hackExecTime - performance.now() < initBuffer)
      ) {
        weakenQueue2.shift();
        ns.run(hack, hackThreads, target, true, stage);
      }
      await ns.sleep(stageRest(loopInit, ++stage, initBuffer) + 10);
      //ns.print([stage,weakenQueue1,weakenQueue2])
      //ns.exit();
    }
    await ns.sleep(weakenExecTime);
  }
}
