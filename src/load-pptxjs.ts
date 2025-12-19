/*
Required scripts and styles:
<link rel="stylesheet" href="./css/pptxjs.css">
<link rel="stylesheet" href="./css/nv.d3.min.css">
<script type="text/javascript" src="./js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="./js/jszip.min.js"></script>
<script type="text/javascript" src="./js/filereader.js"></script>
<script type="text/javascript" src="./js/d3.min.js"></script>
<script type="text/javascript" src="./js/nv.d3.min.js"></script>
<script type="text/javascript" src="./js/dingbat.js"></script>
<script type="text/javascript" src="./js/pptxjs.js"></script>
<script type="text/javascript" src="./js/divs2slides.js"></script>
*/

import pptxjsCss from '../css/pptxjs.css?url'
import nvD3MinCss from '../css/nv.d3.min.css?url'
import jqueryMinJs from '../js/jquery-1.11.3.min.js?url'
import jszipMinJs from '../js/jszip.min.js?url'
import filereaderJs from '../js/filereader.js?url'
import d3MinJs from '../js/d3.min.js?url'
import nvD3MinJs from '../js/nv.d3.min.js?url'
import dingbatJs from '../js/dingbat.js?url'
import pptxjsJs from '../js/pptxjs.js?url'
import divs2slidesJs from '../js/divs2slides.js?url'

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
    jszipMinJs,
    filereaderJs,
    d3MinJs,
    nvD3MinJs,
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
