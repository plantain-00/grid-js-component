module.exports = {
  build: [
    `rimraf dist`,
    `rimraf demo/**/index.bundle-*.js`,
    `file2variable-cli src/vue-grid.template.html -o src/vue-variables.ts --html-minify --base src`,
    `tsc -p src`,
    `tsc -p demo`,
    `lessc src/grid.less > dist/grid.css`,
    `lessc demo/common.less > demo/common.css`,
    `cleancss -o dist/grid.min.css dist/grid.css ./node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.css`,
    `cleancss -o demo/index.bundle.css dist/grid.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css demo/common.css`,
    `webpack --config demo/webpack.config.js`,
    `rev-static --config demo/rev-static.config.js`
  ],
  lint: [
    `tslint "src/*.ts" "src/*.tsx" "demo/**/*.ts" "demo/**/*.tsx"`,
    `standard "**/*.config.js"`,
    `stylelint "src/*.less" "demo/*.less" --syntax less`
  ],
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: [
    `standard --fix "**/*.config.js"`
  ],
  release: [
    `clean-release`
  ]
}
