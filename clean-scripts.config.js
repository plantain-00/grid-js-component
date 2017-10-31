const { Service, execAsync, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"src/**/*.ts" "src/**/*.tsx" "spec/**/*.ts" "demo/**/*.ts" "demo/**/*.tsx" "screenshots/**/*.ts"`
const lessFiles = `"src/**/*.less"`
const jsFiles = `"*.config.js" "demo/*.config.js" "spec/**/*.config.js"`

const templateCommand = `file2variable-cli src/vue-grid.template.html -o src/vue-variables.ts --html-minify --base src`
const tscSrcCommand = `tsc -p src`
const tscDemoCommand = `tsc -p demo`
const webpackCommand = `webpack --display-modules --config demo/webpack.config.js`
const revStaticCommand = `rev-static --config demo/rev-static.config.js`

const srcCssCommand = [
  `lessc src/grid.less > src/grid.css`,
  `postcss src/grid.css -o dist/grid.css`,
  `cleancss -o dist/grid.min.css dist/grid.css ./node_modules/perfect-scrollbar/css/perfect-scrollbar.css`
]
const demoCssCommand = `lessc demo/common.less > demo/common.css`
const cleancssCommand = `cleancss -o demo/index.bundle.css dist/grid.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css demo/common.css`

module.exports = {
  build: [
    `rimraf dist`,
    `mkdirp dist`,
    {
      js: [
        templateCommand,
        tscSrcCommand,
        tscDemoCommand,
        webpackCommand
      ],
      css: [
        {
          src: srcCssCommand,
          demo: demoCssCommand
        },
        cleancssCommand
      ],
      clean: {
        js: `rimraf demo/**/index.bundle-*.js`,
        css: `rimraf demo/**/index.bundle-*.css`
      }
    },
    revStaticCommand
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --exclude "src/compiled/**/*"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  release: `clean-release`,
  watch: {
    template: `${templateCommand} --watch`,
    src: `${tscSrcCommand} --watch`,
    demo: `${tscDemoCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['src/grid.less'], [], () => executeScriptAsync([srcCssCommand, cleancssCommand])),
    lessDemo: () => watch(['demo/common.less'], [], () => executeScriptAsync([demoCssCommand, cleancssCommand])),
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
