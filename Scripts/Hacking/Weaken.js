/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    await ns.weaken(target);
}
export { main as main };
