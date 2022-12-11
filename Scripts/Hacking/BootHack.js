/** @param {NS} ns */

async function main(ns) {
    const script = ns.args[0];
    const targets = ns.args.slice(1);
    let threads;
    if (script == "AutoHack.js") {
        threads = Math.floor(ns.getServerMaxRam(ns.getHostname()) / ns.getScriptRam(script) / targets.length);
    } else if (script == "BatchHack.js") {
        threads = Math.floor((ns.getServerMaxRam(ns.getHostname()) - ns.getScriptRam("BatchHack.js")) / ns.getScriptRam("Weaken.js") / targets.length);
    }
    async function initiate(target) {
        const hackPerThread = ns.hackAnalyze(target) * ns.getServerMaxMoney(target);
        const maxGrowPerThread = 0.9 * ns.getServerMaxMoney(target) / ns.growthAnalyze(target, 10, ns.getServer(ns.getHostname()).cpuCores);
        const maxGrow = maxGrowPerThread * threads;
        const initHack = Math.min(Math.floor(maxGrow / hackPerThread), threads);
        if (targets.indexOf(target) < targets.length - 1) {
            if (script == "AutoHack.js") {
                await ns.run(script, threads, target, threads, initHack);
            } else if (script == "BatchHack.js") {
                await ns.run(script, 1, target, threads);
            }
        } else {
            if (script == "AutoHack.js") {
                await ns.spawn(script, threads, target, threads, initHack);
            } else if (script == "BatchHack.js") {
                await ns.spawn(script, 1, target, threads);
            }
        }
        return target;
    }
    await targets.forEach(initiate);
}
export { main as main };
