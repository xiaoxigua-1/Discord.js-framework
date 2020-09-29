const Commands = require("../core/classes.js")
class w extends Commands {

}

module.exports = function setup(bot) {
    commands = new w(bot)

    //指令寫法
    commands.command(function w(msg, ...text) {
        //commands.bot等於bot or client
        msg.channel.send(text.join(" "))

    })


    commands.command(function e(msg) {
        return commands.bot
    })



    bot.AddCog(commands)
}