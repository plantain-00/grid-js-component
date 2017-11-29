const { Service, checkGitStatus, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"packages/@(core|vue|react|angular)/@(src|demo)/**/*.@(ts|tsx)" "spec/**/*.ts" "screenshots/**/*.ts"`
const lessFiles = `"packages/core/src/**/*.less" "packages/core/demo/**/*.less"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`
const excludeTsFiles = `"packages/@(core|vue|react|angular)/@(src|demo)/**/*.d.ts"`

const vueTemplateCommand = `file2variable-cli packages/vue/src/*.template.html -o packages/vue/src/variables.ts --html-minify --base packages/vue/src/`
const tscSrcCommand = [
  `tsc -p packages/core/src`,
  `tsc -p packages/vue/src`,
  `tsc -p packages/react/src`
]
const tscDemoCommand = [
  `tsc -p packages/core/demo`,
  `tsc -p packages/vue/demo`,
  `tsc -p packages/react/demo`
]
const webpackCommand = `webpack`
const revStaticCommand = `rev-static`
const cssCommand = [
  `lessc packages/core/src/grid.less -sm=on > packages/core/src/grid.css`,
  `postcss packages/core/src/grid.css -o packages/core/dist/grid.css`,
  `cleancss packages/core/dist/grid.css ./node_modules/perfect-scrollbar/css/perfect-scrollbar.css -o packages/core/dist/grid.min.css`,
  `lessc packages/core/demo/index.less -sm=on > packages/core/demo/index.css`,
  `cleancss packages/core/dist/grid.min.css packages/core/demo/index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css -o packages/core/demo/index.bundle.css`
]

module.exports = {
  build: [
    {
      js: [
        vueTemplateCommand,
        tscSrcCommand,
        tscDemoCommand,
        webpackCommand
      ],
      css: cssCommand,
      clean: `rimraf "packages/@(core|vue|react|angular)/demo/**/@(*.bundle-*.js|*.bundle-*.css)"`
    },
    revStaticCommand
  ],
  lint: {
    ts: `tslint ${tsFiles} --exclude ${excludeTsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --exclude ${excludeTsFiles}`,
    commit: `commitlint --from=HEAD~1`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    template: `${vueTemplateCommand} --watch`,
    src: `${tscSrcCommand} --watch`,
    demo: `${tscDemoCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['packages/core/src/*.less', 'packages/core/demo/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
