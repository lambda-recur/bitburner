/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  let timestamp = performance.now();
  ns.run("HackCentral.js");
  while (ns.getPlayer().skills.agility < 20) {
    if (!ns.singularity.isBusy()){
      ns.singularity.applyToCompany("Joe's Guns","Employee");
    }
    if (performance.now() - timestamp > 600000) {
      ns.run("HackCentral.js");
      timestamp = performance.now();
    }
    ns.singularity.workForCompany("Joe's Guns")
    await ns.sleep(60000);
  }
  ns.run("HackCentral.js");
  ns.singularity.commitCrime("Traffick Arms");
  while (!ns.singularity.checkFactionInvitations().includes("Slum Snakes") || !(ns.singularity.getFactionRep("Slum Snakes") > 0)){
    if (performance.now() - timestamp > 600000) {
      ns.run("HackCentral.js");
      timestamp = performance.now();
    }
    await ns.sleep(60000);
  }
  ns.singularity.joinFaction("Slum Snakes")
}
