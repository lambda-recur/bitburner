/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  for (const division of ns.corporation.getCorporation().divisions) {
    if (division.type == "Agricultur") {
      const name = division.name;
      for (const city of division.cities) {
        const office = ns.corporation.getOffice(name, city);
        await ns.corporation.upgradeOfficeSize(name, city, 6);
        while (office.employees.length < office.size) {
          await ns.corporation.hireEmployee(name, city);
        }
        const employees = office.employees;
        for (const employee of employees) {
          const index = employees.indexOf(employee);
          if (index < 3) {
            await ns.corporation.assignJob(name, city, employee, "Operations");
          } else if (2 < index && index < 5) {
            await ns.corporation.assignJob(name, city, employee, "Engineer");
          } else if (4 < index && index < 7) {
            await ns.corporation.assignJob(name, city, employee, "Business");
          } else {await ns.corporation.assignJob(
              name,
              city,
              employee,
              "Management",
            );}
        }
        await ns.corporation.upgradeWarehouse(name, city, 7);

        await ns.corporation.buyMaterial(name, city, "Hardware", 2675);
        await ns.corporation.buyMaterial(name, city, "Robots", 96);
        await ns.corporation.buyMaterial(name, city, "AI Cores", 2445);
        await ns.corporation.buyMaterial(name, city, "Real Estate", 119400);
      }
    }
  }
}
