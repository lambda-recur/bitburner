/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

function isNotBlackListed(value : string, blackList : string[]){
    return !blackList.includes(value);
}
export async function main(ns: NS): Promise<void> {
    const here : string = <string>ns.getHostname()
    const blackList : string[] = []
    if (ns.args[1]) {
        for (let i = 1; i < ns.args.length; ++i){
            blackList.push(<string>ns.args[i])
        }
        blackList.push(here)
    }
    else {
        blackList.push("home")
    }
    const servers : string[] = ns.scan(here).filter(function (value:string) { return isNotBlackListed(value, blackList) })
    if (servers.length > 0) {
        for (let i = 0; i < servers.length; ++i) {
            const target : string = servers[i]
            const threads : number = ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("SimpleHack.js"))
            const min : number = ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js"))
        
            if (target.substring(0, 5) == "pserv") {
                const globalTarget = "silver-helix"
                await ns.exec("SimpleHack.js", target, threads, globalTarget);
                await ns.tprint("'SimpleHack.js' booted on " + target);
            }
			else {
				if (ns.fileExists("HackRecur.js", here) && ns.fileExists("SimpleHack.js", here) && threads > 1) {
					if (isNotBlackListed(target, blackList)) {
						await ns.scp(["HackRecur.js", "SimpleHack.js"], target);
					}
					const hLevel : number = ns.getHackingLevel();
					const sRHL : number = ns.getServerRequiredHackingLevel(target);

					if (hLevel > sRHL) {
						const ports : number = ns.getServerNumPortsRequired(target);

						if (ports > 0) {
							if (ns.fileExists("BruteSSH.exe", "home")) {
								await ns.brutessh(target);
								await ns.ftpcrack(target);
							}
						}
						if (ports < 3) {

							if (!ns.hasRootAccess(target)) {
								await ns.nuke(target);
							}

							if (min > 1) {
								await ns.exec("HackRecur.js", target, 1, target, ...blackList);

								while (await ns.getServerUsedRam(target) > 0) {
									await ns.sleep(100);
								}
								await ns.exec("SimpleHack.js", target, threads, target);
							}
							else {
								await ns.exec("SimpleHack.js", target, threads, target)
							}
						}
					}
				}
			}
        }
    }
}
