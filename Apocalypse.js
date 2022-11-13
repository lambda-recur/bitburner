// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually
/** @param {NS} ns */

function isNotBlackListed(value, blackList) {
    return !blackList.includes(value);
}
async function main(ns) {
    const here = ns.getHostname();
    const blackList = [];
    const servers = ns.scan(here).filter(function(value) {
        return isNotBlackListed(value, blackList);
    });
    if (ns.args) {
        for(let i = 0; i < ns.args.length; ++i){
            blackList.push(ns.args[i]);
        }
        blackList.push(here);
    } else {
        blackList.push("home");
    }
    if (servers.length > 0) {
        for(let i1 = 0; i1 < servers.length; ++i1){
            const target = servers[i1];
            await ns.killall(target);
            await ns.scp("Apocalypse.js", target);
            await ns.exec("Apocalypse.js", target, 1, ...blackList);
        }
    }
    if (here != "home") {
        await ns.tprint("Terminating 'Apocalypse.js' at " + here);
    } else {
        await ns.tprint("Successfully terminating 'Apocalypse.js' at home");
    }
}
export { main as main };
