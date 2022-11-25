/** @param {NS} ns */

async function main(ns) {
    const target = ns.args[0];
    let affectStock;
    if (ns.args[1]) {
        affectStock = ns.args[1];
    } else {
        affectStock = false;
    }
    await ns.hack(target, {
        stock: affectStock
    });
}
export { main as main };
