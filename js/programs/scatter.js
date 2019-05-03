import { Program } from './program';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

class Scatter extends Program {

    network = {
        blockchain:'eos',
        chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        host:'nodes.get-scatter.com',
        port:443,
        protocol:'https'
    };

    login(args) {
        let self = this;
        this.queueString(`Logging in...`);
        this.start();
        let timedOut = false;

        ScatterJS.scatter.connect('Ebonhaven', this.network ).then(connected => {
            if(!connected) return false;
            // ScatterJS.someMethod();
            const scatter = ScatterJS.scatter;
            const requiredFields = { accounts: [this.network] };
            let login = this.timedPromise(5000, this.getIdentity(scatter));
            login.then(() => {
                const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
                console.log(account);
                this.queueString(`done`);
                this.queueFunction(this.complete, self);
                this.start();
            });
            login.catch((error) => {
                this.queueString(`error. Try again`);
                this.queueFunction(this.complete, self);
                this.start();
            });
        });
    };

    getIdentity(scatter) {
        const requiredFields = { accounts: [this.network] };
        return new Promise((resolve, reject) => {
            scatter.getIdentity(requiredFields).then(() => {
                resolve();
            }, (error) => {
                reject(error);
                
            });
        });
    }

    logout(args) {
        let self = this;
        ScatterJS.scatter.connect('Ebonhaven', this.network ).then(connected => {
            if(!connected) return false;
            // ScatterJS.someMethod();
            ScatterJS.scatter.forgetIdentity();
            this.queueString(`You've been logged out`);
            this.queueFunction(this.complete, self);
            this.start();
        });
    }

    timeout = (ms, promise) => {
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {

            }, ms);
        })
    }

}

export { Scatter };