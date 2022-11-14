/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const blackList = [];
    if (ns.args) {
        for(let i = 0; i < ns.args.length; ++i){
            blackList.push(ns.args[i]);
        }
        blackList.push(here);
    } else {
        blackList.push("home");
    }
    const servers = ns.scan(here).filter(function(target) {
        return !blackList.includes(target);
    });
    if (servers.length > 0) {
        for(let i1 = 0; i1 < servers.length; ++i1){
            const target = servers[i1];
            await ns.killall(target);
            await ns.scp("Apocalypse.js", target);
            await ns.exec("Apocalypse.js", target, 1, ...blackList.concat(servers));
        }
    }
    if (here != "home") {
        await ns.tprint("Terminating 'Apocalypse.js' at " + here);
    } else {
        await ns.tprint("Successfully terminating 'Apocalypse.js' at home");
    }
}
export { main as main };
