import http from 'http'
import fs from 'fs'
import path from 'path'

const ROOT = '/Users/hsin/Documents/Coding/ascend-doc/.vitepress/dist-static'
const PORT = 5301
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
}

// Injected into every HTML <head>
const HEAD_INJECT =
  '<link rel="stylesheet" href="/ascend-theme.css">' +
  '<script defer src="/ascend-sidebar-search.js"></script>'

// Patch VP_SITE_DATA to add logo
function patchSiteData(html) {
  return html.replace(
    'themeConfig\\":{\\"nav\\"',
    'themeConfig\\":{\\"logo\\":\\"/Ascendlogo.svg\\",\\"nav\\"'
  )
}

function serveHtml(filePath, res) {
  let html = fs.readFileSync(filePath, 'utf-8')
  // inject into <head>
  html = html.replace('</head>', HEAD_INJECT + '</head>')
  // patch logo into VP_SITE_DATA
  html = patchSiteData(html)
  res.setHeader('Content-Type', MIME['.html'])
  res.setHeader('Cache-Control', 'no-store')
  res.end(html)
}

http.createServer((req, res) => {
  let url = req.url.split('?')[0]
  let decoded
  try { decoded = decodeURIComponent(url) } catch { decoded = url }

  let file = path.join(ROOT, decoded)

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const html = file.endsWith('.html') ? file : file + '.html'
    file = fs.existsSync(html) ? html : path.join(ROOT, 'index.html')
  }

  const ext = path.extname(file)

  if (ext === '.html') {
    try { serveHtml(file, res) } catch { res.writeHead(404); res.end('Not found') }
    return
  }

  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  fs.createReadStream(file).pipe(res).on('error', () => {
    res.writeHead(404); res.end('Not found')
  })
}).listen(PORT, () => console.log('Themed: http://localhost:' + PORT))
