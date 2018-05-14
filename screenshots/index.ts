import * as puppeteer from 'puppeteer'

(async() => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })

  const cases = [
        { type: 'vue', url: '/packages/vue/demo' },
        { type: 'react', url: '/packages/react/demo' }
  ]

  for (const { type, url } of cases) {
    await page.goto(`http://localhost:8000${url}`)
    await page.waitFor(500)
    await page.screenshot({ path: `screenshots/${type}-initial.png` })
  }

  browser.close()
})()
