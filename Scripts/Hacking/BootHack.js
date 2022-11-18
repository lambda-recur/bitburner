/** @param {NS} ns */

async function main(ns) {
    const script = ns.args[0];
    const targets = ns.args.slice(1);
    const threads = ns.getServerMaxRam(ns.getHostname()) / ns.getScriptRam(script) / targets.length;
    const initiate = async function(target) {
        if (targets.indexOf(target) < targets.length - 1) {
            await ns.run(script, threads, target, threads);
        } else {
            await ns.spawn(script, threads, target, threads);
        }
        return target;
    };
    await targets.forEach(initiate);
}
export { main as main };
