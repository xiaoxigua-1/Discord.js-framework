const Commands = require("../core/commands.js")
const Discord = require('discord.js')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./voice.db');
db.run(`CREATE TABLE IF NOT EXISTS dvc (ChannelId TEXT,CategoryId TEXT)`)
class dvc extends Commands {

}


module.exports = function setup(bot) {
    commands = new dvc(bot)
    voicelist = []
    commands.listener(async function voiceStateUpdate(oldState, newState) {
        console.log(newState.channelID)
        await db.each(`SELECT * FROM dvc WHERE ChannelId='${newState.channelID}'`, async(_error, d) => {

            let p = newState.guild.channels.cache.get(d.CategoryId)
            let channel = await newState.channel.guild.channels.create(`${newState.member.user.username}[${p.children.size+1}]`, { type: 'voice', parent: p.id })
            newState.setChannel(channel)
            voicelist.push(channel.id)
        })
    })
    commands.listener(async function voiceStateUpdate(oldState, newState) {
        if (voicelist.includes(oldState.channelID)) {
            if (oldState.channel.members.size === 0) {
                newState.guild.channels.cache.get(oldState.channelID).delete()
                let index = voicelist.indexOf(oldState.channelID);
                if (index > -1) {
                    voicelist.splice(index, 1);
                }
            }
        }
    })
    commands.command(async function dvc(message) {
         try {
             //commands.is_guild_owner(message)
            //console.log(message.member.permissions)
            let category = await message.channel.guild.channels.create("動態語音", { type: 'category', position: 0 })
            await category.setPosition(0)
            let channel = await message.channel.guild.channels.create("創建語音", { type: 'voice', userLimit: 1, parent: category.id })
            db.run(`INSERT INTO dvc(ChannelId,CategoryId) VALUES(?,?)`, [channel.id.toString(), category.id.toString()])
            message.channel.send("創建成功")
         } catch (e) {
             message.channel.send("你不是群主")
         }

    })
    bot.AddCog(commands)



}