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
    command(fun, name = null, aliases = null, help = null, brief = null) {
        let commandw = new command(fun, fun.name, aliases, help, brief)
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
                if (Object.keys(w).includes(w)) {
                    ww[w](msg, ...x)
                }
            }

        }, this.name, this.aliases, this.help, this.brief)
        return commandee.Run()
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
    Run() {
        //console.log(this.bot)
        //console.log(commands.commands)
    }

    command(fun, aliases = null, help = null, brief = null) {
        if (fun.name !== null) {
            this.commands[fun.name] = fun
            let commandw = new command(fun, fun.name, aliases, help, brief)
            Object.assign(this.commands, commandw.Run())
            this.commandlist.push(commandw)
            return fun
        }
    }
    commandsreturn() {
        return commands.commands
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
    group(fun, aliases = null, help = null, brief = null) {
        if (fun.name !== null) {
            let group = new Group(fun, fun.name, aliases, help, brief)
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
        if (Number(message.author.id) !== owner) {
            throw new Error("You are not the owner.")
        }
    }
    has_any_role(message, ...a) {
        for (eqw of message.member.roles.cache) {
            if (a.includes(Number(eqw[0])) || a.includes(eqw[1].name)) {
                return
            }
        }
        throw new Error("You are not the role.")
    }
}

module.exports = Commands