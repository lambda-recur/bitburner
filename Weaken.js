/** @param {NS} ns */

async function main(ns) {
    while(true){
        await ns.weaken(ns.getHostname());
    }
}
export { main as main };
