/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const here: string = ns.getHostname();
  const targetServers: string[] = ns.scan(here);
  const blackList: string[] = [here];
  let newServers;
  let scanServers;
  while (
    (newServers = targetServers.filter(function (value: string) {
      return !blackList.includes(value);
    })).length > 0
  ) {
    for (let i = 0; i < newServers.length; ++i) {
      const newServer = newServers[i];
      targetServers.push(newServer);
      blackList.push(newServer);
      scanServers = ns.scan(newServer).filter(function (value: string) {
        return !blackList.includes(value);
      });
      for (let i = 0; i < scanServers.length; ++i) {
        targetServers.push(scanServers[i]);
      }
    }
  }
  for (let i = 0; i < targetServers.length; ++i) {
    const target: string = targetServers[i];

    await ns.killall(target);
  }
}
