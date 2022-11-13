/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns : NS) {
	let ram = <number>ns.args[0];
	while (ns.getPurchasedServerCost(ram * 2) < ns.getServerMoneyAvailable("home")) {
		ram *= 2;
	}
	
	while(ram < ns.getPurchasedServerMaxRam()) {
		if (ns.getPurchasedServerLimit() > 0) {
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				const hostname = <string>ns.purchaseServer("pserv-" + ram, ram);
				await ns.scp("SimpleHack.js", hostname);
				await ns.exec("SimpleHack.js", hostname, (ram / ns.getScriptRam("SimpleHack.js")), "silver-helix");
				ram *= 2;
			}
			else {
				await ns.sleep(3600000);
			}
		}
		else {
			const servers = <string[]>ns.getPurchasedServers();
			const rams = <number[]>servers.map(hostname => ns.getServerMaxRam(hostname));
			const least = Math.min(...rams);
			await ns.deleteServer(servers[rams.indexOf(least)]);
		}
	}
}