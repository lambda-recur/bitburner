/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const targetServers = ns.scan(here);
    const blackList = [
        here
    ];
    let newServers;
    let scanServers;
    while((newServers = targetServers.filter(function(value) {
        return !blackList.includes(value);
    })).length > 0){
        for(let i = 0; i < newServers.length; ++i){
            const newServer = newServers[i];
            targetServers.push(newServer);
            blackList.push(newServer);
            scanServers = ns.scan(newServer).filter(function(value) {
                return !blackList.includes(value);
            });
            for(let i1 = 0; i1 < scanServers.length; ++i1){
                targetServers.push(scanServers[i1]);
            }
        }
    }
    for(let i2 = 0; i2 < targetServers.length; ++i2){
        const target = targetServers[i2];
        await ns.killall(target);
    }
}
export { main as main };
