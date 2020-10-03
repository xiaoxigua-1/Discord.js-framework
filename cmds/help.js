const Commands = require("../core/classes.js")
const fetch = require('node-fetch')
const Discord = require('discord.js');
const youtubedl = require('ytdl-core')
class w extends Commands {

}

module.exports = function setup(bot) {
    //實例化w列別(bot必要傳入參數)classname非必要傳入(該cog名稱)
    commands = new w(bot, "classname")
        //function名稱就是指令名稱
        //指令寫法


    commands.command(function w(msg, ...text) {
        msg.channel.send(text.join(" "))
    }, { aliases: ["ee", "ww"] })


    //commands.bot等於bot or client
    commands.command(function e(msg) {
        console.log(commands.bot.CogDict)
    }, { name: null, aliases: null, help: "完整說明", brief: "簡短說明" })


    //event用法
    commands.listener(function message(msg) {
        console.log(`on_message:${msg.content}`)
    })



    commands.command(function bs(message, nubmer, ...text) {
        if (parseFloat(nubmer).toString() !== "NaN" && Number(nubmer) <= 1000) {
            if (text.join(" ") === "") {
                message.channel.send("請輸入主題")
                return
            }
            let jjson = JSON.stringify({ "Topic": text.join(" "), "MinLen": Number(nubmer) })
            fetch("https://api.howtobullshit.me/bullshit", { method: 'POST', body: jjson }).then(function(w) {
                return w.text()
            }).then(function(w) {
                e = w.replace(/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g, "")
                c = e.replace(/<br>/g, "\n")
                let embed = new Discord.MessageEmbed();
                embed.setTitle("唬爛產生器")
                embed.setDescription(`主題:\`${text.join(" ")}\`\n內容:\`\`\`fix\n${c}\n\`\`\``)
                embed.setFooter(text = message.author.tag, iconURL = message.author.avatarURL())
                embed.setThumbnail("https://cdn.discordapp.com/avatars/458988300418416640/544a35606fc1bf5e7a147aafc9759179.png?size=4096")
                message.channel.send(embed)
            })
        } else {
            message.channel.send("請輸入小於1000的整數")
        }
    }, { name: "你好" })


    //group用法
    let e = commands.group(function wq(msg) {
        console.log(msg.content)
    }, { aliases: ["ep", "qq"] })

    e.command(function rr(msg, x) {
        commands.is_owner(msg)
        msg.channel.send(`rr:${x}`)
    }, { aliases: ["ep", "qq"] })
    e.command(function ww(message) {
        message.member.voice.channel.join().then(voicechannel => {
            let w = voicechannel.play(youtubedl("https://www.youtube.com/watch?v=jIpiLvkDIK8", { quality: 'highestaudio' }), { volume: 0.5 })
            w.pause()
            voicechannel.play(youtubedl("https://www.youtube.com/watch?v=7i2knHE7ofQ", { quality: 'highestaudio' }), { volume: 0.5 })
        })
    })

    bot.AddCog(commands)
}