// Localized DEMO data for marketing screenshots. Entirely fictional; never taken from the database.
const L = Object.assign({
 en: { me:'Emma', origin:{name:'Manchester',lat:53.480,lng:-2.242},
  cities:[['Salford',53.488,-2.290],['Stockport',53.408,-2.149],['Bolton',53.578,-2.429],['Oldham',53.541,-2.111],['Bury',53.593,-2.298],['Wigan',53.545,-2.632]],
  areaNames:['Salford & Trafford','Stockport','Bolton','Oldham','Bury','Wigan'],
  names:['Riverside Pharmacy','Bright Smile Dental','OrthoCare Clinic','Oakwood Care Home','Kingsway Chemist','Parkview Dental','Mobility Plus','Willow House Care','Greenfield Pharmacy','Harbour Dental Studio','Elm Street Chemist','StepWell Orthotics','Rosewood Care Home','Victoria Pharmacy','Smile Studio','Northgate Chemist','Meadow Lodge','Castle Pharmacy','Pure Dental Care','Ashley Orthopaedics','Hillside Pharmacy','Brook Care Home','Central Chemist','Market Street Pharmacy','Cedar Dental','Lakeside Pharmacy','Primrose Care Home','Station Road Chemist','Bridge Dental Clinic','Moorland Pharmacy','Westbury Orthotics','Linden Care Home','Crown Pharmacy','Fairview Dental','Abbey Chemist','Holly Bank Care','Village Pharmacy','Grove Dental Practice','Mill Lane Chemist','Sunrise Care Home','Heath Pharmacy','Bayview Dental','Highfield Chemist','Orchard Care Home','Albert Pharmacy','City Dental Centre','Beacon Orthotics','Ivy Court Care'],
  notes:{back:'Come back in two weeks',stock:'Low on stock — call Thursday',price:'Wants a price offer',owner:'Owner away, meet the manager'}},
 ru: { me:'Анна', origin:{name:'Москва',lat:55.751,lng:37.618},
  cities:[['Химки',55.889,37.430],['Мытищи',55.910,37.736],['Королёв',55.922,37.854],['Балашиха',55.796,37.938],['Люберцы',55.676,37.893],['Красногорск',55.821,37.330]],
  areaNames:['Север','Мытищи','Королёв','Восток','Юго-Восток','Запад'],
  names:['Аптека «Здоровье»','Стоматология «Улыбка»','Ортоцентр «Опора»','Пансионат «Забота»','Аптека «Ромашка»','Дентал Плюс','Ортопедия «Шаг»','Дом престарелых «Тёплый дом»','Аптека «Фарма»','Клиника «Белый зуб»','Аптека на Ленина','Ортосалон «Движение»','Пансионат «Берёзка»','Аптека «Вита»','Стоматология «Дента»','Аптека «Апрель»','Пансионат «Надежда»','Аптека «Лекарь»','Клиника «Жемчуг»','Ортомед','Аптека «Добрая»','Пансионат «Сосны»','Аптека «Семейная»','Аптека «Озерки»','Стоматология «Кристалл»','Аптека «Неболей»','Пансионат «Родник»','Аптека у вокзала','Дентал Стиль','Аптека «Радуга»','Ортоцентр «Стопа»','Пансионат «Уют»','Аптека «Классика»','Стоматология «Эксперт»','Аптека «Мир»','Пансионат «Рассвет»','Аптека «Солнышко»','Клиника «Смайл»','Аптека «Ригла Плюс»','Пансионат «Добрые руки»','Аптека «Целитель»','Стоматология «Премьер»','Аптека «Аптечка»','Пансионат «Лесной»','Аптека «Гармония»','Дентал Центр','Ортопедия «Комфорт»','Пансионат «Осень»'],
  notes:{back:'Вернуться через две недели',stock:'Мало товара — позвонить в четверг',price:'Просят ценовое предложение',owner:'Владельца нет, говорить с заведующей'}},
 ar: { me:'نور', origin:{name:'الناصرة',lat:32.700,lng:35.297},
  cities:[['الناصرة',32.702,35.300],['شفاعمرو',32.806,35.170],['سخنين',32.864,35.297],['طمرة',32.853,35.198],['كفر كنا',32.747,35.342],['عرابة',32.851,35.334]],
  areaNames:['الناصرة','شفاعمرو','سخنين','طمرة','كفر كنا','عرابة'],
  names:['صيدلية الشفاء','عيادة أسنان الابتسامة','مركز النور للأجهزة الطبية','دار الأمل للمسنين','صيدلية الحياة','مركز الأسنان الحديث','أورثو بلس','بيت الرعاية','صيدلية السلام','عيادة اللؤلؤة للأسنان','صيدلية المدينة','مركز الخطوة للعظام','دار الرحمة للمسنين','صيدلية الريان','عيادة سمايل','صيدلية الأمين','دار الزيتون','صيدلية القدس','عيادة أسنان النخبة','مركز العظام الطبي','صيدلية الهدى','دار السكينة','صيدلية العائلة','صيدلية البلد','عيادة أسنان الكرمل','صيدلية الربيع','دار الوفاء للمسنين','صيدلية المحطة','مركز ديانا للأسنان','صيدلية الجليل','مركز الحركة للعظام','دار الحنان','صيدلية الصحة','عيادة أسنان الأمل','صيدلية النجمة','دار البركة','صيدلية الزهراء','عيادة الأسنان المركزية','صيدلية الواحة','دار النخيل للمسنين','صيدلية الفارابي','عيادة أسنان البسمة','صيدلية الشمس','دار الرعاية الحديثة','صيدلية ابن سينا','مركز الأسنان العائلي','أورثو ستيب','دار الأحبة'],
  notes:{back:'العودة بعد أسبوعين',stock:'المخزون قليل — الاتصال يوم الخميس',price:'يطلب عرض سعر',owner:'المالك غير موجود، التحدث مع المدير'}},
 es: { me:'Lucía', origin:{name:'Valencia',lat:39.470,lng:-0.376},
  cities:[['Torrent',39.437,-0.465],['Paterna',39.503,-0.440],['Burjassot',39.509,-0.413],['Mislata',39.475,-0.418],['Alboraya',39.500,-0.350],['Manises',39.493,-0.463]],
  areaNames:['Horta Sud','Paterna','Burjassot','Mislata','Horta Nord','Manises'],
  names:['Farmacia del Sol','Clínica Dental Sonrisa','Ortopedia Levante','Residencia Los Naranjos','Farmacia Central','Dental Mar','Ortopedia Paso Firme','Residencia La Alameda','Farmacia La Plaza','Clínica Dental Perla','Farmacia San José','Ortocentro Valencia','Residencia El Pinar','Farmacia Nueva','Smile Dental','Farmacia del Carmen','Residencia Santa Ana','Farmacia La Fuente','Clínica Dental Ruzafa','Ortopedia Turia','Farmacia El Puerto','Residencia Las Palmeras','Farmacia Familiar','Farmacia del Mercado','Dental Albufera','Farmacia Primavera','Residencia Los Olivos','Farmacia de la Estación','Clínica Dental Avenida','Farmacia Huerta','Ortopedia Camina','Residencia Azahar','Farmacia La Salud','Clínica Dental Benimaclet','Farmacia San Vicente','Residencia El Jardín','Farmacia Lucentum','Dental Centro','Farmacia La Ermita','Residencia Mediterráneo','Farmacia del Río','Clínica Dental Marina','Farmacia Real','Residencia Buen Retiro','Farmacia Lepanto','Dental Familiar','Ortopedia Avanza','Residencia La Calma'],
  notes:{back:'Volver en dos semanas',stock:'Poco stock — llamar el jueves',price:'Pide una oferta de precio',owner:'El dueño no estaba, hablar con la encargada'}}
}, require("./extra.js"));
function rng(seed){let s=seed>>>0;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
// fakeNow: ISO of the frozen "today" (Thursday 08/10/2026 10:30 Israel)
function build(lang, fakeNowMs){
 const D=L[lang], r=rng(20261008), DAY=86400000;
 const ago=(d,h)=>{const t=new Date(fakeNowMs-d*DAY);t.setUTCHours(h==null?7+Math.floor(r()*7):h, Math.floor(r()*60),0,0);return t.toISOString();};
 const types=['pharmacy','dental','ortho','nursing'];
 const areas=D.areaNames.map((n,i)=>({id:'a'+(i+1),code:i+1,name:n}));
 const custs=[];
 for(let i=0;i<48;i++){const a=i%6, ci=D.cities[a];
  const jit=()=> (r()-0.5)*0.05;
  custs.push({id:'c'+(i+1),name:D.names[i],city:ci[0],address:'',area_code:a+1,area_id:'a'+(a+1),area_name:D.areaNames[a],
   lat:+(ci[1]+jit()).toFixed(5),lng:+(ci[2]+jit()).toFixed(5),lifecycle:i%11===10?'potential':'active',
   debt_agorot:0,oldest_invoice:null,grade:['green','yellow','green','orange','yellow'][i%5],agent_id:'u1',customer_type:types[i%4],priority:'normal'});}
 // debts on ~11 customers
 [2,5,9,13,16,20,23,27,31,38,44].forEach((i,k)=>{custs[i].debt_agorot=Math.round((60000+r()*560000)/1000)*1000;custs[i].oldest_invoice=ago(20+Math.floor(r()*80),9);});
 // fixed amounts for the customers that land in next week's plan: total open collections = ₪24,480 (matches the site's hero badge)
 Object.entries({c45:896000,c6:534000,c28:615000,c24:403000}).forEach(([id,a])=>{const c=custs.find(x=>x.id===id);c.debt_agorot=a;});
 // visits: workdays (Sun-Thu) within the last 30 days + a few older ones (previous period)
 const visits=[],orders=[];let vid=1,oid=1,ono=1180;
 const today=new Date(fakeNowMs);
 const outcomes=['הזמנה','הזמנה','ללא הזמנה','הזמנה','לא נכח','הזמנה','פוטנציאלי'];
 const noteKeys=['back','stock','price','owner'];
 let ci=0,wi=0;
 for(let d=58;d>=0;d--){const dt=new Date(fakeNowMs-d*DAY),dow=dt.getUTCDay();if(dow>4)continue;
  const n=d>30?(d%3===0?1:0):(d===0?2:(d<=7?3:(r()<0.55?1:2)));
  for(let k=0;k<n;k++){
   // this week (d<=4): make sure areas 1..5 are covered; customers 0..15 are the "recently visited" group
   let c;
   if(d<=7){c=custs[[0,7,14,21,28,1,8,15,22,30,37,43,2,9,16][(wi++)%15]];}
   else if(d<=14){c=custs[[3,10,17,24,31,38,45,6,13,20][(ci++)%10]];}
   else {c=custs[(ci*7+k*5)%48];ci++;}
   const oc=d<=7?(['הזמנה','הזמנה','הזמנה','ללא הזמנה','הזמנה'][vid%5]):outcomes[(vid+d)%outcomes.length];
   const at=ago(d,d===0?5+k:undefined);
   visits.push({id:'v'+vid++,customer_id:c.id,customer_name:c.name,city:c.city,arrived_at:at,outcome:oc,summary:oc==='הזמנה'?'':D.notes[noteKeys[vid%4]],agent_id:'u1'});
   if(oc==='הזמנה'){const amt=Math.round((90000+r()*380000)/1000)*1000;
    orders.push({id:'o'+oid++,order_no:ono++,customer_id:c.id,customer_name:c.name,total_agorot:amt,commissionable_agorot:Math.round(amt*0.62/100)*100,created_at:new Date(new Date(at).getTime()+25*60000).toISOString(),status:'submitted',approval_status:null,channel:'inperson',agent_id:'u1'});}
  }}
 // two phone orders this month
 [[3,30],[6,35]].forEach(([d,i])=>{const c=custs[i],amt=Math.round((120000+r()*200000)/1000)*1000;orders.push({id:'o'+oid++,order_no:ono++,customer_id:c.id,customer_name:c.name,total_agorot:amt,commissionable_agorot:Math.round(amt*0.62/100)*100,created_at:ago(d,11),status:'submitted',approval_status:null,channel:'phone',agent_id:'u1'});});
 // last touch per customer (+ older history for some so the plan can say "N days without a visit")
 const lt={};visits.forEach(v=>{const x=lt[v.customer_id]=lt[v.customer_id]||{customer_id:v.customer_id,last_visit_at:null,last_order_at:null};if(!x.last_visit_at||v.arrived_at>x.last_visit_at)x.last_visit_at=v.arrived_at;});
 orders.forEach(o=>{const x=lt[o.customer_id]=lt[o.customer_id]||{customer_id:o.customer_id,last_visit_at:null,last_order_at:null};if(!x.last_order_at||o.created_at>x.last_order_at)x.last_order_at=o.created_at;});
 custs.forEach((c,i)=>{if(!lt[c.id]&&i%5!==4){lt[c.id]={customer_id:c.id,last_visit_at:ago(31+((i*13)%60),9),last_order_at:i%3?ago(40+((i*7)%50),9):null};}});
 const reminders=[{id:'r1',customer_id:custs[9].id,customer_name:custs[9].name,text:D.notes.price,kind:'manual',due_at:ago(-1,8),done:false,agent_id:'u1'},
  {id:'r2',customer_id:custs[22].id,customer_name:custs[22].name,text:D.notes.back,kind:'no_sale',due_at:ago(-3,8),done:false,agent_id:'u1'}];
 return {me:{id:'u1',name:D.me,role:'agent'},origin:D.origin,areas,customers:custs,visits,orders,last_touch:Object.values(lt),reminders};
}
module.exports={build};
