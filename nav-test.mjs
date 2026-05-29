#!/usr/bin/env node
// 导航 Tab 来回切换冒烟测试：在同源 iframe 内驱动 SPA 点击顶部导航，
// 验证每次切换后页面正常渲染、不出现 404。
//
// 用法：先启动 `node serve.mjs`（端口 5301），再运行 `node nav-test.mjs`。
// 退出码 0 = 全部通过，1 = 有失败。

import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('.vitepress/dist-static')
const PORT = 5301
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const HARNESS = path.join(ROOT, '__navtest.html')

// 点击序列：首页 → 指南 → API → 首页 → 指南 → API（来回切两轮）
const harnessHtml = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<iframe id="f" src="/" style="width:1280px;height:860px;border:0"></iframe>
<script>
var steps = [
  {label:"home",  text:null},
  {label:"guide", text:"AscendC算子开发指南"},
  {label:"api",   text:"Ascend C API"},
  {label:"home2", text:"首页"},
  {label:"guide2",text:"AscendC算子开发指南"},
  {label:"api2",  text:"Ascend C API"}
];
var results = [];
var f = document.getElementById("f");
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function d(){return f.contentDocument}
function check(label, extra){
  var doc = d();
  var title = doc.title || "";
  var bodyTxt = (doc.body && doc.body.innerText) || "";
  var is404 = /404/.test(title) || /PAGE NOT FOUND/i.test(bodyTxt);
  var hasContent = !!(doc.querySelector(".VPHome") || doc.querySelector(".vp-doc h1"));
  results.push(label + "=" + (is404 ? "404" : (hasContent ? "OK" : "EMPTY")) + (extra||""));
}
async function run(){
  await wait(4000);                 // 初始首页加载
  for (var i=0;i<steps.length;i++){
    var s = steps[i];
    var extra = "";
    if (s.text){
      var links = Array.prototype.slice.call(d().querySelectorAll(".VPNavBarMenu a"));
      var a = links.filter(function(x){return x.textContent.trim().indexOf(s.text)>=0})[0];
      if (!a){ results.push(s.label+"=NOLINK"); continue; }
      extra = "[href=" + a.getAttribute("href") + "]";
      a.click();
      await wait(2800);             // 等 SPA 渲染
      extra += "[url=" + decodeURIComponent(d().location.pathname) + "]";
    }
    check(s.label, extra);
  }
  document.title = "RESULT " + results.join(" | ");
}
f.addEventListener("load", function(){ if(!window.__started){window.__started=1; run();} });
</script></body></html>`

fs.writeFileSync(HARNESS, harnessHtml)

execFile(CHROME, [
  '--headless=new', '--no-proxy-server', '--disable-gpu', '--hide-scrollbars',
  '--virtual-time-budget=30000', '--dump-dom',
  `http://localhost:${PORT}/__navtest.html`
], { maxBuffer: 64 * 1024 * 1024 }, (err, stdout) => {
  try { fs.unlinkSync(HARNESS) } catch {}
  const m = /<title>RESULT ([^<]*)<\/title>/.exec(stdout || '')
  if (!m) {
    console.error('FAIL: 没拿到测试结果（首页可能没渲染 / 超时）')
    process.exit(1)
  }
  const entries = m[1].split(' | ')
  let ok = true
  for (const e of entries) {
    const status = (e.split('[')[0].split('=')[1] || '').trim()
    const pass = status === 'OK'
    if (!pass) ok = false
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${e}`)
  }
  console.log(ok ? '\n✅ 所有 Tab 切换正常，无 404' : '\n❌ 有 Tab 切换失败')
  process.exit(ok ? 0 : 1)
})
