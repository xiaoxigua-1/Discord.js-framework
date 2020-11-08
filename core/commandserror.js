class CommandErroe extends Error {
    constructor(w, errorname) {
        super(w)
        this.name = errorname
    }

}
module.exports = CommandErroe