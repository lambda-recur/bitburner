/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const script1 = "ComplexHack.js";
    const script2 = "Weaken.js";
    let blackList = [];
    if (ns.args.length > 0) {
        for(let i = 1; i < ns.args.length; ++i){
            blackList.push(ns.args[i]);
            blackList.push(here);
        }
    } else {
        blackList.push("home");
    }
    const servers = ns.scan(here).filter(function(target) {
        return !blackList.includes(target);
    });
    if (servers.length > 0) {
        for(let i1 = 0; i1 < servers.length; ++i1){
            const target = servers[i1];
            const maxRam = ns.getServerMaxRam(target);
            const threads2 = maxRam / ns.getScriptRam(script2);
            const min = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js");
            if (target.substring(0, 5) == "pserv") {
                await ns.tprint(script1 + " copied to " + target + " | " + ns.scp(script1, target));
            } else {
                if (min > 1) {
                    await ns.scp([
                        "HackRecur.js",
                        script2
                    ], target);
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
                        if (min > 1) {
                            await ns.tprint("Recuring from " + here + " to " + target + " | " + (0 < ns.exec("HackRecur.js", target, 1, ...blackList.concat(servers))));
                        } else {
                            await ns.exec(script2, target, threads2);
                        }
                    }
                }
            }
        }
        if (here != "home") {
            ns.spawn(script2, ns.getServerMaxRam(here) / ns.getScriptRam(script2));
        }
    }
}
export { main as main };
