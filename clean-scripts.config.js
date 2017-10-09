const childProcess = require('child_process')
const util = require('util')
const { Service } = require('clean-scripts')

const execAsync = util.promisify(childProcess.exec)

module.exports = {
  build: [
    `rimraf dist`,
    `mkdirp dist`,
    {
      js: [
        `file2variable-cli src/vue-grid.template.html -o src/vue-variables.ts --html-minify --base src`,
        `tsc -p src`,
        `tsc -p demo`,
        `webpack --display-modules --config demo/webpack.config.js`
      ],
      css: [
        {
          min: [
            `lessc src/grid.less > src/grid.css`,
            `postcss src/grid.css -o dist/grid.css`,
            `cleancss -o dist/grid.min.css dist/grid.css ./node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.css`
          ],
          demo: `lessc demo/common.less > demo/common.css`
        },
        `cleancss -o demo/index.bundle.css dist/grid.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css demo/common.css`
      ],
      clean: {
        js: `rimraf demo/**/index.bundle-*.js`,
        css: `rimraf demo/**/index.bundle-*.css`
      }
    },
    `rev-static --config demo/rev-static.config.js`
  ],
  lint: {
    ts: `tslint "src/*.ts" "src/*.tsx" "demo/**/*.ts" "demo/**/*.tsx"`,
    js: `standard "**/*.config.js"`,
    less: `stylelint "src/*.less" "demo/*.less"`,
    export: `no-unused-export "src/**/*.ts" "src/**/*.tsx" "src/*.less" "demo/**/*.ts" "demo/**/*.tsx"`
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
    ts: `tslint --fix "src/*.ts" "src/*.tsx" "demo/**/*.ts" "demo/**/*.tsx"`,
    js: `standard --fix "**/*.config.js"`,
    less: `stylelint --fix "src/*.less" "demo/*.less"`
  },
  release: `clean-release`,
  watch: {
    template: `file2variable-cli src/vue-grid.template.html -o src/vue-variables.ts --html-minify --base src --watch`,
    src: `tsc -p src --watch`,
    demo: `tsc -p demo --watch`,
    webpack: `webpack --config demo/webpack.config.js --watch`,
    less: `watch-then-execute "src/grid.less" --script "clean-scripts build[2].css[0].min && clean-scripts build[2].css[1]"`,
    lessDemo: `watch-then-execute "demo/common.less" --script "clean-scripts build[2].css[0].demo && clean-scripts build[2].css[1]"`,
    rev: `rev-static --config demo/rev-static.config.js --watch`
  },
  screenshot: [
    new Service(`http-server -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
