const browserify = require('browserify');

const options = {
    insertGlobals: true
};

if (process.argv.includes('--debug')) {
    options.debug = true;
}

browserify('js/index.js', options)
    .transform("babelify", { 
        presets: [
            "@babel/preset-env",
            "@babel/preset-react"
        ], 
        plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties"
        ]
    })
    .transform("aliasify", { aliases: {
            readline: './js/shims/readline.js',
            'iconv-lite': './node_modules/browserify/lib/_empty.js'
        },
        verbose: true,
        global: true
    })
    .bundle().pipe(process.stdout);