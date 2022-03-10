const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const prettier = require('prettier')

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
                include: '**/hairy-green.css',
                extract: 'hairy-green.css',
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
                include: '**/apricot-yellow.css',
                extract: 'apricot-yellow.css',
            })
        );
        config.plugins.push(
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano ({
                        preset:'default'
                    }),
                    postcssImport(),
                    prettier({
                        printWidth: 80,
                        trailingComma: 'es5',
                        singleQuote: true,
                        parser: 'typescript',
                        semi: false,
                        tabWidth: 4,
                        useTabs: false,

                    }) 
                ],
                inject: false,
                include: '**/dracula.css',
                extract:'dracula.css'
            })
        )

        return config;
    },
};
