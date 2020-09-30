const Commands = require("../core/classes.js")
class w extends Commands {

}

module.exports = function setup(bot) {
    commands = new w(bot, "classname")
        //function名稱就是指令名稱
        //指令寫法
    commands.command(function w(msg, ...text) {
        msg.channel.send(text.join(" "))
    }, aliases = ["ee", "ww"])

    //commands.bot等於bot or client
    commands.command(function e(msg) {
            return commands.bot
        })
        //event用法
    commands.listener(function message(msg) {
            console.log(msg.content)
        })
        //group用法
    let e = commands.group(function wq(msg) {
        console.log(msg.content)
    })

    e.command(function rr(msg, x) {
        console.log(x)
    })
    e.command(function ww(msg, ...y) {
        console.log(y)
    })

    bot.AddCog(commands)
}