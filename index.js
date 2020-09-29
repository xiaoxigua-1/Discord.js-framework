let prefix = "*" //prefix
let owner = 458988300418416640 //作者id
const Discord = require('discord.js'); //匯入discord.js模組
const fs = require('fs');
const client = new Discord.Client(); //機器人本體物件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.CogDict = {}
client.AddCog = function(obj) {
    obj.Run()
    client.CogDict[obj.constructor.name] = obj.commandsreturn()
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
let commands = {}

cmds()

for (command of Object.values(client.CogDict)) {
    Object.assign(commands, command)
}
client.on('message', msg => { //on_message
    if (msg.content.startsWith(prefix) && !msg.author.bot) {
        if (Object.keys(command).includes(msg.content.replace(prefix, "").split(" ")[0].toLowerCase())) {
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
client.login('');