/** @param {NS} ns */

async function main(ns) {
    while(ns.getPlayer().skills.agility < 20){
        if (!ns.singularity.isBusy()) {
            ns.singularity.applyToCompany("Joe's Guns", "Employee");
        }
        ns.singularity.workForCompany("Joe's Guns");
        ns.sleep(60000);
    }
    ns.singularity.commitCrime("Traffick Arms");
    while(!ns.singularity.checkFactionInvitations().includes("Slum Snakes")){
        await ns.sleep(60000);
    }
    ns.singularity.joinFaction("Slum Snakes");
}
export { main as main };
