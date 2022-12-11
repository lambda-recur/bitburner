/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS) {
  let ram = <number> ns.args[0];
  const pservers = ns.getPurchasedServers();
  let equivalentServers;
  while (
    ns.getPurchasedServerCost(ram * 2) < ns.getServerMoneyAvailable("home")
  ) {
    ram *= 2;
  }
  while (true) {
    const targetServers = new Set<string>();
    let newServers = ["home"];
    let scanServers;
    while (newServers.length > 0) {
      for (const newServer of newServers) {
        scanServers = ns.scan(newServer);
        for (const scanServer of scanServers) {
          if (!targetServers.has(scanServer)) {
            newServers.push(scanServer);
          }
        }
        targetServers.add(newServer);
      }
      newServers = newServers.filter(function (server) {
        return !targetServers.has(server);
      });
    }
    const targets = Array.from(targetServers).filter(function (target: string) {
      return (ns.hasRootAccess(target) && (ns.getServerMaxMoney(target) > 1));
    });
    if (ns.getPurchasedServerLimit() > 0) {
      equivalentServers = pservers.filter(function (value) {
        return ram == ns.getServerMaxRam(value);
      });
      if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram) && pservers.length < targets.length) {
        ns.purchaseServer(
          "pserv-" + ram + "-" + equivalentServers.length,
          ram,
        );
        ram = Math.min(ns.getPurchasedServerMaxRam(), ram * 2);
        await ns.run("HackCentral.js", 1);
      }
      if (equivalentServers.length < 25){
        await ns.sleep(300000);
      }
      else {
        ns.exit();
      }
    } else {
      const pserversSorted = ns.getPurchasedServers().sort(
        function (aServer: string, bServer: string) {
          return ns.getServerMaxRam(aServer) - ns.getServerMaxRam(bServer);
        },
      );
      ram *= 2;
      await ns.deleteServer(pserversSorted[0]);
    }
  }
}
