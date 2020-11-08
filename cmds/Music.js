const Discord = require('discord.js');
const Commands = require("../core/commands.js")
const youtubedl = require('ytdl-core')
let youtubeapitaken = ""
let ytsearch = require('youtube-search');

let opts = {
    maxResults: 10,
    key: youtubeapitaken
}

class Music extends Commands {

}

class Soninif {
    constructor(inif, s) {
        this.url = inif.link
        this.title = inif.title
        this.img = inif.thumbnails.default.url
        this.s = s
    }
}

class PlayList {
    constructor(id) {
        this.id = id
        this.songlist = []
        this.nowplay
        this.skip = false
        this.play = false
        this.dispatcher = null
        this.paused = false
        this.resume = false
        this.sw = false
    }
    songadd(inif, s) {
        this.songlist.push(new Soninif(inif[0], s))
            //console.log(this.songlist)
    }
    playsong(voice) {
        voice.join.then(connection => {
            if (voice.pl.play === false) {
                if (voice.pl.songlist.length === 0) {
                    voice.pl.nowplay = null
                    return
                }
                //console.log(voice.pl.songlist1()[0].url)
                voice.pl.dispatcher = connection.play(youtubedl(voice.pl.songlist[0].url))
                    //console.log(dispatcher)
                voice.pl.nowplay = voice.pl.songlist[0]
                voice.pl.songlist.shift()
                voice.pl.play = true
            } else {
                voice.pl.play = voice.pl.dispatcher.writable
                    //console.log(voice.pl.dispatcher.paused, voice.pl.paused, voice.pl.play)
                if (!voice.pl.dispatcher.paused && voice.pl.paused && voice.pl.play) {
                    voice.pl.dispatcher.pause()
                    voice.pl.paused = false
                    voice.pl.sw = true
                }
                if (voice.pl.dispatcher.paused && voice.pl.resume) {
                    voice.pl.resume = false
                    voice.pl.dispatcher.resume()
                    voice.pl.sw = false
                }
                if (voice.pl.dispatcher.writable && voice.pl.skip) {
                    voice.pl.dispatcher.pause()
                    voice.pl.skip = false
                    voice.pl.play = false
                }
            }
        });
    }
    skipw(x) {
        if (this.id !== x) return false
        this.skip = true
        return true
    }
    pausew(x) {
        if (this.id !== x) return false
        this.paused = true
        return true
    }
    resumew(x) {
        if (this.id !== x) return false
        this.resume = true
        return true
    }
    nowpalytime(msg, pl) {
        let nowpp = Embed.embed()
        if (pl.nowplay.s === "0") {
            nowpp.setDescription(`正在播放:
            [${pl.nowplay.title}](${pl.nowplay.url})
            時間:${Math.floor(pl.dispatcher.streamTime/60000)}:${Math.floor(pl.dispatcher.streamTime/1000%60000)}/∞`)
        } else {
            nowpp.setDescription(`正在播放:
            [${pl.nowplay.title}](${pl.nowplay.url})
            時間:${Math.floor(pl.dispatcher.streamTime/60000)}:${Math.floor(pl.dispatcher.streamTime/1000%60000)}/${Math.floor(pl.nowplay.s/60)}:${pl.nowplay.s%60}`)
        }
        msg.channel.send(nowpp)
    }


}

class Player {
    constructor() {
        this.voiceid = {}
    }
    AddPlayer(channel, playlist) {
        let voicechannel = channel.join()
        this.voiceid[channel.id] = { "join": voicechannel, "pl": playlist }
    }
    Run() {
        let w = this.voiceid
        const delay = (s) => {
            return new Promise(function(resolve) { // 回傳一個 promise
                setTimeout(resolve, s); // 等待多少秒之後 resolve()
            });
        };
        ~async function(w) {
            while (1) {
                for (let i of Object.keys(w)) {
                    w[i].pl.playsong(w[i])
                }
                await delay(1500)
            }
        }(w)
    }
}

class Embed {
    static embed() {
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music system")
        embed.setFooter("Author is xiao xigua", "https://cdn.discordapp.com/avatars/458988300418416640/544a35606fc1bf5e7a147aafc9759179.png?size=4096")
        return embed
    }
    static Notvoicrasme(msg) {
        // embed.setAuthor(msg.author.tag, msg.author.avatarURL())
        return Embed.embed().setDescription(`${msg.author.tag}\n你似乎跟我在不同的語音`)
    }
    static Notinvoie(msg) {
        return Embed.embed().setDescription(`${msg.author.tag}\n你似乎不再語音`)
    }
    static playinif(w) {
        let qqq = Embed.embed()
        qqq.setDescription(`搜尋:\n[${w[0].title}](${w[0].link})`)
        qqq.setThumbnail(w[0].thumbnails.default.url)
        return qqq
    }
    static botnotinvoice(msg) {
        return Embed.embed().setDescription(`${msg.author.tag}你似乎沒有把我加進語音優`)
    }
}

function Search(search, pl, msg) {
    ytsearch(search, opts, function(err, results) {
        youtubedl.getInfo(results[0].link).then(w => {
            pl.songadd(results, w.videoDetails.lengthSeconds)
        })
        if (err) return console.log(err);
        return results
    }).then(w => {
        msg.channel.send(Embed.playinif(w))
    })
}

module.exports = function setup(bot) {
    let commands = new Music(bot)
    let player = new Player()
    player.Run()
    let Guilds = {}
    commands.command(function play(msg, search = null) {
        if (search !== null) {
            if (msg.member.voice.channel === null) {
                msg.channel.send(Embed.Notinvoie(msg))
                return
            }
            if (!Object.keys(Guilds).includes(msg.guild.id)) {
                let pl = new PlayList(msg.member.voice.channel.id)
                Guilds[msg.guild.id] = pl
                player.AddPlayer(msg.member.voice.channel, pl)
                Search(search, pl, msg)
            } else {
                if (msg.member.voice.channel.id !== Guilds[msg.guild.id].id) {
                    msg.channel.send(Embed.Notvoicrasme(msg))
                    return
                }
                Search(search, Guilds[msg.guild.id], msg)
            }
        }
    })
    commands.command(function skip(msg) {
        if (msg.member.voice.channel === null) {
            msg.channel.send(Embed.Notinvoie(msg))
            return
        }
        if (Object.keys(Guilds).includes(msg.guild.id)) {
            if (Guilds[msg.guild.id].songlist.length === 0) {
                msg.channel.send(Embed.embed().setDescription("已經沒有歌曲可以跳搂~"))
                return
            }
            if (!Guilds[msg.guild.id].skipw(msg.member.voice.channel.id)) {
                msg.channel.send(Embed.Notvoicrasme(msg))
            } else {
                msg.channel.send(Embed.embed().setDescription("以跳過"))
            };
        } else {
            msg.channel.send(Embed.botnotinvoice(msg))
        }
    })
    commands.command(function pause(msg) {
        if (msg.member.voice.channel === null) {
            msg.channel.send(Embed.Notinvoie(msg))
            return
        }
        if (Object.keys(Guilds).includes(msg.guild.id)) {
            if (Guilds[msg.guild.id].sw) {
                msg.channel.send(Embed.embed().setDescription("已經暫停了優~~"))
            } else {
                if (!Guilds[msg.guild.id].pausew(msg.member.voice.channel.id)) msg.channel.send(Embed.Notvoicrasme(msg))
                else {
                    msg.channel.send(Embed.embed().setDescription("已暫停"))
                }
            }
        } else {
            msg.channel.send(Embed.botnotinvoice(msg))
        }
    })
    commands.command(function resume(msg) {
        if (msg.member.voice.channel === null) {
            msg.channel.send(Embed.Notinvoie(msg))
            return
        }
        if (Object.keys(Guilds).includes(msg.guild.id)) {
            if (!Guilds[msg.guild.id].sw) {
                msg.channel.send(Embed.embed().setDescription("已經在播放了優~~"))
            } else if (!Guilds[msg.guild.id].resumew(msg.member.voice.channel.id)) msg.channel.send(Embed.Notvoicrasme(msg));
        } else {
            msg.channel.send(Embed.botnotinvoice(msg))
        }
    })
    commands.command(function join(msg) {
        if (msg.member.voice.channel === null) {
            msg.channel.send(Embed.Notinvoie(msg))
            return
        }
        if (!Object.keys(Guilds).includes(msg.guild.id)) {
            let pl = new PlayList(msg.member.voice.channel.id)
            Guilds[msg.guild.id] = pl
            player.AddPlayer(msg.member.voice.channel, pl)
        }
    })
    commands.command(function nowplay(msg) {
        if (msg.member.voice.channel === null) {
            msg.channel.send(Embed.Notinvoie(msg))
            return
        }
        if (Object.keys(Guilds).includes(msg.guild.id)) {
            if (msg.member.voice.channel.id !== Guilds[msg.guild.id].id) {
                msg.channel.send(Embed.Notvoicrasme(msg));
                return
            } else {
                if (Guilds[msg.guild.id].nowplay !== null) {
                    Guilds[msg.guild.id].nowpalytime(msg, Guilds[msg.guild.id])
                } else {
                    msg.channel.send(Embed.embed().setDescription("沒有再播放歌曲優~"))
                }
            }
        } else {
            msg.channel.send(Embed.botnotinvoice(msg))
        }
    })
    commands.command(function queue(msg) {
            if (msg.member.voice.channel === null) {
                msg.channel.send(Embed.Notinvoie(msg))
                return
            }

            if (Object.keys(Guilds).includes(msg.guild.id)) {
                if (msg.member.voice.channel.id !== Guilds[msg.guild.id].id) {
                    msg.channel.send(Embed.Notvoicrasme(msg));
                    return
                } else {
                    if (Guilds[msg.guild.id].songlist.length !== 0) {
                        let text = ""
                        let w = 1
                        for (let i of Guilds[msg.guild.id].songlist) {
                            text += `${w}.[${i.title}](${i.url})\n`
                            w += 1
                        }
                        msg.channel.send(Embed.embed().setDescription(text))
                    } else {
                        msg.channel.send(Embed.embed().setDescription("沒有歌摟~"))
                    }
                }
            } else {
                msg.channel.send(Embed.botnotinvoice(msg))
            }
        })
        //bot.AddCog(commands)

}