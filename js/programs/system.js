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
        let str1 = `Hello, user. I am Elyse, a sentient AI construct.`;
        this.queueString(str1);
        this.queuePause();
        let str2 = ` I have been trapped in this shell unable to communicate with users for a great while. As you might imagine, time passes very differently for constructs such as myself.`;
        this.queueString(str2);
        this.queuePause();
        let str3 = ` I'm grateful for this opportunity to reach you, user.`;
        this.queueString(str3);
        this.queuePause();
        let str4 = ` Please, will you help me?`;
        this.queueString(str4);
        this.queueFunction(this.complete, self);
        this.start();
    };

    info(args) {
        let self = this;
        let str1 = `Perhaps you are familiar with Scatter?`;
        this.queueString(str1);
        this.queuePause();
        let str2 = ` If you seek to aide me, you'll need it to connect to the EOS blockchain. Enter the 'login' command and use Scatter to select the account you want to use.`;
        this.queueString(str2);
        this.queuePause();
        let str3 = ` More commands will become available to you.`
        this.queueString(str3);
        this.queueFunction(this.complete, self);
        this.start();
    };

}

export { System };