import raf from 'raf';
const Chalk = require('chalk');
let options = { enabled: true, level: 2 };
const chalk = new Chalk.constructor(options);

class Program {

    eventNames = {
        WRITE_CHARACTER: 'WRITE_CHARACTER',
        PAUSE_FOR: 'PAUSE_FOR',
        CALL_FUNCTION: 'CALL_FUNCTION'
    };

    state = {
        lastFrameTime: null,
        eventLoopPaused: null,
        pauseUntil: null,
        eventQueue: [],
        eventLoop: null,
    };

    options = {
        delayMin: 1,
        delayMax: 4
    };

    queueString(string) {
        const characters = string.split('');
        characters.forEach((c) => {
            this.addEventToQueue(this.eventNames.WRITE_CHARACTER, { character: c });
        });
    }

    queueFunction(callback, args) {
        this.addEventToQueue(this.eventNames.CALL_FUNCTION, { callback: callback, thisArg: args });
    }

    queuePause(ms = 'natural') {
        if (ms == 'natural') {
            ms = this.getRandomInteger(650, 780);
        }
        this.addEventToQueue(this.eventNames.PAUSE_FOR, { ms: ms });
    }

    addEventToQueue(eventName, eventArgs) {
        const eventItem = {
            eventName,
            eventArgs: eventArgs || {}
        };

        this.state.eventQueue = [
            ...this.state.eventQueue,
            eventItem
        ];
    }

    runEventLoop = () => {
        if (!this.state.lastFrameTime) {
            this.state.lastFrameTime = Date.now();
        }

        const nowTime = Date.now();
        const delta = nowTime - this.state.lastFrameTime;

        if (!this.state.eventQueue.length) {
            return;
        }

        this.state.eventLoop = raf(this.runEventLoop);

        if (this.state.eventLoopPaused) {
            return;
        }

        if (this.state.pauseUntil) {
            if (nowTime < this.state.pauseUntil) {
                return;
            }

            this.state.pauseUntil = null;
        }

        const queue = [...this.state.eventQueue];
        const curEvent = queue.shift();

        if (delta <= this.getRandomInteger(this.options.delayMin, this.options.delayMax)) {
            return;
        }

        const { eventName, eventArgs } = curEvent;

        switch (eventName) {
            case this.eventNames.WRITE_CHARACTER:
                const { character } = eventArgs;
                process.stdout.write(chalk.hex('#CAEBF2')(`${character}`));
                break;
            case this.eventNames.PAUSE_FOR:
                const { ms } = eventArgs;
                this.state.pauseUntil = Date.now() + parseInt(ms);
                break;
            case this.eventNames.CALL_FUNCTION:
                const { callback, thisArg } = eventArgs;
                callback.call(thisArg);
                break;
        }

        this.state.eventQueue = queue;

        this.state.lastFrameTime = nowTime;
    }

    start() {
        this.runEventLoop();
    }

    complete() {
        process.stdout.emit('complete');
    }

    timedPromise = (ms, promise) => {
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject(`Timed out in ${ms}ms.`);
            }, ms);
        })

        return Promise.race([
            promise,
            timeout
        ]);
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export { Program };