import re
W='/Users/lirandandekargmail.com/Code/liberty-deploy/Claude outputs/more-langs/'
FIX={
 'de':{1487:'Noch',686:'Produktname oder Artikelnummer',398:'Produkt hinzufügen – Name oder Artikelnummer',1789:'Produktname oder Artikelnummer'},
 'it':{1487:'Ancora'},
 'fr':{1487:'Encore',686:'Produit – nom ou référence'},
 'pt':{1487:'Faltam',686:'Produto – nome ou referência'},
}
for l,f in FIX.items():
    lines=open(W+l+'.txt',encoding='utf-8').read().split('\n')
    out=[]
    for ln in lines:
        if '\t' in ln:
            i,t=ln.split('\t',1)
            if int(i) in f:ln='%s\t%s'%(i,f[int(i)])
        out.append(ln)
    open(W+l+'.txt','w',encoding='utf-8').write('\n'.join(out))
# make the build idempotent: fixed version numbers
p=W+'build_app.py'
s=open(p,encoding='utf-8').read()
s=s.replace('newv="var APP_VERSION=\'2026-10-13-%d\';"%(int(m.group(2))+1)','newv="var APP_VERSION=\'2026-10-13-84\';"')
s=s.replace('sw=sw.replace(m.group(0),"var V=\'jasale-v%d\';"%(int(m.group(1))+1))','sw=sw.replace(m.group(0),"var V=\'jasale-v5\';")')
open(p,'w',encoding='utf-8').write(s)
print('ok')
