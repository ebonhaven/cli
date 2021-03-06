module.exports = {
    createInterface({ input, output }) {
        // so we don't redefine these properties
        if (input.readlineified) {
            return input;
        }
        // normally, input and output should be equal to the same xterm.Terminal instance
        input.input = input;
        input.output = input;
        input.output.mute = function () {};
        input.output.unmute = function () {};
        input.output.end = function () {};
        input.pause = function () {};
        input.resume = function () {};
        input.close = function () {};
        input.setPrompt = function () {};
        input._getCursorPos = function () {
            return {
                cols: 0,
                rows: input.rows + 2
            };
        };
        input.removeListener = input.off.bind(input);
  
        Object.defineProperty(input, 'line', {
            get: function () {
                return term.command;
            }
        });
        input.readlineified = true;
        return input;
    }
  };