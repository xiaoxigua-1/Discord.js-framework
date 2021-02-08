const Discord = require('discord.js');
const commandserror = require("./core/commandserror") //匯入discord.js模組
const fs = require('fs');
let jsoninif = JSON.parse(fs.readFileSync("./config/config.json").toString())
fs.readFile
let prefix = jsoninif.prefix
let owner = jsoninif.owner_id //作者id
const client = new Discord.Client(); //機器人本體物件
let event
client.CogDict = {}
let commands = {}
let commandse = {}
client.owner = owner
let tasks = []
client.CommandsError = function (msg, error) {
    console.log(error)
}
client.AddCog = function (obj) {
    client.CogDict[obj.name] = obj.cogreturn()
    commandse[obj.name] = obj.commandsreturn()
    let groups = obj.groupreturn();
    Object.assign(commands, groups)
    event = obj.eventretuen()
    tasks.push(obj.tasks)
    for (file of event) {
        try {
            w = function (fun) {
                return function (...a) {
                    try {
                        fun(...a)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            client.on(file.name, w(file))
        } catch (error) {
            console.log(`file:${file.name}\nError:\n\n${error}`)
        }
    }
}

function cmds() {
    let commandfiles = fs.readdirSync("./cmds")
    for (let file of commandfiles) {
        let q = require(`./cmds/${file}`)
        try {
            q(client)
        } catch (e) {
            console.log(`${file}Error:${e}`)
        }
    }
}
cmds()
//console.log(client.CogDict)
for (command of Object.values(commandse)) {
    Object.assign(commands, command)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    for (let i of tasks) {
        i.run()
    }
});
client.on('message', msg => { //on_message
    if (msg.content.startsWith(prefix) && !msg.author.bot && !jsoninif.blacklist.includes(Number(msg.author.id))) {
        if (Object.keys(commands).includes(msg.content.replace(prefix, "").split(/ +/g)[0].toLowerCase())) {
            try {
                let ag = msg.content.split(/ +/g)
                ag.shift()
                commands[msg.content.replace(prefix, "").split(/ +/g)[0].toLowerCase()](msg, ...ag)
            } catch (error) {
                client.CommandsError(msg, error)
            }
        } else {
            try {
                throw new commandserror(`Not command is ${msg.content.replace(prefix, "").split(/ +/g)[0].toLowerCase()}`, "Commands.Errors.Not_command")
            } catch (e) {
                try {
                    client.CommandsError(msg, e)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
});
client.login(jsoninif.token);