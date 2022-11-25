/** @param {NS} ns */

async function main(ns) {
    const here = ns.getHostname();
    const dest = ns.args[0];
    function* connections(server) {
        let result;
        if ((result = ns.scan(server)).length > 0) {
            const connections = new Set(...result);
            connections.add("home");
            for (const connection of connections){
                yield connection;
            }
        }
    }
    function* path(path) {
        const tail = path[path.length - 1];
        let nextServer;
        const connection = connections(tail);
        while((nextServer = connection.next().value)){
            if (nextServer) {
                const newPath = path.slice();
                newPath.push(nextServer);
                yield newPath;
            }
        }
    }
    function* paths(paths) {
        while(paths.length > 0){
            const head = paths.pop();
            if (head) {
                let nextPath;
                const newPath = path(head);
                while((nextPath = newPath.next().value)){
                    paths.push(nextPath);
                    yield head;
                }
            }
        }
    }
    function* validPaths(origin, destination) {
        const newPath = paths(origin);
        let nextPath;
        while((nextPath = newPath.next().value)){
            if (nextPath) {
                if (nextPath[nextPath.length - 1] == destination) {
                    yield nextPath;
                }
            }
        }
    }
    const shortPath = validPaths([
        [
            here
        ]
    ], dest);
    await ns.tprint(shortPath.next().value);
}
export { main as main };
