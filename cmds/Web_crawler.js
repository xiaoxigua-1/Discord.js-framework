const Commands = require("../core/commands.js")
const fetch = require('node-fetch')
const Discord = require('discord.js');
const fs = require('fs');
const FormData = require('form-data');
class Web_crawler extends Commands {

}

module.exports = function setup(bot) {
        commands = new Web_crawler(bot)
        commands.command(function pixiv(msg, ...search) {
                    console.log("w")
                    let url = `https://www.pixiv.net/ajax/search/artworks/${encodeURI(search.join(" "))}?word=${encodeURI(search.join(" "))}&order=date_d&mode=all&p=1&s_mode=s_tag&type=all&lang=zh_tw`
                    fetch(url, { method: 'GET' }).then(req => {
                            return req.json()
                        })
                        .then(jj => {
                                if (!jj.body.illustManga.data.length) {
                                    msg.channel.send("無結果")
                                    return
                                }
                                let w = jj.body.illustManga.data[Math.floor(Math.random() * (jj.body.illustManga.data.length))]
                                let id = w.id
                                let title = w.title
                                let url2 = `https://www.pixiv.net/ajax/illust/${id}/pages?lang=zh_tw`
                                fetch(url2, { method: 'GET' }).then(req => {
                                        return req.json()
                                    })
                                    .then(jj => {
                                            let url3 = jj.body[0].urls.original
                                            fetch(url3, { method: 'GET', headers: { "referer": "https://www.pixiv.net" } })
                                                .then(req => {
                                                    return req.buffer()
                                                })
                                                .then(img => {
                                                        let file = `./img/${title.replace(/[/\\*?@#$%^&~`]/, "")}.${url3.split(".")[3]}`

                                        async function upimgurl( name) {
                                            let form = new FormData();
                                            form.append("imgFile", img, name)
                                            let w =await fetch('https://img.onl/api/upload.php', {
                                                    method: 'POST',
                                                    body: form,
                                                    headers: { "referer": "https://img.onl/", "origin": "https://img.onl" }
                                                })
                                                .then(response => {
                                                    return response.json()
                                                })
                                                .then(json => {
                                                    return json.url
                                                })
                                            return w
                                        };
                                        upimgurl(`${title.replace(/[/\\*?@#$%^&~`]/, "")}.${url3.split(".")[3]}`)
                                        .then((w)=>{
                                            let embed = new Discord.MessageEmbed();
                                            embed.setTitle(title)
                                            embed.setFooter(text = msg.author.tag, iconURL = msg.author.avatarURL())
                                            embed.setImage(w)
                                            embed.setDescription(`[原圖網址](${w})`)
                                            embed.setURL(`https://www.pixiv.net/artworks/${id}`)
                                            msg.channel.send(embed)
                                        })

                                })
                        }).catch(error=>{
                            msg.channel.send("似乎出錯ㄌ")
                            console.log(error)
                        })
            }).catch(error=>{
                msg.channel.send("似乎出錯ㄌ")
                console.log(error)
            })
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
        // commands.tasks.loop(()=>{
        //     console.log("w")
        // },1000)
        // commands.tasks.loop(()=>{
        //     console.log("2")
        // },2000,3)
    bot.AddCog(commands)
}