/** @param {NS} ns */

async function main(ns) {
    performance.now();
    const csecAugments = ns.singularity.getAugmentationsFromFaction("CyberSec");
    const csecMaxRep = Math.max(...csecAugments.map(function(augment) {
        return ns.singularity.getAugmentationRepReq(augment);
    }));
    ns.singularity.workForFaction("CyberSec", "Hacking Contracts");
    while(ns.singularity.getFactionRep("CyberSec") < csecMaxRep){
        await ns.sleep(60000);
    }
    const s12Augments = ns.singularity.getAugmentationsFromFaction("Sector-12");
    const s12MaxRep = Math.max(...s12Augments.map(function(augment) {
        return ns.singularity.getAugmentationRepReq(augment);
    }));
    ns.singularity.workForFaction("Sector-12", "Hacking Contracts");
    while(ns.singularity.getFactionRep("Sector-12") < s12MaxRep){
        await ns.sleep(60000);
    }
    const aevAugments = ns.singularity.getAugmentationsFromFaction("Aevum");
    const aevMaxRep = Math.max(...aevAugments.map(function(augment) {
        return ns.singularity.getAugmentationRepReq(augment);
    }));
    ns.singularity.workForFaction("Aevum", "Hacking Contracts");
    while(ns.singularity.getFactionRep("CyberSec") < aevMaxRep){
        await ns.sleep(60000);
    }
}
export { main as main };
