/** @param {NS} ns */

function isNotBlackListed(value, blackList) {
    return !blackList.includes(value);
}
async function main(ns) {
    const here = ns.getHostname();
    const blackList = [];
    if (ns.args[1]) {
        for(let i = 1; i < ns.args.length; ++i){
            blackList.push(ns.args[i]);
        }
        blackList.push(here);
    } else {
        blackList.push("home");
    }
    const servers = ns.scan(here).filter(function(value) {
        return isNotBlackListed(value, blackList);
    });
    if (servers.length > 0) {
        for(let i1 = 0; i1 < servers.length; ++i1){
            const target = servers[i1];
            const threads = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("SimpleHack.js");
            const min = (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam("HackRecur.js");
            if (target.substring(0, 5) == "pserv") {
                const globalTarget = "silver-helix";
                await ns.tprint("'SimpleHack.js' booted on " + target + " | " + ns.exec("SimpleHack.js", target, threads, globalTarget));
            } else {
                if (ns.fileExists("HackRecur.js", here) && ns.fileExists("SimpleHack.js", here) && threads > 1) {
                    if (isNotBlackListed(target, blackList)) {
                        await ns.scp([
                            "HackRecur.js",
                            "SimpleHack.js"
                        ], target);
                    }
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
                                await ns.tprint("Recuring from " + here + " to " + target + " | " + (0 < ns.exec("HackRecur.js", target, 1, target, ...blackList)));
                                while(await ns.getServerUsedRam(target) > 0){
                                    await ns.sleep(100);
                                }
                                await ns.exec("SimpleHack.js", target, threads, target);
                            } else {
                                await ns.exec("SimpleHack.js", target, threads, target);
                            }
                        }
                    }
                }
            }
        }
    }
}
export { main as main };
