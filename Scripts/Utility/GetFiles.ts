/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const url = "HTTP://localhost:8080/";
  const source = <string>ns.args[0];
  const destination = <string>ns.args[1];
  await ns.wget(url + source, destination);
}
