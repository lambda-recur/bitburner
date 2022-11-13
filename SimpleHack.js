/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
    const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
    const access = ns.hasRootAccess(target);
    while(access){
        if (ns.getServerSecurityLevel(target) > securityThreshold) {
            await ns.weaken(target);
        } else if (await ns.grow(target) < 0.01) {
            while(ns.getServerSecurityLevel(target) > securityThreshold && ns.getServerMoneyAvailable(target) > moneyThreshold){
                await ns.hack(target);
            }
        }
    }
}
export { main as main };
