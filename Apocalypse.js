/** @param {NS} ns */
function isNotBlackListed(value, blackList) {
	return !blackList.includes(value);
}

export async function main(ns) {
	const here = ns.getHostname();
	const blackList = [];
	if (ns.args) {
		for (let i = 0; i < ns.args.length; ++i) {
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
		await ns.tprint("Successfully terminating 'Apocalypse.js' at home")
	}
}