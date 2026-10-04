import * as verify from "./commands/verify.js";
import * as profile from "./commands/profile.js";
import * as status from "./commands/status.js";
import * as unlink from "./commands/unlink.js";
import * as help from "./commands/help.js";
export const commands=[verify,profile,status,unlink,help];
export const commandMap=new Map(commands.map(c=>[c.data.name,c]));
