let prefix = "*" //prefix
let owner = 458988300418416640 //作者id
const Discord = require('discord.js'); //匯入discord.js模組
const fs = require('fs');
const client = new Discord.Client(); //機器人本體物件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
let event
client.CogDict = {}
let commands = {}
let commandse
client.AddCog = function(obj) {
    obj.Run()
    commandse = {}
    client.CogDict[obj.name] = obj.cogreturn()
    commandse[obj.constructor.name] = obj.commandsreturn()
    let groups = obj.groupreturn();
    Object.assign(commands, groups)
    event = obj.eventretuen()
}

function cmds() {
    let commandfiles = fs.readdirSync("./cmds")
    for (let file of commandfiles) {
        let q = require(`./cmds/${file}`)
        try {
            q(client)
        } catch (e) {
            console.log(`Error:${e}`)
        }
    }
}
cmds()
console.log(client.CogDict)

for (command of Object.values(commandse)) {
    Object.assign(commands, command)
}
for (file of event) {
    try {
        w = function(fun) {
            return function(...a) {
                try {
                    fun(...a)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        client.on(file.name, w(file))
    } catch (error) {
        console.log(`file:${file.name}\nError:\n`)
        console.log(error)
    }
}
client.on('message', msg => { //on_message
    if (msg.content.startsWith(prefix) && !msg.author.bot) {
        if (Object.keys(commands).includes(msg.content.replace(prefix, "").split(" ")[0].toLowerCase())) {
            try {
                let ag = msg.content.split(" ")
                ag.shift()
                commands[msg.content.replace(prefix, "").split(" ")[0].toLowerCase()](msg, ...ag)
            } catch (error) {
                console.log(msg.author.tag + ":" + msg.content)
                console.log("Error:" + error)
            }
        } else {
            msg.channel.send("很像沒這指令喔")
        }
    }
});
client.login('NzM2MDcwODQzOTY0MzI1OTQ4.XxpdZA.tIMi9EGMyI_YOeVWDGGdqITQ5R8');