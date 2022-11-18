/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    const threads = ns.args[1];
    const max = ns.getServerMaxMoney(target);
    const moneyThreshold = max * 0.90;
    const access = ns.hasRootAccess(target);
    let growMultiplier;
    let growAmount;
    let hackAmount;
    let hack = threads;
    while(access){
        while(ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)){
            await ns.weaken(target, {
                threads: threads
            });
        }
        while(ns.getServerMoneyAvailable(target) < moneyThreshold){
            growMultiplier = await ns.grow(target);
            const newGrowAmount = (growMultiplier - 1) / growMultiplier * ns.getServerMoneyAvailable(target);
            growAmount = growAmount ? Math.max(growAmount, newGrowAmount) : newGrowAmount;
            await ns.weaken(target);
        }
        while(!(hackAmount = await ns.hack(target, {
            threads: hackAmount && growAmount ? growAmount - hackAmount > 0 ? hack = (growAmount - hackAmount / growAmount) * hack + hack : hack = growAmount / hackAmount * hack: hack
        })) && ns.getServerMoneyAvailable(target) > moneyThreshold && await ns.weaken(target)){
            if (hackAmount == 1) {
                await ns.grow(target);
                await ns.weaken(target);
            }
        }
    }
}
export { main as main };
