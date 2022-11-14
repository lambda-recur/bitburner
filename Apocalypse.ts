/** @param {NS} ns */

import { NS } from "./bitburner.d.ts";

export async function main(ns: NS): Promise<void> {
  const here : string = ns.getHostname()
  const blackList : (string | number | boolean)[] = [];

  if (ns.args) {
    for (let i = 0; i < ns.args.length; ++i){
      blackList.push(<string>ns.args[i])
    }
    blackList.push(here)
  }
  else {
    blackList.push("home")
  }
  const servers : string[] = ns.scan(here).filter(function(target:string) {return !blackList.includes(target)})

  if (servers.length > 0) {
    for (let i  = 0; i < servers.length; ++i) {
      const target : string = servers[i]
      
      await ns.killall(target)
      await ns.scp("Apocalypse.js", target)
      await ns.exec("Apocalypse.js", target, 1, ...blackList.concat(servers))
    }
  }
  if (here != "home"){
    await ns.tprint("Terminating 'Apocalypse.js' at " + here)
  }
  else {
    await ns.tprint("Successfully terminating 'Apocalypse.js' at home")
  }
}