class tasks {
    constructor(bot) {
        this.bot = bot
        this.tasklist = []
    }
    sleep(s) {
        return new Promise(function(resolve) {
            setTimeout(resolve, s);
        });
    };
    task(fun, time, nember) {
        let bot = this.bot
        let sleep = this.sleep
        async function task_loop() {
            try {
                let w = 0
                while (bot.token !== null) {
                    if (nember !== null && nember <= w) break
                    fun()
                    await sleep(time)
                    w++
                }
            } catch (e) {
                bot.CommandsError(null, e)
            }

        }
        return task_loop
    }
    loop(fun, time, nember = null) {
        this.tasklist.push(this.task(fun, time, nember))
    }
    run() {
        for (let i of this.tasklist) {
            i()
        }
    }
}
module.exports = tasks