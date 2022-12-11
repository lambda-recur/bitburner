/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
    if (!ns.args[0]){
        ns.tprint("Oops. SellHashes.js needs an amount to sell.")
    }
    else if (ns.args[0] < 4) {
        ns.tprint("Oops. Amount of hashes to sell must be at least 4.");
    }
    else {
        let hashesToSell = <number>ns.args[0];
        while ((hashesToSell -= 4) >= 0) {
            await ns.hacknet.spendHashes("Sell for Money");
        }
    }
}
