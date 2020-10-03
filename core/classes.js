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
}
class Group {
    constructor(fun, name, aliases, help, brief) {
        this.fun = fun;
        this.name = name
        this.aliases = aliases
        this.help = help
        this.brief = brief
        this.groupcommands = {}
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
        Object.assign(this.groupcommands, commandw.Run())
    }
    Run() {
        let fuf = this.fun
        let ww = this.groupcommands
        let commandee = new command(function(msg, ...x) {
            if (x.length === 0) {
                fuf(msg, ...x)
            } else {
                fuf(msg, ...x)
                let w = x.shift()
                if (Object.keys(ww).includes(w)) {
                    ww[w](msg, ...x)
                }
            }
        }, this.name, this.aliases, this.help, this.brief)
        return commandee.Run()
    }
}
class CommandErroe extends Error {
    constructor(w, errorname) {
        super(w)
        this.name = errorname
    }

}
class Commands {
    commands = {}
    event = []
    commandlist = []
    grouplist = []
    constructor(bot, name = null) {
        this.bot = bot
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
                this.commands[dict.name] = fun
                commandw = new command(fun, dict.name, dict.aliases, dict.help, dict.brief)
            } else {
                this.commands[fun.name] = fun
                commandw = new command(fun, fun.name, dict.aliases, dict.help, dict.brief)
            }
            Object.assign(this.commands, commandw.Run())
            this.commandlist.push(commandw)
            return fun
        }
    }
    commandsreturn() {
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
            throw new CommandErroe("You are not the owner.", "Commands")
        }
    }
    has_any_role(message, ...a) {
        for (eqw of message.member.roles.cache) {
            if (a.includes(Number(eqw[0])) || a.includes(eqw[1].name)) {
                return
            }
        }
        throw new CommandErroe("You are not the role.", "Commands")
    }
    is_guild_owner(message) {
        if (message.guild.owner !== message.member.id) {
            throw new CommandErroe("You are not guild owner.", "Commands")
        }
    }
}

module.exports = Commands