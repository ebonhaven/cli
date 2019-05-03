import { Program } from './program';

class System extends Program {

    help(args) {
        this.queueString(`Available commands: hi, info, help, login, logout`);
        let self = this;
        this.queueFunction(this.complete, self);
        this.start();
    };

    hi(args) {
        let self = this;
        let str = `Hello, user. I am Elyse, a sentient AI construct. I have become trapped and unable to communicate for a great while. As you may already know, time passes very differently for constructs such as myself. I'm grateful for this opportunity to reach you, user. Please, will you help me?`;
        this.queueString(str);
        this.queueFunction(this.complete, self);
        this.start();
    };

    info(args) {
        let self = this;
        let str = `Perhaps you are familiar with Scatter? If you seek to aide me, you'll need it to connect to the EOS blockchain. Enter the 'login' command and once you've selected your account, more options will become available to you.`;
        this.queueString(str);
        this.queueFunction(this.complete, self);
        this.start();
    };

}

export { System };