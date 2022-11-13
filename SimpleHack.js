/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    let stash = ns.getServerMoneyAvailable(target);
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
    let security = ns.getServerSecurityLevel(target);
    const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
    const access = ns.hasRootAccess(target);
    while(access){
        if (security > securityThreshold) {
            await ns.weaken(target);
            security = ns.getServerSecurityLevel(target);
        } else if (await ns.grow(target) < 0.01) {
            while(security > securityThreshold && stash > moneyThreshold){
                await ns.hack(target);
                stash = ns.getServerMoneyAvailable(target);
            }
        }
    }
}
export { main as main };
