/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const here = <string> ns.getHostname();
  const dest = <string> ns.args[0];

  function* connections(server: string) {
    let result;
    if ((result = ns.scan(server)).length > 0) {
      const connections = new Set(...result);
      connections.add("home");
      for (const connection of connections) {
        yield connection;
      }
    }
  }
  function* path(path: string[]) {
    const tail = path[path.length - 1];
    let nextServer;
    const connection = connections(tail);
    while ((nextServer = connection.next().value)) {
      if (nextServer && !path.includes(nextServer)) {
        const newPath = path.slice();
        newPath.push(nextServer);
        yield newPath;
      }
    }
  }
  function* paths(paths:string[][]){
    while (paths.length > 0) {
      const head = paths.pop();
      if (head) {
        let nextPath;
        const newPath = path(head);
        while ((nextPath = newPath.next().value)){
          paths.push(nextPath);
          yield head;
        }
      }
    }
  }
  function* validPaths(origin: string[][], destination: string) {
    const newPath = paths(origin);
    let nextPath;
    while ((nextPath = newPath.next().value)) {
      if (nextPath) {
        if (nextPath[nextPath.length - 1] == destination) {
          yield nextPath;
        }
      }
    }
  }
  const shortPath = validPaths([[here]],dest)
  let nextShortPath;
  if ((nextShortPath = shortPath.next().value)) {
  await ns.tprint("connect " + nextShortPath.slice(1).join(";connect "));
  }
}
