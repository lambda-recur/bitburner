/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    const threads = ns.args[1];
    const ratio = ns.args[2];
    const hack = Math.floor(threads / ratio);
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
    const access = ns.hasRootAccess(target);
    while(access){
        while(ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)){
            await ns.weaken(target, {
                threads: threads
            });
        }
        while(ns.getServerMoneyAvailable(target) < moneyThreshold){
            await ns.grow(target, {
                threads: threads
            });
            await ns.weaken(target, {
                threads: threads
            });
        }
        await ns.grow(target, {
            threads: threads
        });
        await ns.weaken(target, {
            threads: threads
        });
        await ns.hack(target, {
            threads: hack
        });
        await ns.weaken(target, {
            threads: threads
        });
    }
}
export { main as main };
