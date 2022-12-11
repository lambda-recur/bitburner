/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS) {
  const script1 = "BootHack.js";
  const script2 = "WeakenLoop.js";
  const servers = new Set<string>();
  let newServers = ["home"];
  let scanServers;
  while (newServers.length > 0) {
    for (const newServer of newServers) {
      scanServers = ns.scan(newServer);
      for (const scanServer of scanServers) {
        if (!servers.has(scanServer)) {
          newServers.push(scanServer);
        }
      }
      servers.add(newServer);
    }
    newServers = newServers.filter(function (server) {
      return !servers.has(server);
    });
  }
  const pservers = ns.getPurchasedServers();
  const targetServers = Array.from(servers).filter(function (target:string) { return !pservers.concat(["home"]).includes(target)});
  const pserversSorted = pservers.sort(function (a, b) {
    const aRam = ns.getServerMaxRam(a);
    const bRam = ns.getServerMaxRam(b);
    return bRam - aRam;
  });
  const targets = Array.from(servers).filter(function (target: string) {
    return (ns.hasRootAccess(target) && (ns.getServerMaxMoney(target) > 1));
  });
  const targetsSorted = targets.sort(function (a, b) {
    const aSec = ns.getServerMaxMoney(a) / ns.getServerSecurityLevel(a);
    const bSec = ns.getServerMaxMoney(b) / ns.getServerSecurityLevel(b);
    return bSec - aSec;
  }).filter(function (target) {
    return ns.getServerRequiredHackingLevel(target) <
      ns.getHackingLevel() / 3;
  }).slice(1);
  for (const pserver of pserversSorted) {
    await ns.killall(pserver);
    await ns.scp([
      script1,
      "BatchHack.js",
      "Weaken.js",
      "Hack.js",
      "Grow.js",
    ], pserver);
    ns.exec(
      script1,
      pserver,
      1,
      "BatchHack.js",
      targetsSorted[pserversSorted.indexOf(pserver)],
    );
  }
  for (const target of targetServers) {
    await ns.scp(script2, target);
    const hLevel = ns.getHackingLevel();
    const sRHL = ns.getServerRequiredHackingLevel(target);
    if (hLevel >= sRHL) {
      const ports = ns.getServerNumPortsRequired(target);
      let programs = 0;
      if (ports > 0) {
        if (ns.fileExists("BruteSSH.exe", "home")) {
          await ns.brutessh(target);
          ++programs;
        }
        if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
          await ns.ftpcrack(target);
          ++programs;
        }
        if (ports > 2 && ns.fileExists("relaySMTP.exe", "home")) {
          await ns.relaysmtp(target);
          ++programs;
        }
        if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
          await ns.httpworm(target);
          ++programs;
        }
        if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
          await ns.sqlinject(target);
          ++programs;
        }
      }
      if (!ns.hasRootAccess(target) && programs >= ports) {
        await ns.nuke(target);
      }
      ns.killall(target);
      const threads = Math.floor(
        ns.getServerMaxRam(target) / ns.getScriptRam(script2),
      );
      if (threads > 0) {
        await ns.exec(
          script2,
          target,
          Math.floor(ns.getServerMaxRam(target) / ns.getScriptRam(script2)),
        );
      }
    }
  }
}
