/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  await ns.corporation.createCorporation("RohKorp", false);
  await ns.corporation.unlockUpgrade("Smart Supply");
  await ns.corporation.unlockUpgrade("Warehouse API");
  await ns.corporation.unlockUpgrade("Office API");
  await ns.corporation.expandIndustry("Agriculture", "RohGreen");
  await ns.corporation.setSmartSupply("RohGreen", "Sector-12", true);
  for (const division of ns.corporation.getCorporation().divisions) {
    if (division.type == "Agriculture") {
      const name = division.name;
      await ns.corporation.expandCity(name, "Aevum");
      await ns.corporation.expandCity(name, "Chongqing");
      await ns.corporation.expandCity(name, "Ishima");
      await ns.corporation.expandCity(name, "New Tokyo");
      await ns.corporation.expandCity(name, "Volhaven");
      for (const city of division.cities) {
        const office = ns.corporation.getOffice(name, city);
        while (office.employees.length < office.size) {
          await ns.corporation.hireEmployee(name, city);
        }
        const employees = office.employees;
        for (const employee of employees) {
          switch (employees.indexOf(employee)) {
            case 0:
              await ns.corporation.assignJob(
                name,
                city,
                employee,
                "Operations",
              );
              break;
            case 1:
              await ns.corporation.assignJob(name, city, employee, "Engineer");
              break;
            case 2:
              await ns.corporation.assignJob(name, city, employee, "Business");
              break;
          }
        }
        if (!ns.corporation.hasWarehouse(name, city)) {
          await ns.corporation.purchaseWarehouse(name, city);
        }
        await ns.corporation.upgradeWarehouse(name, city, 2);
        await ns.corporation.sellMaterial(name, city, "Plants", "MAX", "MP");
        await ns.corporation.sellMaterial(name, city, "Food", "MAX", "MP");

        await ns.corporation.buyMaterial(name,city,"Hardware",125);
        await ns.corporation.buyMaterial(name,city,"AI Cores",75);
        await ns.corporation.buyMaterial(name,city,"Real Estate",27000);
      }
      await ns.corporation.hireAdVert(name);
    }
  }
  for (let i = 0; i < 2; ++i) {
    await ns.corporation.levelUpgrade("FocusWires");
    await ns.corporation.levelUpgrade("Neural Accelerators");
    await ns.corporation.levelUpgrade("Speech Processor Implants");
    await ns.corporation.levelUpgrade("Nuoptimal Nootropic Injector Implants");
    await ns.corporation.levelUpgrade("Smart Factories");
  }
}
