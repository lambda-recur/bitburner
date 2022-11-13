/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const globalTarget = "silver-helix";
    let source;
    if (ns.args[1]) {
        source = ns.args[1];
    } else {
        source = "home";
    }
    const servers = ns.scan(here).filter(function(target) {
        return target != source;
    });
    if (servers.length > 0) {
        for(let i = 0; i < servers.length; ++i){
            const target = servers[i];
            const threads = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("SimpleHack.js");
            const min = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js");
            if (target.substring(0, 5) == "pserv") {
                await ns.tprint("'SimpleHack.js' booted on " + target + " | " + ns.exec("SimpleHack.js", target, threads, globalTarget));
            } else {
                if (threads > 1) {
                    await ns.scp([
                        "HackRecur.js",
                        "SimpleHack.js"
                    ], target);
                    const hLevel = ns.getHackingLevel();
                    const sRHL = ns.getServerRequiredHackingLevel(target);
                    if (hLevel > sRHL) {
                        const ports = ns.getServerNumPortsRequired(target);
                        if (ports > 0) {
                            if (ns.fileExists("BruteSSH.exe", "home")) {
                                await ns.brutessh(target);
                                await ns.ftpcrack(target);
                                await ns.relaysmtp(target);
                            }
                        }
                        if (ports < 4) {
                            if (!ns.hasRootAccess(target)) {
                                await ns.nuke(target);
                            }
                            if (min > 1) {
                                await ns.tprint("Recuring from " + here + " to " + target + " | " + (0 < ns.exec("HackRecur.js", target, 1, target, source)));
                            }
                            ns.spawn("SimpleHack.js", threads, here);
                        }
                    }
                }
            }
        }
    }
}
export { main as main };
