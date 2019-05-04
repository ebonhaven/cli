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

        ScatterJS.scatter.connect('Ebonhaven', this.network ).then(connected => {
            if(!connected) {
                this.errorHandler();
                return false;
            }
            // ScatterJS.someMethod();
            const scatter = ScatterJS.scatter;
            let login = this.timedPromise(5000, this.getIdentity(scatter));
            login.then(() => {
                const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
                console.log(account);
                this.queueString(`done. ${account.name} connected`);
                this.queueFunction(this.loginSuccess, self);
                this.start();
            });
            login.catch((error) => {
                this.queueString(`error. Timed out`);
                this.queueFunction(this.complete, self);
                this.start();
            });
        }, (error) => {
            this.errorHandler();
        });
    };

    loginSuccess() {
        process.stdout.emit('login-success');
    }

    errorHandler() {
        this.queueString(`error. Couldn't connect`);
        this.queueFunction(this.complete, self);
        this.start();
    }

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
        this.queueString(`Logging out...`);
        this.start();
        ScatterJS.scatter.connect('Ebonhaven', this.network ).then(connected => {
            if(!connected) {
                this.errorHandler();
                return false;
            } 
            // ScatterJS.someMethod();
            ScatterJS.scatter.forgetIdentity();
            this.queueString(`done. Logged out`);
            this.queueFunction(this.complete, self);
            this.start();
        }, (error) => {
            this.errorHandler();
        });
    }
}

export { Scatter };