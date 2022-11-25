/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const dest = ns.args[0];
    let targets = ns.scan(here);
    let path = [
        here
    ];
    let paths = [
        path
    ];
    const servers = {
        [here]: targets
    };
    while(targets.length > 0){
        for(const i in targets){
            const target = targets[i];
            let scanList;
            if ((scanList = ns.scan(target)).length > 0) {
                servers[target] = scanList;
                targets = targets.concat(...scanList);
            }
            break;
        }
        targets = targets.filter(function(value) {
            return !Object.keys(servers).includes(value);
        });
    }
    const exists = Object.keys(servers).includes(dest);
    while(!path.includes(dest) && exists){
        const newPaths = [];
        let truePaths;
        for(const i1 in paths){
            const currentPath = paths[i1].slice();
            const connections = servers[currentPath[currentPath.length - 1]];
            for(const i2 in connections){
                if (!currentPath.includes(connections[i2])) {
                    const newPath = currentPath.slice();
                    newPath.push(connections[i2]);
                    newPaths.push(newPath);
                }
            }
        }
        if ((truePaths = newPaths.filter(function(pathArray) {
            return pathArray.includes(dest);
        })).length > 0) {
            path = truePaths[0];
        }
        paths = newPaths;
    }
    await ns.tprint(path);
}
export { main as main };
