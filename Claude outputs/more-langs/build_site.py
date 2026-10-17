import re,sys,os,html
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from site_tr import T
R='/Users/lirandandekargmail.com/Code/liberty-deploy/'
ORDER=['he','en','ru','ar','es','de','it','fr','pt']
NAMES={'he':'עברית','en':'English','ru':'Русский','ar':'العربية','es':'Español','de':'Deutsch','it':'Italiano','fr':'Français','pt':'Português'}
LANGWORD={'de':'Sprache','it':'Lingua','fr':'Langue','pt':'Idioma'}
LOCALE={'de':'de_DE','it':'it_IT','fr':'fr_FR','pt':'pt_PT'}
SG={'he':'מבית <bdi>SINAI Global</bdi>','en':'A SINAI Global company','ru':'Компания <bdi>SINAI Global</bdi>','ar':'إحدى شركات <bdi>SINAI Global</bdi>',
    'es':'Una empresa de SINAI Global','de':'Ein Unternehmen von SINAI Global','it':"Un'azienda SINAI Global",'fr':'Une société SINAI Global','pt':'Uma empresa SINAI Global'}
def hub(l):return 'https://sinai-global.com/' if l=='en' else 'https://sinai-global.com/%s/'%l
def path(l):return R+('index.html' if l=='he' else l+'/index.html')
def menu(cur):
    pre='' if cur=='he' else '../'
    out=[]
    for l in ORDER:
        href=(('./' if cur=='he' else '../') if l=='he' else pre+l+'/')
        out.append('<a href="%s" hreflang="%s" lang="%s"%s onclick="try{localStorage.setItem(\'sg-lang\',\'%s\')}catch(e){}">%s</a>'%(href,l,l,' aria-current="page"' if l==cur else '',l,NAMES[l]))
    return '<div class="lng-m">'+''.join(out)+'</div></details>'
HREFL='\n'.join('<link rel="alternate" hreflang="%s" href="https://jasale.app/%s">'%(l,'' if l=='he' else l+'/') for l in ORDER)+'\n<link rel="alternate" hreflang="x-default" href="https://jasale.app/en/">'
PMAP='{'+','.join("%s:'%s'"%(l,'/' if l=='he' else '/'+l+'/') for l in ORDER)+'}'
def common(src,l):
    # hreflang block
    src,n=re.subn(r'<link rel="alternate" hreflang="he"[^\n]*\n(?:<link rel="alternate" hreflang="[a-z-]+"[^\n]*\n)*?<link rel="alternate" hreflang="x-default"[^>]*>',HREFL,src);assert n==1,(l,'hreflang')
    src,n=re.subn(r"\}\)\('([a-z]{2})',\{[^}]*\}\);","})('%s',%s);"%(l,PMAP),src);assert n==1,(l,'P')
    src,n=re.subn(r'<div class="lng-m">.*?</div></details>',lambda m:menu(l),src,flags=re.S);assert n==1,(l,'menu')
    # footer company link (idempotent)
    src=re.sub(r' · <a class="sgco"[^>]*>.*?</a>','',src)
    a=' · <a class="sgco" href="%s" lang="%s" style="color:inherit;text-decoration:underline;text-underline-offset:3px;white-space:nowrap">%s</a>'%(hub(l),l,SG[l])
    old='<span class="mail" style="font-weight:400">hello@jasale.app</span></div>\n</div></footer>'
    assert src.count(old)==1,(l,'footer')
    src=src.replace(old,'<span class="mail" style="font-weight:400">hello@jasale.app</span>'+a+'</div>\n</div></footer>')
    return src
en=open(path('en'),encoding='utf-8').read()
miss=[]
for l in ['de','it','fr','pt']:
    s=en
    for a,tr in T:
        if a not in s:miss.append((l,a[:60]));continue
        s=s.replace(a,tr[l])
    s=s.replace('<html lang="en" dir="ltr">','<html lang="%s" dir="ltr">'%l)
    s=s.replace('<meta property="og:locale" content="en_US">','<meta property="og:locale" content="%s">'%LOCALE[l])
    s=s.replace('<summary aria-label="Language: English">','<summary aria-label="%s: %s">'%(LANGWORD[l],NAMES[l]))
    s=s.replace('<span lang="en">English</span>','<span lang="%s">%s</span>'%(l,NAMES[l]))
    s=re.sub(r'assets/(home|report|week)-en\.webp',r'assets/\1-%s.webp'%l,s)
    s=s.replace('JaSale%20demo','JaSale%20Demo') if l=='de' else s
    s=common(s,l)
    os.makedirs(R+l,exist_ok=True)
    open(path(l),'w',encoding='utf-8').write(s)
print('missing segments:',miss)
for l in ['he','en','ru','ar','es']:
    p=path(l);s=open(p,encoding='utf-8').read();s=common(s,l);open(p,'w',encoding='utf-8').write(s)
# leftover English check: visible text nodes of new pages that are identical to en text nodes
def texts(s):
    s=re.sub(r'<(script|style|svg)[^>]*>.*?</\1>','',s,flags=re.S)
    return [t.strip() for t in re.findall(r'>([^<>]+)<',s) if re.search('[A-Za-z]{3}',t)]
ent=set(texts(en))
for l in ['de','it','fr','pt']:
    left=[t for t in texts(open(path(l),encoding='utf-8').read()) if t in ent]
    print(l,'same-as-en text nodes:',sorted(set(left)))
