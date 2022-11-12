/** @param {NS} ns **/

export async function main(ns) {
	const target = ns.args[0];
	const stash = ns.getServerMoneyAvailable(target);
	const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
	const security = ns.getServerSecurityLevel(target);
	const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
	const accessBool = ns.hasRootAccess(target);

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