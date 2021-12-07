const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    rollup(config, options) {
        config.plugins = config.plugins.map(p =>
            p.name === 'replace'
                ? replace({
                      'process.env.NODE_ENV': JSON.stringify(options.env),
                      preventAssignment: true,
                  })
                : p
        );
        config.plugins.push(
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                ],
                inject: false,
                extract: 'cursor-chat.min.css',
            })
        );
        return config;
    },
};
