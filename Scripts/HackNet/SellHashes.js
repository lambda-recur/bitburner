/** @param {NS} ns */

async function main(ns) {
    if (!ns.args[0]) {
        ns.tprint("Oops. SellHashes.js needs an amount to sell.");
    } else if (ns.args[0] < 4) {
        ns.tprint("Oops. Amount of hashes to sell must be at least 4.");
    } else {
        let hashesToSell = ns.args[0];
        while((hashesToSell -= 4) >= 0){
            await ns.hacknet.spendHashes("Sell for Money");
        }
    }
}
export { main as main };
