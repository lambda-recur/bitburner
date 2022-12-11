/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  for (const division of ns.corporation.getCorporation().divisions) {
    if (division.type == "Agriculture") {
      const name = division.name;
      for (const city of division.cities) {
        await ns.corporation.upgradeWarehouse(name, city, 9);

        await ns.corporation.buyMaterial(name, city, "Hardware", 6500);
        await ns.corporation.buyMaterial(name, city, "Robots", 630);
        await ns.corporation.buyMaterial(name, city, "AI Cores", 3750);
        await ns.corporation.buyMaterial(name, city, "Real Estate", 84000);
      }
    }
  }
}
