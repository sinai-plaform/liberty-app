import json,re,sys
W='/Users/lirandandekargmail.com/Code/liberty-deploy/Claude outputs/more-langs/'
APP='/Users/lirandandekargmail.com/Code/liberty-deploy/app/'
b=json.load(open(W+'base.json'))
keys,en=b['keys'],b['en']
N=len(keys)
FIX={'de':{305:'Wird abgelehnt',599:'Die Links öffnen private Betriebe entlang der Route in Google Maps – mit Telefon, Adresse und Öffnungszeiten. Passt ein Betrieb, füge ihn als neuen Kunden hinzu über «Neuer Kunde',
           1003:'Ein Termin braucht ein Datum – fülle das Feld «Nächster Besuch',1463:'Noch keine Interessenten – tippe auf «🔄 Von der Karte aktualisieren'}}
def load(l):
    d={}
    for ln in open(W+l+'.txt',encoding='utf-8'):
        ln=ln.rstrip('\n')
        if not ln.strip():continue
        i,t=ln.split('\t',1)
        i=int(i)
        assert i not in d,(l,i)
        d[i]=t.replace('\\n','\n').strip()
    d.update(FIX.get(l,{}))
    miss=[i for i in range(N) if i not in d or not d[i]]
    assert not miss,(l,miss[:20])
    return d
def sig(s):
    return (s.count('('),s.count(')'),s.count('«'),s.count('»'),re.findall(r'[\U0001F300-\U0001FAFF✓→🚚👌💬🔄]',s),re.findall(r'\d+',s.replace('.','').replace(' ','').replace('\u202f','')))
out={}
warn=0
for l in ['de','it','fr','pt']:
    d=load(l)
    for i in range(N):
        a,c=sig(en[i]),sig(d[i])
        if a[:5]!=c[:5]:
            print('SIG',l,i,repr(en[i]),'|',repr(d[i]));warn+=1
        if sorted(a[5])!=sorted(c[5]) and not (set(a[5])<=set(c[5])):
            print('NUM',l,i,repr(en[i]),'|',repr(d[i]));warn+=1
        if 'Hebrew' in d[i] or re.search('[\u0590-\u05FF]',d[i]):
            print('HEB',l,i);warn+=1
    out[l]={keys[i]:d[i] for i in range(N)}
print('warnings',warn)
if '--write' not in sys.argv:sys.exit()
p=APP+'index.html'
src=open(p,encoding='utf-8').read()
i=src.index('var I18N=')+len('var I18N=')
obj,end=json.JSONDecoder().raw_decode(src[i:])
for l in ['de','it','fr','pt']:obj[l]=out[l]
new=json.dumps(obj,ensure_ascii=False,separators=(',',':'))
assert '</script' not in new.lower()
src=src[:i]+new+src[i+end:]
def rep(a,bb,cnt=1):
    global src
    assert src.count(a)==cnt,(a,src.count(a))
    src=src.replace(a,bb)
rep("/* ================= i18n (he default · en · ru · ar · es) =================","/* ================= i18n (he default · en · ru · ar · es · de · it · fr · pt) =================")
rep("var _LANGS=['he','en','ru','ar','es'];","var _LANGS=['he','en','ru','ar','es','de','it','fr','pt'];")
rep("var _LANG_NAMES={he:'עברית',en:'English',ru:'Русский',ar:'العربية',es:'Español'};","var _LANG_NAMES={he:'עברית',en:'English',ru:'Русский',ar:'العربية',es:'Español',de:'Deutsch',it:'Italiano',fr:'Français',pt:'Português'};")
rep("var _LOCS={he:'he-IL',en:'en-GB',ru:'ru-RU',ar:'ar-u-nu-latn',es:'es-ES'};","var _LOCS={he:'he-IL',en:'en-GB',ru:'ru-RU',ar:'ar-u-nu-latn',es:'es-ES',de:'de-DE',it:'it-IT',fr:'fr-FR',pt:'pt-PT'};")
rep("var _STT={he:'he-IL',en:'en-US',ru:'ru-RU',ar:'ar-IL',es:'es-ES'};","var _STT={he:'he-IL',en:'en-US',ru:'ru-RU',ar:'ar-IL',es:'es-ES',de:'de-DE',it:'it-IT',fr:'fr-FR',pt:'pt-PT'};")
# lower-casing a word that continues a sentence: not for German (nouns stay capitalised); accents for fr/it/pt
rep("/* a word that continues a sentence (\"3 Orders\") starts lower-case in en/es/ru */","/* a word that continues a sentence (\"3 Orders\") starts lower-case in en/es/ru/it/fr/pt (never in German: nouns keep their capital) */")
rep("_lang!=='ar'&&/^[A-ZА-ЯЁÁÉÍÓÚÑ][a-zа-яёáéíóúñ]/.test(d)&&!/^(WhatsApp|Excel|PDF|Google|Waze|Liberty|JaSale|CSV|PIN|SKU|Area|Zona|Район)\\b/.test(d)",
    "_lang!=='ar'&&_lang!=='de'&&/^[A-ZА-ЯЁÀ-ÖØ-Ý][a-zа-яёß-öø-ÿ]/.test(d)&&!/^(WhatsApp|Excel|PDF|Google|Waze|Liberty|JaSale|CSV|PIN|SKU|NIF|SIRET|IVA|TVA|Area|Zona|Район)\\b/.test(d)")
m=re.search(r"var APP_VERSION='(\d{4}-\d\d-\d\d)-(\d+)';",src)
newv="var APP_VERSION='2026-10-13-84';"
src=src.replace(m.group(0),newv)
print('version',m.group(0),'->',newv)
open(p,'w',encoding='utf-8').write(src)
sw=open(APP+'sw.js',encoding='utf-8').read()
m=re.search(r"var V='jasale-v(\d+)';",sw)
sw=sw.replace(m.group(0),"var V='jasale-v5';")
open(APP+'sw.js','w',encoding='utf-8').write(sw)
print('sw',m.group(0))
