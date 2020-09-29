function getAllMethodNames(obj) {
    let methods = new Set();
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj)
        keys.forEach((k) => methods.add(k));
    }
    return methods;
}
class Commands {
    commands = {}
    constructor(bot) {
        this.bot = bot
    }
    Run() {
        //console.log(this.bot)
        //console.log(commands.commands)
    }

    command(fun) {
        if (fun.name !== null) {
            this.commands[fun.name] = fun
            return fun
        }
    }
    commandsreturn() {
        return commands.commands
    }

}
module.exports = Commands