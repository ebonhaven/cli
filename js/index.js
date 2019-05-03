const Chalk = require('chalk');
let options = { enabled: true, level: 2 };
const chalk = new Chalk.constructor(options);

const fit = require('xterm/lib/addons/fit/fit');
const term = create();
initEvents();
addShims();
insert();

window.process = process;
window.term = term;
window.onresize = onResize;

function create() {
    const Terminal = require('xterm').Terminal;
    Terminal.applyAddon(fit);
    const term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontFamily: "monospace",
        fontSize: 16,
        lineHeight: 1.2,
        theme: {
            background: '#A9A9A9'
        }
    });

    term.newLine = function() {
        let value = term.command;
        term.command = '';
        this.emit('newline', { text: value });
    };

    term.command = '';

    

    return term;
}

function initEvents() {
    term.on('key', (key, ev) => {
        const isPrintable = (
            !ev.altKey && !ev.ctrlKey && !ev.metaKey
        );
        
        if (!process.running) {
            if (ev.ctrlKey && ev.key === 'l') {
                term.clear();
                return;
            }
    
            if (ev.key === "Enter") {
                term.newLine();
            } else if (ev.key === 'ArrowUp') {
                return;
            } else if (ev.key === 'ArrowDown') {
                return;
            } else if (ev.key === 'Backspace') {
                
                if (term.command.length > 0) {
                    term.write('\b \b');
                    term.command = term.command.slice(0, term.command.length - 1 );
                    term.cursorPosition--;
                }
                
                // if (term.command != '') {
                //     term.command = term.command.slice(0, term.command.length - 1 );
                //     term.write(term.command);
                // }
            } else if (isPrintable) {
                term.command += key;
                term.write(key);
            }
        }
        
    });

    term.on('newline', (line) => {
        if (!line) {
            return;
        }
        console.log(line);
        const recognizedCommands = ['help', 'login', 'logout', 'cmd'];
        
        let args = line.text.toLowerCase().split(/\s+/);
        let commands = [];
        for (let i = 0; i < args.length; i++) {
            if (recognizedCommands.indexOf(args[i]) > -1) {
                commands.push(args[i]);
            }
        }
        
        term.write('\r\n');
        if (commands.length == 0) {
            term.writeln(chalk.hex('#CAEBF2')('Unknown command: ' + line.text + '\n'));
            return;
        }

        let program = require('./programs')[commands[0]];
        program(args);
    });

    term.on('complete', () => {
        process.running = false;
        term.command = '';
        term.writeln('\n');
    });
}

function addShims() {
    process.running = false;
    term.isTTY = true;
    process.stdout = process.stdin = process.stderr = term;

    /*
     * Shim process.exit so calling it actually halts execution. Used in Commander
     */
    process.exit = () => {
        term.emit('line-processed');
        throw 'process.exit';
    };
    window.onerror = (n, o, p, e, error) => {
        if (error === 'process.exit') {
            console.log(error);
            return true;
        }
    };
    /*
     * Required for Inquirer.js
     */
    process.binding = (name) => {
        return (name === 'constants') ? require('constants') : {};
    };
    process.versions = {
        node: '8.10.0',
        v8: '6.2.414.50'
    };

    /*
     * for inquirer.js to show the choice selection pointer (list prompt) properly
     */
    process.platform = 'win32';

    /*
     * For inquirer.js to exit when Ctrl-C is pressed
     */
    process.kill = () => {
        process.running = false;
        term.writeln('');
        term.writeThenPrompt('');
    };
}

function insert() {
    const el = document.getElementById('terminal');
    term.open(el);
    term.fit();
    term.focus();
}

function onResize() {
    term.fit();
}