/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const script1 = "ComplexHack.js";
    const script2 = "Weaken.js";
    const targetServers = ns.scan(here);
    const blackList = [
        here
    ];
    let newServers;
    let scanServers;
    while((newServers = targetServers.filter(function(value) {
        return !blackList.includes(value);
    })).length > 0){
        for(let i = 0; i < newServers.length; ++i){
            const newServer = newServers[i];
            targetServers.push(newServer);
            blackList.push(newServer);
            scanServers = ns.scan(newServer).filter(function(value) {
                return !blackList.includes(value);
            });
            for(let i1 = 0; i1 < scanServers.length; ++i1){
                targetServers.push(scanServers[i1]);
            }
        }
    }
    if (targetServers) {
        for(let i2 = 0; i2 < targetServers.length; ++i2){
            const target = targetServers[i2];
            const maxRam = ns.getServerMaxRam(target);
            const threads2 = maxRam / ns.getScriptRam(script2);
            const min = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js");
            if (target.substring(0, 5) == "pserv") {
                await ns.tprint(script1 + " copied to " + target + " | " + ns.scp(script1, target));
            } else {
                if (min > 1) {
                    await ns.scp(script2, target);
                    const hLevel = ns.getHackingLevel();
                    const sRHL = ns.getServerRequiredHackingLevel(target);
                    if (hLevel > sRHL) {
                        const ports = ns.getServerNumPortsRequired(target);
                        if (ports > 0) {
                            if (ns.fileExists("BruteSSH.exe", "home")) {
                                await ns.brutessh(target);
                            }
                            if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
                                await ns.ftpcrack(target);
                            }
                            if (ports > 2 && ns.fileExists("relaySMTP.exe", "home")) {
                                await ns.relaysmtp(target);
                            }
                            if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
                                await ns.httpworm(target);
                            }
                            if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
                                await ns.sqlinject(target);
                            }
                        }
                        if (!ns.hasRootAccess(target)) {
                            await ns.nuke(target);
                        }
                        await ns.exec(script2, target, threads2);
                    }
                }
            }
        }
    }
}
export { main as main };
