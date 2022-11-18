/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const script = <string> ns.args[0];
  const targets = <string[]> ns.args.slice(1);
  const threads = ns.getServerMaxRam(ns.getHostname()) /
    ns.getScriptRam(script) / targets.length;
  const initiate = async function (target: string) {
    if (targets.indexOf(target) < targets.length - 1){
		await ns.run(script, threads, target, threads);
    } else {
		await ns.spawn(script, threads, target, threads);
    }
    return target;
  };
  await targets.forEach(initiate);
}
