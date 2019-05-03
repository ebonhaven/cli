import * as inquirer from 'inquirer';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
ScatterJS.plugins( new ScatterEOS() );

const Chalk = require('chalk');
let options = { enabled: true, level: 2 };
const chalk = new Chalk.constructor(options);

const network = {
    blockchain:'eos',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https'
};

const help = (args) => {
    process.stdout.write(chalk.hex('#CAEBF2')(`Available comands: help, login, logout`));
    process.stdout.emit('complete');
};

const cmd = (args) => {
    console.log(args); 
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is your characters name?'
    }).then(answers => {
        console.log(answers);
        process.stdout.emit('complete');
    });
};

const login = () => {
    process.stdout.write(chalk.hex('#CAEBF2')(`Logging in...`));
    ScatterJS.scatter.connect('Ebonhaven', network ).then(connected => {
        if(!connected) return false;
        // ScatterJS.someMethod();
        const scatter = ScatterJS.scatter;
        const requiredFields = { accounts: [network] };
        scatter.getIdentity(requiredFields).then(() => {
            const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
            console.log(account);
            process.stdout.write(chalk.hex('#CAEBF2')(`done`));
            process.stdout.emit('complete');
        }, (error) => {
            process.stdout.write(chalk.hex('#CAEBF2')(`error. Rejected identity request`));
            process.stdout.emit('complete');
        });
    });    
}

const logout = () => {
    ScatterJS.scatter.connect('Ebonhaven', network ).then(connected => {
        if(!connected) return false;
        // ScatterJS.someMethod();
        ScatterJS.scatter.forgetIdentity();
        process.stdout.write(chalk.hex('#CAEBF2')(`You've been logged out`));
        process.stdout.emit('complete');
    });
}

module.exports = {
    help,
    login,
    logout,
    cmd
}