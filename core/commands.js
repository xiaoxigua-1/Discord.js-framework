const tasks = require("./tasks")
const CommandError = require("./commandserror")
class command {
    constructor(fun, name, aliases, help, brief) {
        this.fun = fun;
        this.name = name
        this.aliases = aliases
        this.help = help
        this.brief = brief
    }
    Run() {
        let co = {}
        co[this.name] = this.fun
        if (this.aliases === null) {
            return co
        }
        for (let i of this.aliases) {
            co[i] = this.fun
        }
        return co
    }
    error(fun) {
        let fune = this.fun
        this.fun = async function(msg, ...x) {
            try {
                await fune(msg, ...x)
            } catch (error) {
                fun(msg, error)
            }
        }
    }
}
class Group {
    constructor(fun, name, aliases, help, brief) {
        this.fun = fun;
        this.name = name
        this.aliases = aliases
        this.help = help
        this.brief = brief
        this.groupcommands = {}
        this.commandslist = []
        this.errorfun = async function(msg, error) {};
    }
    command(fun, dict = null) {
        dict = dict || {}
        dict.name = dict.name || null;
        dict.aliases = dict.aliases || null;
        dict.help = dict.help || null;
        dict.brief = dict.brief || null;
        if (dict.name === null) {
            dict.name = fun.name
        }
        let commandw = new command(fun, dict.name, dict.aliases, dict.help, dict.brief)
        this.commandslist.push(commandw)
        return commandw

    }
    Run() {
        let fuf = this.fun
        for (let i of this.commandslist) {
            Object.assign(this.groupcommands, i.Run())
        }
        let ww = this.groupcommands
        let pp = this.errorfun
        let commandee = new command(async function(msg, ...x) {
            try {
                if (x.length === 0) {
                    await fuf(msg, ...x)
                } else {
                    await fuf(msg, ...x)
                    let w = x.shift()
                    if (Object.keys(ww).includes(w)) {
                        ww[w](msg, ...x)
                    } else {
                        throw new CommandError(`Not command is ${w}`, "Commands.Error.GroupNotCommand")
                    }
                }
            } catch (error) {
                await pp(msg, error)
            }
        }, this.name, this.aliases, this.help, this.brief)
        return commandee.Run()
    }
    error(fun) {
        this.errorfun = fun
    }
}
class Commands {
    commands = {}
    event = []
    commandlist = []
    grouplist = []
    constructor(bot, name = null) {
        this.bot = bot
        this.tasks = new tasks(bot)
        if (name !== null) {
            this.name = name
        } else {
            this.name = this.constructor.name
        }
    }
    command(fun, dict = null) {
        if (fun.name !== null) {
            let commandw
            dict = dict || {}
            dict.name = dict.name || null;
            dict.aliases = dict.aliases || null;
            dict.help = dict.help || null;
            dict.brief = dict.brief || null;

            if (dict.name !== null) {
                commandw = new command(fun, dict.name, dict.aliases, dict.help, dict.brief)
            } else {
                commandw = new command(fun, fun.name, dict.aliases, dict.help, dict.brief)
            }
            this.commandlist.push(commandw)
            return commandw
        }
    }
    commandsreturn() {
        for (let i of this.commandlist) {
            Object.assign(this.commands, i.Run())
        }
        return this.commands
    }
    listener(fun) {
        this.event.push(fun)
    }
    eventretuen() {
        return this.event
    }
    cogreturn() {
        return this.commandlist
    }
    group(fun, dict = null) {
        dict = dict || {}
        dict.name = dict.name || null;
        dict.aliases = dict.aliases || null;
        dict.help = dict.help || null;
        dict.brief = dict.brief || null;
        if (dict.name === null) {
            dict.name = fun.name
        }
        if (fun.name !== null) {
            let group = new Group(fun, dict.name, dict.aliases, dict.help, dict.brief)
            this.commandlist.push(group)
            this.grouplist.push(group)
            return group
        }
    }
    groupreturn() {
        for (let i of this.grouplist) {
            return i.Run()
        }
    }

    is_owner(message) { //是不是作者
        if (Number(message.author.id) !== this.bot.owner) {
            throw new CommandError("You are not the owner.", "Commands.Error.owner")
        }
    }
    has_any_role(message, ...a) {
        for (eqw of message.member.roles.cache) {
            if (a.includes(Number(eqw[0])) || a.includes(eqw[1].name)) {
                return
            }
        }
        throw new CommandError("You are not the role.", "Commands.Error.role")
    }
    is_guild_owner(message) {
        if (message.guild.owner !== message.member.id) {
            throw new CommandError("You are not guild owner.", "Commands.Error.guild_owner")
        }
    }
}

module.exports = Commands