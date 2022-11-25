/** @param {NS} ns */

import { NS } from "bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const here = <string> ns.getHostname();
  const dest = <string> ns.args[0];
  let targets = <string[]> ns.scan(here);
  let path = [here];
  let paths = [path];
  const servers = {
    [here]: targets,
  };
  while (targets.length > 0) {
    for (const i in targets) {
      const target = targets[i];
      let scanList;
      if ((scanList = ns.scan(target)).length > 0) {
        servers[target] = scanList;
        targets = targets.concat(...scanList);
      }
      break;
    }
    targets = targets.filter(function (value) {
      return !Object.keys(servers).includes(value);
    });
  }
  const exists = Object.keys(servers).includes(dest);
  while (!path.includes(dest) && exists) {
    const newPaths = <string[][]> [];
    let truePaths: string[][];
    for (const i in paths) {
      const currentPath = paths[i].slice();
      const connections = servers[currentPath[currentPath.length - 1]];
      for (const i in connections) {
        if (!currentPath.includes(connections[i])) {
          const newPath = currentPath.slice();
          newPath.push(connections[i]);
          newPaths.push(newPath);
        }
      }
    }
    if (
      (truePaths = newPaths.filter(function (pathArray) {
        return pathArray.includes(dest);
      })).length > 0
    ) {
      path = truePaths[0];
    }
    paths = newPaths;
  }
  await ns.tprint(path);
}
