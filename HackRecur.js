/** @param {NS} ns */
function isNotBlackListed(value, blackList) {
	return !blackList.includes(value);
}

export async function main(ns) {
	const here = ns.getHostname();
	const blackList = [];
	if (ns.args[1]) {
		for (let i = 1; i < ns.args.length; ++i) {
			blackList.push(ns.args[i]);
		}
		blackList.push(here)
	}
	else {
		blackList.push("home");
	}

	const servers = ns.scan(here).filter(value => { return isNotBlackListed(value, blackList) });

	if (servers.length > 0) {
		for (let i = 0; i < servers.length; ++i) {
			const target = servers[i];
			const threads = ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("SimpleHack.js"));
			const min = ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js"));

			if (target.substring(0, 5) == "pserv") {
				const globalTarget = "harakiri-sushi";
				await ns.exec("SimpleHack.js", target, threads, globalTarget);
				await ns.tprint("'SimpleHack.js' booted on " + target);
			}
			else {
				if (ns.fileExists("HackRecur.js", here) && ns.fileExists("SimpleHack.js", here) && threads > 1) {
					if (isNotBlackListed(target, blackList)) {
						await ns.scp(["HackRecur.js", "SimpleHack.js"], target);
					}
					const hLevel = ns.getHackingLevel();
					const sRHL = ns.getServerRequiredHackingLevel(target);

					if (hLevel > sRHL) {
						const ports = ns.getServerNumPortsRequired(target);

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
								await ns.exec.apply(null, (["HackRecur.js", target, 1, target].concat(blackList)));

								while (ns.getServerUsedRam(target) > 0) {
									await ns.sleep(1000);
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
	if (here != "home") {
		await ns.tprint("Terminating 'HackRecur.js' at " + here);
	}
	else {
		await ns.tprint("'HackRecur.js' terminating successfully at home")
	}
}
