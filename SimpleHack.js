/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
    const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
    const access = ns.hasRootAccess(target);
    while(access){
        const security = ns.getServerSecurityLevel(target);
        if (security > securityThreshold) {
            await ns.weaken(target);
        } else {
            if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        }
    }
}
export { main as main };
