/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
	const flags = ns.flags([
		['s', 'Apocalypse.js'],
		['target', 'home']
	]);
	const ram = ns.getScriptRam(<string>flags.s);
	const threads = ns.getServerMaxRam(<string>flags.target) / ram
	await ns.tprint(flags.target + " can run: " + Math.floor(threads) + " threads of '" + flags.s + "'")
}
