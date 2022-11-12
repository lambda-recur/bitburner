/** @param {NS} ns **/

export async function main(ns) {
	var target = ns.args[0];
	var stash = ns.getServerMoneyAvailable(target);
	var moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
	var security = ns.getServerSecurityLevel(target);
	var securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
	var accessBool = ns.hasRootAccess(target);

	while (accessBool) {
		if (security > securityThreshold) {
			await ns.weaken(target);
		}
		if (stash < moneyThreshold) {
			await ns.grow(target);
		}
		else {
			await ns.hack(target);
		}
	}
}