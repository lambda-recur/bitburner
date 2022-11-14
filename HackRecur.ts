/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

async function main(ns: NS) {
  const here = ns.getHostname();
  const script1 = "ComplexHack.js";
  const script2 = "Weaken.js";
  let source: string;
  if (ns.args[0]) {
    source = <string> ns.args[0];
  } else {
    source = "home";
  }
  const servers = ns.scan(here).filter(function (target: string) {
    return target != source;
  });
  if (servers.length > 0) {
    for (let i = 0; i < servers.length; ++i) {
      const target = servers[i];
      const maxRam = ns.getServerMaxRam(target);
      const threads2 = maxRam / ns.getScriptRam(script2);
      const min = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) /
        ns.getScriptRam("HackRecur.js");
      if (target.substring(0, 5) == "pserv") {
        await ns.tprint(
          script1 + " copied to " + target + " | " + ns.scp(script1, target),
        );
      } else {
        if (min > 1) {
          await ns.scp([
            "HackRecur.js",
            script2,
          ], target);
          const hLevel = ns.getHackingLevel();
          const sRHL = ns.getServerRequiredHackingLevel(target);
          if (hLevel > sRHL) {
            const ports = ns.getServerNumPortsRequired(target);
            if (ports > 0) {
              if (ns.fileExists("BruteSSH.exe", "home")) {
                await ns.brutessh(target);
              }
              if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
                await ns.ftpcrack(target);
              }
              if (ports > 2 && ns.fileExists("relaySMTP.exe", "home")) {
                await ns.relaysmtp(target);
              }
              if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
                await ns.httpworm(target);
              }
              if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
                await ns.sqlinject(target);
              }
            }
            if (!ns.hasRootAccess(target)) {
              await ns.nuke(target);
            }
            if (min > 1) {
              await ns.tprint(
                "Recuring from " + here + " to " + target + " | " +
                  (0 < ns.exec("HackRecur.js", target, 1, source)),
              );
            }
            else {
              await ns.exec(script2, target, threads2)
            }
            if (here != "home") {
              ns.spawn(script2, threads2, here);
            }
          }
        }
      }
    }
  }
}

export { main as main };
