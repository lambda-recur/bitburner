/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    const threads = ns.args[1];
    const ratio = ns.args[2];
    const hack = Math.floor(threads / ratio);
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
    const access = ns.hasRootAccess(target);
    while(access){
        while(ns.getServerSecurityLevel(target) > ns.getServerMoneyAvailable(target)){
            const weaken = Math.max(threads, (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / 0.05);
            await ns.weaken(target, {
                threads: weaken
            });
        }
        while(ns.getServerMoneyAvailable(target) < moneyThreshold){
            await ns.grow(target, {
                threads: threads
            });
            await ns.weaken(target, {
                threads: threads * 0.004 / 0.05
            });
        }
        await ns.grow(target, {
            threads: threads
        });
        await ns.weaken(target, {
            threads: threads * 0.004 / 0.05
        });
        await ns.hack(target, {
            threads: hack
        });
        await ns.weaken(target, {
            threads: threads * 0.002 / 0.05
        });
    }
}
export { main as main };
