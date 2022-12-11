/** @param {NS} ns */

async function main(ns) {
    const url = "HTTP://localhost:8080/";
    const source = ns.args[0];
    const destination = ns.args[1];
    await ns.wget(url + source, destination);
}
export { main as main };
