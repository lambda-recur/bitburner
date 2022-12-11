/** @param {NS} ns */

async function main(ns) {
    while(true){
        if (ns.hacknet.getPurchaseNodeCost() < ns.getServerMoneyAvailable("home") && ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
            await ns.hacknet.purchaseNode();
        }
        const indexes = [];
        for(let i = 0; i < ns.hacknet.numNodes(); ++i){
            indexes.push(i);
        }
        const cacheUpgradeCosts = indexes.map(function(index) {
            return ns.hacknet.getCacheUpgradeCost(index, 1);
        });
        const coreUpgradeCosts = indexes.map(function(index) {
            return ns.hacknet.getCoreUpgradeCost(index, 1);
        });
        const levelUpgradeCosts = indexes.map(function(index) {
            return ns.hacknet.getLevelUpgradeCost(index, 1);
        });
        const ramUpgradeCosts = indexes.map(function(index) {
            return ns.hacknet.getRamUpgradeCost(index, 1);
        });
        const minCacheCost = Math.min(...cacheUpgradeCosts);
        const minCoreCost = Math.min(...coreUpgradeCosts);
        const minLevelCost = Math.min(...levelUpgradeCosts);
        const minRamCost = Math.min(...ramUpgradeCosts);
        const minCosts = [
            minCacheCost,
            minCoreCost,
            minLevelCost,
            minRamCost
        ];
        const minUpgradeCost = Math.min(...minCosts);
        const minCostUpgradeIndex = minCosts.indexOf(minUpgradeCost);
        switch(minCostUpgradeIndex){
            case 0:
                ns.hacknet.upgradeCache(cacheUpgradeCosts.indexOf(minCosts[minCostUpgradeIndex]), 1);
                break;
            case 1:
                ns.hacknet.upgradeCache(coreUpgradeCosts.indexOf(minCosts[minCostUpgradeIndex]), 1);
                break;
            case 2:
                ns.hacknet.upgradeCache(levelUpgradeCosts.indexOf(minCosts[minCostUpgradeIndex]), 1);
                break;
            case 3:
                ns.hacknet.upgradeCache(ramUpgradeCosts.indexOf(minCosts[minCostUpgradeIndex]), 1);
                break;
        }
        while(ns.hacknet.numHashes() / ns.hacknet.hashCapacity() > 0.8){
            await ns.hacknet.spendHashes("Sell for Money");
        }
        await ns.sleep(30000);
    }
}
export { main as main };
