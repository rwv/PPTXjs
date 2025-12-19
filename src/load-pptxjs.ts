import pptxjsCss from '../css/pptxjs.css?url'
import nvD3MinCss from 'nvd3/build/nv.d3.min.css?url'
import jqueryMinJs from 'jquery/dist/jquery.min.js?url'
import jqueryFullscreenJs from 'jquery-fullscreen-plugin/jquery.fullscreen-min.js?url'
import jszipMinJs from 'jszip/dist/jszip.min.js?url'
import jszipUtilsJs from 'jszip-utils/dist/jszip-utils.min.js?url'
import d3MinJs from 'd3/d3.min.js?url'
import nvD3MinJs from 'nvd3/build/nv.d3.min.js?url'
import tinyColorJs from '../node_modules/tinycolor2/dist/tinycolor-min.js?url'
import dingbatJs from '../js/dingbat.js?url'
import pptxjsJs from '../js-original/pptxjs.js?url'
import divs2slidesJs from '../js-original/divs2slides.js?url'

export async function loadPPTXjs(document: Document) {
  // Load CSS files
  const link1 = document.createElement('link')
  link1.href = pptxjsCss
  link1.rel = 'stylesheet'
  document.head.appendChild(link1)

  const link2 = document.createElement('link')
  link2.href = nvD3MinCss
  link2.rel = 'stylesheet'
  document.head.appendChild(link2)

  await Promise.all([
    new Promise((resolve) => link1.addEventListener('load', () => resolve(void 0))),
    new Promise((resolve) => link2.addEventListener('load', () => resolve(void 0)))
  ])

  // Load JavaScript files in sequential order (important for dependencies)
  const scripts = [
    jqueryMinJs,
    jqueryFullscreenJs,
    jszipMinJs,
    jszipUtilsJs,
    d3MinJs,
    nvD3MinJs,
    tinyColorJs,
    dingbatJs,
    pptxjsJs,
    divs2slidesJs
  ]

  // Load scripts sequentially
  for (const scriptSrc of scripts) {
    await new Promise<void>((resolve) => {
      const scriptEl = document.createElement('script')
      scriptEl.src = scriptSrc
      document.body.appendChild(scriptEl)
      scriptEl.addEventListener('load', () => resolve())
    })
  }
}
