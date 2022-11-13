/** @param {NS} ns */

async function main(ns) {
    let ram = ns.args[0];
    while(ns.getPurchasedServerCost(ram * 2) < ns.getServerMoneyAvailable("home")){
        ram *= 2;
    }
    while(true){
        if (ns.getPurchasedServerLimit() > 0) {
            if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
                const hostname = ns.purchaseServer("pserv-" + ram, ram);
                await ns.scp("SimpleHack.js", hostname);
                await ns.exec("SimpleHack.js", hostname, ram / ns.getScriptRam("SimpleHack.js"), "harakiri-sushi");
                ram *= 2;
            } else {
                await ns.sleep(3600000);
            }
        } else {
            const servers = ns.getPurchasedServers();
            const rams = servers.map((hostname)=>ns.getServerMaxRam(hostname));
            const least = Math.min(...rams);
            await ns.deleteServer(servers[rams.indexOf(least)]);
        }
    }
}
export { main as main };
