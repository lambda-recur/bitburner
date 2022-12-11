/** @param {NS} ns */

async function main(ns) {
    let timestamp = performance.now();
    ns.singularity.commitCrime("Traffic Arms");
    while(ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(1024)){
        if (performance.now() - timestamp > 600000) {
            timestamp = performance.now();
            ns.run("HackCentral.js");
        }
        await ns.sleep(60000);
    }
    ns.run("PurchaseServers.js", 1, 1024);
    const ssAugments = ns.singularity.getAugmentationsFromFaction("Slum Snakes");
    const ssMaxRep = Math.max(...ssAugments.map(function(augment) {
        return ns.singularity.getAugmentationRepReq(augment);
    }));
    ns.singularity.workForFaction("Slum Snakes", "Field Work");
    while(ns.singularity.getFactionRep("Slum Snakes") < ssMaxRep){
        if (performance.now() - timestamp > 600000) {
            timestamp = performance.now();
            ns.run("HackCentral.js");
        }
        await ns.sleep(60000);
    }
    const csecAugments = ns.singularity.getAugmentationsFromFaction("CyberSec");
    const csecMaxRep = Math.max(...csecAugments.map(function(augment) {
        return ns.singularity.getAugmentationRepReq(augment);
    }));
    ns.singularity.workForFaction("CyberSec", "Hacking Contracts");
    while(ns.singularity.getFactionRep("CyberSec") < csecMaxRep){
        if (performance.now() - timestamp > 600000) {
            timestamp = performance.now();
            ns.run("HackCentral.js");
        }
        await ns.sleep(60000);
    }
}
export { main as main };
