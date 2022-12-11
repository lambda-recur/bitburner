/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  await ns.corporation.expandIndustry("Tobacco", "Rohbacco");
  for (const division of ns.corporation.getCorporation().divisions) {
    if (division.type == "Tobacco") {
      const name = division.name;
      await ns.corporation.expandCity(name, "Aevum");
      await ns.corporation.expandCity(name, "Chongqing");
      await ns.corporation.expandCity(name, "Ishima");
      await ns.corporation.expandCity(name, "New Tokyo");
      await ns.corporation.expandCity(name, "Volhaven");

      for (const city of division.cities) {
        const office = ns.corporation.getOffice(name, city);
        if (city == "Aevum") {
          await ns.corporation.upgradeOfficeSize(name, city, 27);
          while (office.employees.length < office.size) {
            await ns.corporation.hireEmployee(name, city);
          }
          const employees = office.employees;
          for (const employee of employees) {
            const index = employees.indexOf(employee);
            if (index < 8) {
              await ns.corporation.assignJob(
                name,
                city,
                employee,
                "Operations",
              );
            } else if (7 < index && index < 17) {
              await ns.corporation.assignJob(name, city, employee, "Engineer");
            } else if (16 < index && index < 21) {
              await ns.corporation.assignJob(name, city, employee, "Business");
            } else {await ns.corporation.assignJob(
                name,
                city,
                employee,
                "Management",
              );}
          }
          await ns.corporation.makeProduct(name,city,"RohBacco_v1",1000000000,1000000000);
        } else {
          await ns.corporation.upgradeOfficeSize(name, city, 6);
          while (office.employees.length < office.size) {
            await ns.corporation.hireEmployee(name, city);
          }
          const employees = office.employees;
          for (const employee of employees) {
            const index = employees.indexOf(employee);
            if (index < 1) {
              await ns.corporation.assignJob(
                name,
                city,
                employee,
                "Operations",
              );
            } else if (0 < index && index < 2) {
              await ns.corporation.assignJob(name, city, employee, "Engineer");
            } else if (1 < index && index < 3) {
              await ns.corporation.assignJob(name, city, employee, "Business");
            } else {await ns.corporation.assignJob(
                name,
                city,
                employee,
                "Management",
              );}
          }
        }
      }
    }
  }
}
