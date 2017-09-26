const childProcess = require('child_process')
const util = require('util')

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
    `rev-static --config demo/rev-static.config.js`,
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const beautify = require('js-beautify').html
      const parse5 = require('parse5')
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })
      for (const type of ['vue', 'react']) {
        await page.goto(`http://localhost:8000/demo/${type}`)
        await page.screenshot({ path: `demo/${type}/screenshot.png`, fullPage: true })
        const content = await page.content()
        const document = parse5.parse(content)
        forEach(document, node => {
          if (node.attrs) {
            const attr = node.attrs.find(a => a.name === 'data-ps-id')
            if (attr) {
              attr.value = '[data-ps-id]'
            }
          }
        })
        fs.writeFileSync(`demo/${type}/screenshot-src.html`, beautify(parse5.serialize(document)))
      }
      server.close()
      browser.close()
    }
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
    'git checkout demo/vue/screenshot.png',
    'git checkout demo/react/screenshot.png',
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
  }
}

function forEach (node, callback) {
  callback(node)
  if (node.childNodes) {
    for (const childNode of node.childNodes) {
      forEach(childNode, callback)
    }
  }
}
