/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

function stageRest(loopInit: number, stage: number, initBuffer: number) {
  return (loopInit + stage * initBuffer - performance.now());
}

export async function main(ns: NS): Promise<void> {
  const target = <string> ns.args[0];
  const threads = <number> ns.args[1];
  const here = <string> ns.getHostname();
  const weaken = "Weaken.js";
  const hack = "Hack.js";
  const grow = "Grow.js";
  const hackPerThread = ns.hackAnalyze(target) * ns.getServerMaxMoney(target);
  const maxGrowPerThread = 0.9 * ns.getServerMaxMoney(target) /
    ns.growthAnalyze(target, 10, ns.getServer(ns.getHostname()).cpuCores);
  const maxGrow = maxGrowPerThread * threads;
  const hackToGrowRatio = maxGrow / hackPerThread / threads;
  const weakenRatio1 = (0.004 / 0.05 / hackToGrowRatio) /
    ((0.004 / 0.05 / hackToGrowRatio) + (0.002 / 0.05) + (1 / hackToGrowRatio) +
      1);
  const weakenRatio2 = 0.002 / 0.05 /
    ((0.004 / 0.05 / hackToGrowRatio) + (0.002 / 0.05) + (1 / hackToGrowRatio) +
      1);
  const growRatio = (1 / hackToGrowRatio) /
    ((0.004 / 0.05 / hackToGrowRatio) + (0.002 / 0.05) + (1 / hackToGrowRatio) +
      1);
  const hackRatio = 1 /
    ((0.004 / 0.05 / hackToGrowRatio) + (0.002 / 0.05) + (1 / hackToGrowRatio) +
      1);
  const minSecurity = ns.getServerMinSecurityLevel(target);
  const timingLimit = 200;
  const maxScripts = 50;
  let security;
  await ns.tail();
  while (minSecurity <= (security = ns.getServerSecurityLevel(target))) {
    if (minSecurity < security) {
      await ns.run(weaken, threads, target);
      await ns.sleep(ns.getWeakenTime(target) + timingLimit);
    }

    while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
      ns.run(grow, threads, target);
      await ns.sleep(ns.getGrowTime(target) + timingLimit);
      ns.print([
        ns.getServerMoneyAvailable(target),
        ns.getServerMaxMoney(target),
      ]);
      ns.run(weaken, threads, target);
      await ns.sleep(ns.getWeakenTime(target) + timingLimit);
    }
    ns.print(target + "'s money is maximized");

    let growExecTime = ns.getGrowTime(target);
    let weakenExecTime = ns.getWeakenTime(target);
    let hackExecTime = ns.getHackTime(target);
    const minThreads = Math.ceil(weakenRatio2 / weakenRatio1) + Math.ceil(1) +
      Math.ceil(weakenRatio2 / growRatio) + Math.ceil(weakenRatio2 / hackRatio);
    const initBuffer = Math.max(
      timingLimit,
      weakenExecTime / (maxScripts / 2),
      weakenExecTime * (minThreads / threads),
    );
    const cycles = Math.ceil(weakenExecTime / initBuffer);
    const initThreads = Math.floor(Math.floor(threads / cycles) * 4);
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
      growExecTime = ns.getGrowTime(target);
      weakenExecTime = ns.getWeakenTime(target);
      hackExecTime = ns.getHackTime(target);
      weaken1 = weakenQueue1[0];
      weaken2 = weakenQueue2[0];

      if (Math.ceil((performance.now() + growExecTime) / initBuffer) % 4 == 0) {
        ns.run(weaken, weakenThreads1, target, stage);
        weakenQueue1.push(performance.now() + weakenExecTime);
      } else if (
        Math.ceil((performance.now() + growExecTime) / initBuffer) % 4 == 2
      ) {
        ns.run(weaken, weakenThreads2, target, stage);
        weakenQueue2.push(performance.now() + weakenExecTime);
      }
      if (
        weaken1 &&
        (Math.ceil((performance.now() + growExecTime) / initBuffer) % 4 == 1) &&
        (weaken1 - growExecTime - performance.now() < initBuffer)
      ) {
        weakenQueue1.shift();
        ns.run(grow, growThreads, target, false, stage);
      }
      if (
        weaken2 &&
        (Math.ceil((performance.now() + hackExecTime) / initBuffer) % 4 == 3) &&
        (weaken2 - hackExecTime - performance.now() < initBuffer)
      ) {
        weakenQueue2.shift();
        ns.run(hack, hackThreads, target, false, stage);
      }
      await ns.sleep(stageRest(loopInit, ++stage, initBuffer) + 10);
      //ns.print([stage,weakenQueue1,weakenQueue2])
      //ns.exit();
    }
    await ns.sleep(weakenExecTime);
  }
}
