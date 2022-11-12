/** @param {NS} ns */
function isNotBlackListed(value, blackList) {
	return !blackList.includes(value);
}

export async function main(ns) {
	var here = ns.getHostname();
	var blackList = [];
	if (ns.args) {
		for (var i = 0; i < ns.args.length; ++i) {
			blackList.push(ns.args[i]);
		}
		blackList.push(here)
	}
	else {
		blackList.push("home");
	}

	var servers = ns.scan(here).filter(value => { return isNotBlackListed(value, blackList) });

	if (servers.length > 0) {
		for (var i = 0; i < servers.length; ++i) {
			var target = servers[i];
			var threads = ((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("Apocalypse.js"));

			if (await ns.killall(target)) {
				await ns.scp("Apocalypse.js", target);
				await ns.exec.apply(null, ["Apocalypse.js", target, 1].concat(blackList));
			}
		}
	}
	if (here != "home") {
		await ns.tprint("Terminating 'Apocalypse.js' at " + here);
	}
	else {
		await ns.tprint("Successfully terminating 'Apocalypse.js at home")
	}
}