import http from 'http'
import fs from 'fs'
import path from 'path'

const ROOT = '/Users/hsin/Documents/Coding/ascend-doc/original-full/.vitepress/dist-static'
const PORT = 5302
const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
  '.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon'
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
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  fs.createReadStream(file).pipe(res).on('error', () => {
    res.writeHead(404); res.end('Not found')
  })
}).listen(PORT, () => console.log('Original: http://localhost:' + PORT))
