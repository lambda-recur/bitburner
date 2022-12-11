/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const here = ns.getHostname();
  const solvers : {[key:string]: (file:string) => number} = {};
  function maxSubarraySum(contract:string) {
    const array = ns.codingcontract.getData(contract);
    let sum = 0;
    for (let i = array.length - 1; i > 0; --i){
      for (let j = 0; j + i <= array.length; ++j){
        const subarray = array.slice(j,i);
        sum = Math.max(sum, subarray.reduce(function (acc:number, value:number) { return acc + value; }, 0))
      }
    }
    return sum;
  }
  solvers["Subarray with Maximum Sum"] = maxSubarraySum;
  let type: string;
  if (!ns.args[0]) {
    ns.tprint("ContractSolver.js> Need a contract type to solve.");
  } else {
    type = <string> ns.args[0];
    ns.codingcontract.createDummyContract(type);

    const files = ns.ls(here, "*.cct");
    for (const file of files) {
      if (ns.codingcontract.getContractType(file) == "Subarray with Maximum Sum") {
        await ns.tprint("Attempting: " + file + " | " +ns.codingcontract.attempt(solvers["Subarray with Maximum Sum"](file),file));
      }
    }
  }
}
