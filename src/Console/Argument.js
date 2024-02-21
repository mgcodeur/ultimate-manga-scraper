export class Argument {
    #args;

    constructor(args) {
        this.#args = args;
        this.getParams = this.getParams.bind(this);
        this.hasArgument = this.hasArgument.bind(this);
    }

    static fromProcess() {
        return new Argument(process.argv.slice(2));
    }

    hasArgument() {
        return this.#args.length > 0;
    }

    getParams(flagName) {
        const flag = this.#args.find(arg => arg.startsWith(`--${flagName}`));
        return flag ? flag.split('=')[1] : null;
    }
}