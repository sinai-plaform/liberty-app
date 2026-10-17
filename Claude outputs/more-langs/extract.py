import json,re,sys
W='/Users/lirandandekargmail.com/Code/liberty-deploy/Claude outputs/more-langs/'
src=open('/Users/lirandandekargmail.com/Code/liberty-deploy/app/index.html',encoding='utf-8').read()
i=src.index('var I18N=')+len('var I18N=')
dec=json.JSONDecoder()
obj,end=dec.raw_decode(src[i:])
print('langs',list(obj.keys()),[len(v) for v in obj.values()])
print('tail',repr(src[i+end:i+end+80]))
en=obj['en']
keys=list(en.keys())
for l in obj:
    print(l, set(obj[l].keys())==set(keys))
json.dump({'keys':keys,'en':[en[k] for k in keys],'es':[obj['es'].get(k) for k in keys]},open(W+'base.json','w'),ensure_ascii=False)
with open(W+'en.txt','w') as f:
    for n,k in enumerate(keys):
        f.write('%d\t%s\n'%(n,en[k].replace('\n','\\n')))
nonstr=[k for k in keys if not isinstance(en[k],str)]
print('nonstr',len(nonstr))
print('chars',sum(len(v) for v in en.values()))
