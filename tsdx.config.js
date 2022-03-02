const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');

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
                    postcssImport(),
                ],
                inject: false,
                include: '**/dark.css',
                extract: 'dark.css',
            })
        );
        config.plugins.push(
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                    postcssImport(),
                ],
                inject: false,
                include: '**/light.css',
                extract: 'light.css',
            })
        );
        return config;
    },
};
