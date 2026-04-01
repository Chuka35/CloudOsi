import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

export const runtime = 'nodejs'

const BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0', '::1']

function isDomainBlocked(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return BLOCKED_DOMAINS.some(d => hostname === d || hostname.startsWith(d)) ||
      /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  } catch {
    return true
  }
}

const NAV_SCRIPT = `<script>(function(){
  function pn(u){try{window.parent.postMessage({type:'PROXY_NAVIGATE',url:u},'*')}catch(e){}}
  // Block all outbound link clicks — capture phase so we run before page JS
  document.addEventListener('click',function(e){
    var el=e.target;
    while(el&&el.tagName!=='A')el=el.parentElement;
    if(el&&el.href){
      try{
        var h=new URL(el.href,location.href).href;
        if(h.startsWith('http')){
          e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
          pn(h);
        }
      }catch(er){}
    }
  },true);
  // Block form submits
  document.addEventListener('submit',function(e){
    var f=e.target;
    if(f&&f.action){
      try{
        var a=new URL(f.action,location.href).href;
        if(a.startsWith('http')){
          e.preventDefault();e.stopImmediatePropagation();
          var d=new URLSearchParams(new FormData(f)).toString();
          pn((f.method||'').toLowerCase()==='post'?a:a+(a.includes('?')?'&':'?')+d);
        }
      }catch(er){}
    }
  },true);
  // Block window.open entirely
  window.open=function(u){if(u)pn(String(u));return null};
  // Intercept location assignments
  try{
    var _loc=window.location;
    ['assign','replace'].forEach(function(m){
      var orig=_loc[m].bind(_loc);
      _loc[m]=function(u){if(u&&String(u).startsWith('http'))pn(String(u));else orig(u);};
    });
  }catch(er){}
})();</script>`

export async function GET(req: NextRequest) {
  const queryToken = req.nextUrl.searchParams.get('token')
  if (queryToken) verifyToken(queryToken) // validate but don't block

  const targetUrl = req.nextUrl.searchParams.get('url')
  if (!targetUrl) return Response.json({ error: 'URL required' }, { status: 400 })

  let finalUrl = targetUrl
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = `https://${finalUrl}`
  }

  if (isDomainBlocked(finalUrl)) {
    return Response.json({ error: 'Domain not allowed' }, { status: 403 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      redirect: 'follow',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const contentType = response.headers.get('content-type') || 'text/html'
    const isHtml = contentType.includes('text/html')

    if (!isHtml) {
      const headers = new Headers({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      })
      return new Response(response.body, { status: response.status, headers })
    }

    const body = await response.text()
    const baseUrl = response.url || finalUrl

    // Inject base tag + nav intercept into <head> so they run before any page JS
    const baseTag = `<base href="${baseUrl}">`
    const headInject = baseTag + NAV_SCRIPT
    let html = body
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${headInject}`)
    } else if (/<html/i.test(html)) {
      html = html.replace(/(<html[^>]*>)/i, `$1<head>${headInject}</head>`)
    } else {
      html = headInject + html
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src * blob: data: 'unsafe-inline' 'unsafe-eval'; frame-ancestors *",
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
      },
    })
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string }
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError'
    return Response.json({
      error: isTimeout
        ? 'Request timed out. Site may be too slow or blocking requests.'
        : `Failed to load: ${err.message || 'Unknown error'}`,
    }, { status: 502 })
  }
}
