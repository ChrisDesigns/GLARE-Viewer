import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import packageJson from './package.json'

export default {
    input: 'src/index.js',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'react-is': ['isForwardRef', 'isValidElementType'],
            },
        }),
        resolve(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        })
    ],
}