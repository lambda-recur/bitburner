import { NS } from "@ns";
//import { NS } from "./bitburner.d.ts";

function isNotBlackListed(value: string, blackList:(string | number | boolean)[]){
  return !blackList.includes(value)
}
export async function main(ns: NS): Promise<void> {
  const here : string = ns.getHostname()
  const blackList : (string | number | boolean)[] = [];
  const servers : string[] = ns.scan(here).filter(value => {return isNotBlackListed(value, blackList)})

  if (ns.args) {
    for (let i : number = 0; i < ns.args.length; +i){
      blackList.push(<string>ns.args[i])
    }
    blackList.push(here)
  }
  else {
    blackList.push("home")
  }

  if (servers.length > 0) {
    for (let i : number = 0; i < servers.length; ++i) {
      const target : string = servers[i]

      if (await ns.killall(target)) {
        await ns.scp("Apocalypse.js", target)
        await ns.exec({script: "Apocalypse.js", host: target, numThreads: 1, args: blackList})
      }
    }
  }
  if (here != "home"){
    await ns.tprint("Terminating 'Apocalypse.js' at " + here)
  }
  else {
    await ns.tprint("Successfully terminating 'Apocalypse.js' at home")
  }
}