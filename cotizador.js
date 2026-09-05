/* ============================================================
   WPC TANDIL — Catálogo + Cotizador
   Precios de lista WPC Tandil, en USD por unidad y SIN IVA — que es como se cotiza acá.
   El IVA se calcula aparte y se muestra al costado, nunca metido en el precio de tapa.
   Se convierten a pesos con el dólar BNA venta del día (3 fuentes con fallback).
   Para actualizar la lista: ver PRECIOS-INTERNO.md (no versionado).
   ============================================================ */

var WA_NUMBER = "5492494209464";        // WhatsApp WPC Tandil
var BNA = 1420;                          // respaldo si ninguna API responde
var IVA = 0.21;                          // se muestra aparte, no va en el precio de tapa

/* ---------- Colores (línea Sin Talar, 6 tonos de stock permanente) ---------- */
var COLORES = [
  {id:'calden',    name:'Caldén',      hex:'#070e16', desc:'Oscuro y profundo, inspirado en el árbol de la llanura pampeana. Solidez y carácter.', uses:['Fachadas contemporáneas','Líneas modernas','Alto impacto visual']},
  {id:'alerce',    name:'Alerce',      hex:'#4f3126', desc:'Inspirado en los bosques patagónicos: calidez y firmeza, arquitectura atemporal.', uses:['Decks residenciales','Iluminación cálida','Rústico y contemporáneo']},
  {id:'arrayan',   name:'Arrayán',     hex:'#848275', desc:'Gris cálido, suave y equilibrado. Acompaña espacios contemporáneos con elegancia simple.', uses:['Diseños minimalistas','Hormigón visto','Fachadas limpias']},
  {id:'sauce',     name:'Sauce',       hex:'#88673c', desc:'Tono dorado y liviano, inspirado en las orillas de los ríos argentinos.', uses:['Interiores luminosos','Ampliar visualmente','Combinar con grises']},
  {id:'ombu',      name:'Ombú',        hex:'#ad885b', desc:'Color natural y suave, base noble y versátil para espacios amplios y simples.', uses:['Ambientes amplios','Piedra y microcemento','Interiores cálidos']},
  {id:'silvergray',name:'Silver Gray', hex:'#565857', desc:'Gris plata contemporáneo y neutro. Aire moderno y sobrio en fachadas de líneas limpias.', uses:['Fachadas modernas','Espacios industriales','Blanco y negro']}
];

/* ---------- Productos ---------- */
var PRODUCTOS = [
  {
    id:'deck', cat:'deck', catLabel:'Deck WPC', name:'Deck WPC',
    desc:'Piso exterior de alto tránsito. Resistente al agua, a los rayos UV y a la intemperie. No se astilla, no se pudre y no se pinta nunca.',
    largo:2200, ancho:140, espesor:22,
    terminaciones:['Veta de madera','Linear','Brushing'],
    colores:['calden','alerce','arrayan','sauce','ombu','silvergray'],
    precioUSD:26.29,
    unidad:'tabla',
    imgs:['img/deck-1.webp','img/deck-2.webp','img/deck-3.webp'],
    specs:[['Largo','2200 mm'],['Ancho','140 mm'],['Espesor','22 mm'],['Rinde','0,308 m² por tabla'],['Peso','6,6 kg por tabla (21 kg/m²)'],['Terminaciones','Veta de madera · Linear · Brushing']]
  },
  {
    id:'wallpanel', cat:'wallpanel', catLabel:'Wall Panel WPC', name:'Wall Panel WPC',
    desc:'Revestimiento de fachadas y muros, interior y exterior. Perfil acanalado de alta rigidez con terminación continua y fijación oculta.',
    largo:2900, ancho:220, espesor:23,
    terminaciones:['Linear','Brushing'],
    colores:['calden','alerce','arrayan','sauce','ombu','silvergray'],
    precioUSD:31.98,
    unidad:'panel',
    imgs:['img/wall-panel-1.webp','img/wall-panel-3.webp','img/wall-panel-2.webp'],
    specs:[['Largo','2900 mm'],['Ancho','220 mm'],['Espesor','23 mm'],['Rinde','0,638 m² por panel'],['Peso','8,7 kg por panel'],['Terminaciones','Linear · Brushing']]
  },
  {
    id:'perfil6042', cat:'perfileria', catLabel:'Perfilería WPC', name:'Perfil 60×42',
    desc:'Perfil estructural para pérgolas, cielorrasos, cercos y separadores. Sección hueca de alta rigidez.',
    largo:2900, ancho:60, espesor:42,
    terminaciones:['Linear','Brushing'],
    colores:['calden','alerce','arrayan','sauce','ombu','silvergray'],
    precioUSD:17.62,
    unidad:'barra',
    imgs:['img/perfil-60-1.webp','img/perfil-60-2.webp','img/perfil-60-3.webp'],
    specs:[['Largo','2900 mm'],['Cara mayor','60 mm'],['Cara menor','42 mm'],['Rinde','2,90 m lineales por barra'],['Peso','4,6 kg por barra'],['Terminaciones','Linear · Brushing']]
  },
  {
    id:'perfil4023', cat:'perfileria', catLabel:'Perfilería WPC', name:'Perfil 42×22',
    desc:'Perfil liviano para cerramientos decorativos, detalles constructivos y terminaciones.',
    largo:2900, ancho:42, espesor:22,
    terminaciones:['Linear','Brushing'],
    colores:['calden','alerce','arrayan','sauce','ombu','silvergray'],
    precioUSD:9.15,
    unidad:'barra',
    imgs:['img/perfil-40-1.webp','img/perfil-40-2.webp','img/perfil-40-3.webp'],
    specs:[['Largo','2900 mm'],['Cara mayor','42 mm'],['Cara menor','22 mm'],['Rinde','2,90 m lineales por barra'],['Peso','2,0 kg por barra'],['Terminaciones','Linear · Brushing']]
  }
];

var TERMINACIONES = [
  {name:'Veta de madera', tag:'Veteado natural', desc:'Vetas profundas que replican la textura de la madera real. Acabado cálido y de alta fidelidad estética.', aplica:'Deck'},
  {name:'Linear',         tag:'Rayado moderno',  desc:'Líneas finas y continuas. Apariencia técnica y contemporánea, ideal para fachadas y proyectos minimalistas.', aplica:'Todos'},
  {name:'Brushing',       tag:'Cepillado',       desc:'Microtextura cepillada que mejora el agarre y reduce reflejos. Recomendada para exteriores y zonas de tránsito.', aplica:'Todos'}
];

/* ============================================================
   Precios: cálculo de derivados + dólar BNA
   ============================================================ */
function fmt(n){ return (Math.round(n)||0).toLocaleString('es-AR'); }
function conIva(ars){ return Math.round(ars*(1+IVA)); }

function recalcPrecios(){
  PRODUCTOS.forEach(function(p){
    var area = (p.largo/1000)*(p.ancho/1000);
    p.areaUnidad  = area;
    p.mlUnidad    = p.largo/1000;
    p.precioM2USD = +(p.precioUSD/area).toFixed(2);
    p.precioARS    = Math.round(p.precioUSD*BNA);
    p.precioM2ARS  = Math.round(p.precioM2USD*BNA);
    p.precioMlARS  = Math.round((p.precioUSD/p.mlUnidad)*BNA);
    p.precioARSIva = Math.round(p.precioUSD*(1+IVA)*BNA);
  });
}

async function actualizarDolarBNA(){
  var fuentes=[
    {url:'https://api.bluelytics.com.ar/v2/latest',                       parse:function(d){return Math.round(d.oficial.value_sell);}},
    {url:'https://criptoya.com/api/dolar',                                parse:function(d){return Math.round(d.oficial.ask);}},
    {url:'https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial', parse:function(d){var a=Array.isArray(d)?d:[];var l=a[a.length-1];return l?Math.round(l.venta):null;}}
  ];
  for(var i=0;i<fuentes.length;i++){
    try{
      var r=await fetch(fuentes[i].url,{cache:'no-store'});
      if(!r.ok) continue;
      var venta=fuentes[i].parse(await r.json());
      if(!venta||isNaN(venta)||venta<100) continue;
      BNA=venta; break;
    }catch(e){}
  }
  var d=document.getElementById('bna-display'); if(d) d.textContent='$'+fmt(BNA);
  recalcPrecios(); repreciarCart(); renderProductos(); renderCart();
}

/* ============================================================
   Catálogo
   ============================================================ */
var filtroCat='todos';

function renderProductos(){
  var grid=document.getElementById('prod-grid'); if(!grid) return;
  grid.innerHTML = PRODUCTOS.filter(function(p){ return filtroCat==='todos'||p.cat===filtroCat; }).map(function(p){
    var porM2 = p.cat==='perfileria'
      ? '$'+fmt(p.precioMlARS)+' / metro lineal'
      : '$'+fmt(p.precioM2ARS)+' / m²';
    return '<article class="ct-card">'
      + '<div class="ct-card-img"><img src="'+p.imgs[0]+'" alt="'+p.name+'" loading="lazy"></div>'
      + '<div class="ct-card-body">'
      +   '<span class="ct-tag">'+p.catLabel+'</span>'
      +   '<h3>'+p.name+'</h3>'
      +   '<p>'+p.desc+'</p>'
      +   '<div class="ct-specs">'+p.specs.slice(0,3).map(function(s){return '<span>'+s[0]+': <b>'+s[1]+'</b></span>';}).join('')+'</div>'
      +   '<div class="ct-price">'
      +     '<div class="ct-price-main">$'+fmt(p.precioARS)+'<small> / '+p.unidad+'</small></div>'
      +     '<div class="ct-price-sub">'+porM2+' · <b>sin IVA</b></div>'
      +     '<div class="ct-price-iva">Con IVA 21%: $'+fmt(p.precioARSIva)+' / '+p.unidad+'</div>'
      +   '</div>'
      +   '<div class="ct-card-actions">'
      +     '<button class="btn btn-sm" onclick="irACotizador(\''+p.id+'\')">Calcular mi presupuesto</button>'
      +     '<button class="btn btn-sm btn-ghost" onclick="abrirFicha(\''+p.id+'\')">Ficha técnica</button>'
      +   '</div>'
      + '</div></article>';
  }).join('');
}

function filtrarCat(cat,btn){
  filtroCat=cat;
  document.querySelectorAll('.ct-filter').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  renderProductos();
}

function tono(hex,f){
  var h=hex.replace('#',''), r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
  function mix(c){ return Math.round(f>0 ? c+(255-c)*f : c*(1+f)); }
  return 'rgb('+mix(r)+','+mix(g)+','+mix(b)+')';
}
function degradado(hex){ return 'linear-gradient(140deg,'+tono(hex,.28)+' 0%,'+hex+' 52%,'+tono(hex,-.22)+' 100%)'; }

function renderColores(){
  var g=document.getElementById('color-grid'); if(!g) return;
  g.innerHTML = COLORES.map(function(c){
    return '<div class="ct-color">'
      + '<div class="ct-color-chip" style="background:'+degradado(c.hex)+'"></div>'
      + '<div class="ct-color-body"><h4>'+c.name+'</h4><p>'+c.desc+'</p>'
      + '<div class="ct-color-uses">'+c.uses.map(function(u){return '<span>'+u+'</span>';}).join('')+'</div></div></div>';
  }).join('');
}

function renderTerminaciones(){
  var g=document.getElementById('term-grid'); if(!g) return;
  g.innerHTML = TERMINACIONES.map(function(t){
    return '<div class="ct-term"><span class="ct-tag">'+t.tag+'</span><h4>'+t.name+'</h4><p>'+t.desc+'</p><small>Aplica a: '+t.aplica+'</small></div>';
  }).join('');
}

/* ---------- Ficha técnica (modal) ---------- */
var fichaProd=null;
function abrirFicha(id){
  var p=PRODUCTOS.find(function(x){return x.id===id;}); if(!p) return;
  fichaProd=p;
  document.getElementById('modal-body').innerHTML =
      '<div class="ct-modal-grid">'
    +   '<div><div class="ct-modal-img"><img id="ficha-img" src="'+p.imgs[0]+'" alt="'+p.name+'"></div>'
    +     '<div class="ct-modal-thumbs">'+p.imgs.map(function(im,i){return '<img src="'+im+'" onclick="fichaImg('+i+')" class="'+(i===0?'on':'')+'" alt="">';}).join('')+'</div></div>'
    +   '<div><span class="ct-tag">'+p.catLabel+'</span><h3>'+p.name+'</h3><p class="ct-modal-desc">'+p.desc+'</p>'
    +     '<table class="ct-table">'+p.specs.map(function(s){return '<tr><td>'+s[0]+'</td><td><b>'+s[1]+'</b></td></tr>';}).join('')+'</table>'
    +     '<div class="ct-modal-price"><div>$'+fmt(p.precioARS)+' <small>/ '+p.unidad+'</small></div>'
    +       '<small>'+(p.cat==='perfileria'?'$'+fmt(p.precioMlARS)+' / metro lineal':'$'+fmt(p.precioM2ARS)+' / m²')+' · precio sin IVA</small>'
    +       '<small class="ct-iva-line">Con IVA 21%: $'+fmt(p.precioARSIva)+' / '+p.unidad+'</small></div>'
    +     '<p class="ct-modal-colors"><b>Colores:</b> '+p.colores.map(function(cid){var c=COLORES.find(function(x){return x.id===cid;});return c?c.name:'';}).join(' · ')+'</p>'
    +     '<button class="btn" onclick="closeModal();irACotizador(\''+p.id+'\')">Calcular mi presupuesto</button>'
    +   '</div>'
    + '</div>';
  document.getElementById('modal-overlay').classList.add('on');
  document.body.style.overflow='hidden';
}
function fichaImg(i){
  if(!fichaProd) return;
  document.getElementById('ficha-img').src=fichaProd.imgs[i];
  document.querySelectorAll('.ct-modal-thumbs img').forEach(function(t,j){t.classList.toggle('on',j===i);});
}
function closeModal(){ document.getElementById('modal-overlay').classList.remove('on'); document.body.style.overflow=''; }
function closeModalBg(e){ if(e.target.id==='modal-overlay') closeModal(); }

/* ============================================================
   COTIZADOR
   ============================================================ */
var tabCalc='deck', formaActual='rectangle', modoPerfil='linear';
var deckCalc=null, wpCalc=null, prCalc=null;
var cart=[];

var FORMAS={
  rectangle:{label:'Rectángulo', desc:'Ingresá ancho y largo. Sirve para decks, galerías y superficies rectas.', fields:['Ancho','Largo']},
  square:   {label:'Cuadrado',   desc:'Todos los lados iguales. Ingresá la medida de un lado.', fields:['Lado']},
  lshape:   {label:'Forma en L', desc:'Calculamos el área como dos rectángulos. Medí altura total, base total, altura del brazo bajo y ancho del brazo derecho.', fields:['Altura total','Base total','Altura brazo bajo','Ancho brazo derecho']},
  ushape:   {label:'Forma en U', desc:'Rectángulo exterior menos el vacío interior.', fields:['Ancho total','Profundidad total','Ancho vacío interior','Profundidad vacío interior']},
  circle:   {label:'Círculo',    desc:'Ingresá el diámetro del espacio.', fields:['Diámetro']},
  semicircle:{label:'Semicírculo',desc:'Ingresá el diámetro. Calculamos media circunferencia.', fields:['Diámetro']},
  pentagon: {label:'Pentágono',  desc:'Pentágono regular: ingresá la medida de un lado.', fields:['Lado']},
  trapezoid:{label:'Trapecio',   desc:'Ingresá base menor, base mayor y altura. Ideal para lados inclinados.', fields:['Base menor','Base mayor','Altura']},
  custom:   {label:'Personalizada', desc:'Sumá hasta 4 rectángulos. Cargá ancho y largo de cada parte del espacio.', fields:['Rect. 1 ancho','Rect. 1 largo','Rect. 2 ancho','Rect. 2 largo','Rect. 3 ancho','Rect. 3 largo','Rect. 4 ancho','Rect. 4 largo']}
};

function areaForma(v){
  if(formaActual==='square')     return v[0]*v[0];
  if(formaActual==='rectangle')  return v[0]*v[1];
  if(formaActual==='lshape')     return (v[1]*v[2])+(v[3]*Math.max(v[0]-v[2],0));
  if(formaActual==='ushape')     return Math.max((v[0]*v[1])-(v[2]*v[3]),0);
  if(formaActual==='circle'){    var r=v[0]/2; return Math.PI*r*r; }
  if(formaActual==='semicircle'){var r2=v[0]/2; return (Math.PI*r2*r2)/2; }
  if(formaActual==='pentagon')   return (Math.sqrt(5*(5+2*Math.sqrt(5)))/4)*Math.pow(v[0],2);
  if(formaActual==='trapezoid')  return ((v[0]+v[1])/2)*v[2];
  if(formaActual==='custom'){    var a=0; for(var i=0;i<v.length;i+=2){ a+=(v[i]||0)*(v[i+1]||0); } return a; }
  return 0;
}

function selTab(t,btn){
  tabCalc=t;
  document.querySelectorAll('.ct-tab').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.ct-panel').forEach(function(p){p.classList.remove('active');});
  var el=document.getElementById('panel-'+t); if(el) el.classList.add('active');
  if(t==='deck') calcDeck(); if(t==='wallpanel') calcWP(); if(t==='perfiles') calcPR();
}

function selForma(f,btn){
  formaActual=f;
  document.querySelectorAll('.ct-shape').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  renderCamposForma();
  calcDeck();
}

function ejemplo(a,b,btn){
  selForma('rectangle', document.querySelector('.ct-shape'));
  document.getElementById('dk-m0').value=a;
  document.getElementById('dk-m1').value=b;
  calcDeck();
  document.querySelectorAll('.ct-examples button').forEach(function(x){x.classList.remove('on');});
  if(btn) btn.classList.add('on');
}

function renderCamposForma(){
  var cfg=FORMAS[formaActual];
  document.getElementById('forma-desc').textContent=cfg.desc;
  document.getElementById('forma-fields').innerHTML = cfg.fields.map(function(f,i){
    return '<label class="ct-field"><span>'+f+' (m)</span><input type="number" min="0" step="0.01" id="dk-m'+i+'" oninput="calcDeck()" placeholder="0.00"></label>';
  }).join('');
  document.getElementById('forma-svg').innerHTML = svgForma(formaActual);
}

function svgForma(f){
  var s='<svg viewBox="0 0 200 140" class="ct-svg">';
  var st='fill="rgba(47,81,51,.10)" stroke="#2f5133" stroke-width="2"';
  if(f==='rectangle'||f==='custom') s+='<rect x="25" y="30" width="150" height="80" '+st+'/><text x="100" y="24" class="lbl">1 · ancho</text><text x="186" y="74" class="lbl" transform="rotate(90 186 74)">2 · largo</text>';
  else if(f==='square')      s+='<rect x="55" y="20" width="100" height="100" '+st+'/><text x="105" y="14" class="lbl">1 · lado</text>';
  else if(f==='lshape')      s+='<path d="M25 20 H105 V80 H175 V120 H25 Z" '+st+'/><text x="16" y="70" class="lbl" transform="rotate(-90 16 70)">1 · altura</text><text x="100" y="134" class="lbl">2 · base</text><text x="140" y="106" class="lbl">3 · brazo</text><text x="182" y="102" class="lbl" transform="rotate(90 182 102)">4</text>';
  else if(f==='ushape')      s+='<path d="M25 20 H65 V90 H135 V20 H175 V120 H25 Z" '+st+'/><text x="100" y="14" class="lbl">1 · ancho total</text><text x="100" y="66" class="lbl">3 · vacío</text>';
  else if(f==='circle')      s+='<circle cx="100" cy="70" r="52" '+st+'/><line x1="48" y1="70" x2="152" y2="70" stroke="#2f5133" stroke-dasharray="4 4"/><text x="100" y="64" class="lbl">1 · diámetro</text>';
  else if(f==='semicircle')  s+='<path d="M40 100 A60 60 0 0 1 160 100 Z" '+st+'/><text x="100" y="116" class="lbl">1 · diámetro</text>';
  else if(f==='pentagon')    s+='<polygon points="100,18 165,64 140,124 60,124 35,64" '+st+'/><text x="100" y="136" class="lbl">1 · lado</text>';
  else if(f==='trapezoid')   s+='<polygon points="65,30 135,30 175,110 25,110" '+st+'/><text x="100" y="24" class="lbl">1 · base menor</text><text x="100" y="124" class="lbl">2 · base mayor</text><text x="186" y="72" class="lbl" transform="rotate(90 186 72)">3 · altura</text>';
  return s+'</svg>';
}

/* ---------- Deck ---------- */
function calcDeck(){
  var cfg=FORMAS[formaActual], out=document.getElementById('dk-result');
  var vals=cfg.fields.map(function(_,i){ return parseFloat((document.getElementById('dk-m'+i)||{}).value)||0; });
  var ok = formaActual==='custom' ? vals.some(function(v){return v>0;}) : vals.every(function(v){return v>0;});
  var area=areaForma(vals);
  if(!ok||area<=0){ out.innerHTML='<div class="ct-ph">Cargá las medidas para ver el cálculo.</div>'; deckCalc=null; return null; }
  var p=PRODUCTOS.find(function(x){return x.id==='deck';});
  var waste=parseFloat((document.getElementById('dk-waste')||{}).value)||0;
  var m2d=area*(1+waste/100);
  var tablas=Math.ceil(m2d/p.areaUnidad);
  var clips=Math.ceil(tablas*8);
  var totalARS=tablas*p.precioARS, totalUSD=+(tablas*p.precioUSD).toFixed(2);
  deckCalc={area:area,m2d:m2d,tablas:tablas,clips:clips,waste:waste,totalARS:totalARS,totalUSD:totalUSD,product:p};
  out.innerHTML = row('m² netos',area.toFixed(2)+' m²')
    + row('m² con desperdicio',m2d.toFixed(2)+' m²')
    + row('Tablas de deck',tablas+' unidades')
    + row('Clips de fijación',clips+' aprox.')
    + row('Total estimado (sin IVA)','$'+fmt(totalARS),true)
    + rowIva(totalARS);
  return deckCalc;
}
function row(k,v,total){ return '<div class="ct-row'+(total?' total':'')+'"><span>'+k+'</span><span>'+v+'</span></div>'; }
function rowIva(ars){ return '<div class="ct-row iva"><span>Con IVA 21%</span><span>$'+fmt(conIva(ars))+'</span></div>'; }

function addDeck(){
  var c=calcDeck(); if(!c){ toast('Completá las medidas del deck'); return; }
  var col=COLORES.find(function(x){return x.id===document.getElementById('dk-color').value;})||COLORES[0];
  var term=document.getElementById('dk-term').value;
  push({prod:'Deck WPC', prodId:'deck', unidades:c.tablas, color:col.name, colorHex:col.hex, term:term,
    label:c.area.toFixed(2)+' m² netos · '+c.m2d.toFixed(2)+' m² con '+c.waste+'% de desperdicio · '+c.tablas+' tablas · '+c.clips+' clips',
    totalARS:c.totalARS, totalUSD:c.totalUSD});
  toast('Deck agregado al presupuesto');
}

/* ---------- Wall Panel ---------- */
function calcWP(){
  var p=PRODUCTOS.find(function(x){return x.id==='wallpanel';}), out=document.getElementById('wp-result');
  var w=parseFloat((document.getElementById('wp-w')||{}).value)||0;
  var h=parseFloat((document.getElementById('wp-h')||{}).value)||0;
  var panos=parseInt((document.getElementById('wp-panos')||{}).value)||1;
  var waste=parseFloat((document.getElementById('wp-waste')||{}).value)||0;
  if(!w||!h){ out.innerHTML='<div class="ct-ph">Cargá las medidas para ver el cálculo.</div>'; wpCalc=null; return null; }
  var area=w*h*panos, m2d=area*(1+waste/100);
  var unidades=Math.ceil(m2d/p.areaUnidad);
  var totalARS=unidades*p.precioARS, totalUSD=+(unidades*p.precioUSD).toFixed(2);
  wpCalc={area:area,m2d:m2d,unidades:unidades,panos:panos,waste:waste,totalARS:totalARS,totalUSD:totalUSD,product:p};
  out.innerHTML = row('m² netos',area.toFixed(2)+' m²')
    + row('m² con desperdicio',m2d.toFixed(2)+' m²')
    + row('Área por panel',p.areaUnidad.toFixed(3)+' m²')
    + row('Paneles necesarios',unidades+' unidades')
    + row('Total estimado (sin IVA)','$'+fmt(totalARS),true)
    + rowIva(totalARS);
  return wpCalc;
}
function addWP(){
  var c=calcWP(); if(!c){ toast('Completá las medidas del wall panel'); return; }
  var col=COLORES.find(function(x){return x.id===document.getElementById('wp-color').value;})||COLORES[0];
  var term=document.getElementById('wp-term').value;
  push({prod:'Wall Panel WPC', prodId:'wallpanel', unidades:c.unidades, color:col.name, colorHex:col.hex, term:term,
    label:c.area.toFixed(2)+' m² netos ('+c.panos+(c.panos>1?' paños':' paño')+') · '+c.m2d.toFixed(2)+' m² con '+c.waste+'% de desperdicio · '+c.unidades+' paneles',
    totalARS:c.totalARS, totalUSD:c.totalUSD});
  toast('Wall Panel agregado al presupuesto');
}

/* ---------- Perfilería ---------- */
function perfilProd(){
  var id=(document.getElementById('pr-prod')||{}).value||'perfil6042';
  return PRODUCTOS.find(function(x){return x.id===id;});
}
function actualizarCaras(){
  var id=(document.getElementById('pr-prod')||{}).value||'perfil6042';
  var p=PRODUCTOS.find(function(x){return x.id===id;});
  var term=document.getElementById('pr-term');
  if(term&&p) term.innerHTML=p.terminaciones.map(function(t){return '<option>'+t+'</option>';}).join('');
  var face=document.getElementById('pr-face');
  face.innerHTML = id==='perfil6042'
    ? '<option value="60">Visible 60 mm</option><option value="42">Visible 42 mm</option>'
    : '<option value="42">Visible 42 mm</option><option value="22">Visible 22 mm</option>';
  calcPR();
}
var PR_HINT={
  linear:'Si ya sabés cuántos metros de perfil necesitás, cargalos acá y te decimos cuántas barras comprar.',
  separacion:'Para pérgolas, cerramientos y parasoles: cargá el paño y qué separación querés entre perfiles, y calculamos cuántos entran.',
  cantidad:'Si ya definiste cuántos perfiles van, cargá el paño y la cantidad, y te decimos qué separación real queda entre uno y otro.'
};
function selModoPerfil(m,btn){
  modoPerfil=m;
  var hint=document.getElementById('pr-hint'); if(hint) hint.textContent=PR_HINT[m]||'';
  document.querySelectorAll('.ct-mode').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.pr-mode-panel').forEach(function(p){p.classList.remove('active');});
  document.getElementById('pr-mode-'+m).classList.add('active');
  calcPR();
}
function calcPR(){
  var p=perfilProd(), out=document.getElementById('pr-result');
  var barLen=parseFloat((document.getElementById('pr-barlen')||{}).value)||2.9;
  var waste=parseFloat((document.getElementById('pr-waste')||{}).value)||0;
  var faceMm=parseFloat((document.getElementById('pr-face')||{}).value)||60;
  var count=0, ml=0, bars=0, gapReal=null, pieceLen=0, warn='', orient='vertical', modo='Metro lineal';

  if(modoPerfil==='linear'){
    ml=parseFloat((document.getElementById('pr-ml')||{}).value)||0;
    if(!ml){ out.innerHTML='<div class="ct-ph">Cargá los metros lineales que necesitás.</div>'; prCalc=null; dibujarPerfiles(0); return null; }
    bars=Math.ceil((ml*(1+waste/100))/barLen); count=bars; pieceLen=barLen;
  } else if(modoPerfil==='separacion'){
    var w=parseFloat((document.getElementById('pr-sep-w')||{}).value)||0;
    var h=parseFloat((document.getElementById('pr-sep-h')||{}).value)||0;
    var gapCm=parseFloat((document.getElementById('pr-sep-gap')||{}).value)||0;
    orient=document.getElementById('pr-sep-orient').value;
    if(!w||!h){ out.innerHTML='<div class="ct-ph">Cargá ancho, alto y separación.</div>'; prCalc=null; dibujarPerfiles(0); return null; }
    var dist=orient==='vertical'?w:h; pieceLen=orient==='vertical'?h:w;
    var face=faceMm/1000, gap=gapCm/100;
    count=Math.max(1,Math.floor((dist+gap)/(face+gap)));
    gapReal=count>1?(dist-(count*face))/(count-1):0;
    ml=count*pieceLen; bars=Math.ceil((ml*(1+waste/100))/barLen); modo='Separación fija';
  } else {
    var w2=parseFloat((document.getElementById('pr-fix-w')||{}).value)||0;
    var h2=parseFloat((document.getElementById('pr-fix-h')||{}).value)||0;
    count=parseInt((document.getElementById('pr-fix-count')||{}).value)||0;
    orient=document.getElementById('pr-fix-orient').value;
    if(!w2||!h2||!count){ out.innerHTML='<div class="ct-ph">Cargá medidas y cantidad de perfiles.</div>'; prCalc=null; dibujarPerfiles(0); return null; }
    var dist2=orient==='vertical'?w2:h2; pieceLen=orient==='vertical'?h2:w2;
    var face2=faceMm/1000;
    gapReal=count>1?(dist2-(count*face2))/(count-1):0;
    ml=count*pieceLen; bars=Math.ceil((ml*(1+waste/100))/barLen); modo='Cantidad fija';
    if(gapReal<0) warn+='Esa cantidad de perfiles no entra en la medida indicada. Reducí la cantidad o usá una cara visible menor.<br>';
  }
  if(pieceLen>barLen+0.0001) warn+='Cada pieza necesita '+pieceLen.toFixed(2)+' m y la barra comercial mide '+barLen.toFixed(2)+' m. Hay que empalmar, pedir barra más larga o cambiar la orientación.<br>';

  var totalARS=bars*p.precioARS, totalUSD=+(bars*p.precioUSD).toFixed(2);
  prCalc={product:p,modo:modo,faceMm:faceMm,barLen:barLen,waste:waste,count:count,ml:ml,bars:bars,gapReal:gapReal,pieceLen:pieceLen,orient:orient,totalARS:totalARS,totalUSD:totalUSD};

  var html = row('Perfil',p.name)
    + (modoPerfil!=='linear' ? row('Cantidad de perfiles',count+' unidades') : '')
    + row('Metros lineales',ml.toFixed(2)+' m')
    + row('Barras de '+barLen.toFixed(2)+' m',bars+' unidades')
    + (gapReal!==null && gapReal>=0 ? row('Separación real entre perfiles',(gapReal*100).toFixed(1)+' cm') : '')
    + row('Total estimado (sin IVA)','$'+fmt(totalARS),true)
    + rowIva(totalARS)
    + (warn?'<div class="ct-warn">'+warn+'</div>':'');
  out.innerHTML=html;
  dibujarPerfiles(count,orient);
  return prCalc;
}
function dibujarPerfiles(count,orient){
  var el=document.getElementById('pr-preview'); if(!el) return;
  if(!count||count<1){ el.innerHTML='<span class="ct-ph">Configurá el paño para ver la distribución.</span>'; return; }
  var n=Math.min(count,28), vert=(orient||'vertical')==='vertical';
  var bars='';
  for(var i=0;i<n;i++){
    bars += vert
      ? '<div style="width:8px;height:100%;background:#2f5133;border-radius:2px"></div>'
      : '<div style="height:8px;width:100%;background:#2f5133;border-radius:2px"></div>';
  }
  el.innerHTML='<div style="display:flex;flex-direction:'+(vert?'row':'column')+';gap:6px;justify-content:space-between;align-items:stretch;width:100%;height:100%">'+bars+'</div>'
    + (count>n?'<small class="ct-preview-note">Mostrando 28 de '+count+' perfiles</small>':'');
}
function addPR(){
  var c=calcPR(); if(!c){ toast('Completá los datos de la perfilería'); return; }
  var col=COLORES.find(function(x){return x.id===document.getElementById('pr-color').value;})||COLORES[0];
  var term=(document.getElementById('pr-term')||{}).value||'Linear';
  push({prod:c.product.name, prodId:c.product.id, unidades:c.bars, color:col.name, colorHex:col.hex, term:term,
    label:c.modo+' · '+c.ml.toFixed(2)+' m lineales · '+c.bars+' barras de '+c.barLen.toFixed(2)+' m'+(c.gapReal!==null&&c.gapReal>=0?' · separación '+(c.gapReal*100).toFixed(1)+' cm':''),
    totalARS:c.totalARS, totalUSD:c.totalUSD});
  toast('Perfilería agregada al presupuesto');
}

/* ============================================================
   Carrito / presupuesto
   ============================================================ */
function push(item){
  item.id=Date.now()+Math.random();
  cart.push(item); guardar(); renderCart();
  if(window.fbq) fbq('trackCustom','AddToQuote',{content_name:item.prod,value:item.totalUSD,currency:'USD'});
}
/* Los ítems se guardan con su precio en USD: si cambia el dólar (o el carrito venía
   de otro día en localStorage), los pesos se recalculan en vez de quedar viejos. */
function repreciarCart(){
  cart.forEach(function(i){
    var p=PRODUCTOS.find(function(x){return x.id===i.prodId;});
    if(p && i.unidades){ i.totalARS=i.unidades*p.precioARS; i.totalUSD=+(i.unidades*p.precioUSD).toFixed(2); }
    else if(i.totalUSD){ i.totalARS=Math.round(i.totalUSD*BNA); }
  });
  guardar();
}
function quitar(id){ cart=cart.filter(function(i){return i.id!=id;}); guardar(); renderCart(); }
function limpiar(){ if(!cart.length) return; if(!confirm('¿Vaciar el presupuesto?')) return; cart=[]; guardar(); renderCart(); }
function guardar(){ try{ localStorage.setItem('wpc_cart',JSON.stringify(cart)); }catch(e){} }
function cargar(){ try{ var s=localStorage.getItem('wpc_cart'); if(s) cart=JSON.parse(s)||[]; }catch(e){ cart=[]; } }

function renderCart(){
  var box=document.getElementById('cart-items'), tot=document.getElementById('cart-total');
  if(!box) return;
  ['cart-badge','cart-badge-m'].forEach(function(id){
    var b=document.getElementById(id); if(!b) return;
    b.textContent=cart.length; b.style.display=cart.length?'grid':'none';
  });
  if(!cart.length){
    box.innerHTML='<div class="ct-empty"><b>Tu presupuesto está vacío</b><p>Agregá productos desde el cotizador de arriba.</p></div>';
    if(tot) tot.textContent='$0';
    var d0=document.getElementById('cart-iva'); if(d0) d0.innerHTML='';
    actualizarBarra(0);
    return;
  }
  box.innerHTML = cart.map(function(i){
    return '<div class="ct-item">'
      + '<div class="ct-item-dot" style="background:'+degradado(i.colorHex)+'"></div>'
      + '<div class="ct-item-body"><b>'+i.prod+'</b><small>'+i.color+' · '+i.term+'</small><p>'+i.label+'</p></div>'
      + '<div class="ct-item-price">$'+fmt(i.totalARS)+'</div>'
      + '<button class="ct-item-x" onclick="quitar('+i.id+')" aria-label="Quitar">✕</button>'
      + '</div>';
  }).join('');
  var total=cart.reduce(function(a,i){return a+i.totalARS;},0);
  if(tot) tot.textContent='$'+fmt(total);
  actualizarBarra(total);
  var det=document.getElementById('cart-iva');
  if(det) det.innerHTML='<div><span>IVA 21%</span><span>$'+fmt(total*IVA)+'</span></div>'
                      + '<div><span>Total con IVA</span><span>$'+fmt(conIva(total))+'</span></div>';
}

function actualizarBarra(total){
  document.body.classList.toggle('has-cart', cart.length>0);
  var c=document.getElementById('sticky-count'), t=document.getElementById('sticky-total');
  if(c) c.textContent=cart.length+(cart.length===1?' ítem':' ítems');
  if(t) t.textContent='$'+fmt(total)+' sin IVA';
}

function textoPresupuesto(){
  var nombre=(document.getElementById('cli-nombre')||{}).value||'';
  var lugar=(document.getElementById('cli-lugar')||{}).value||'';
  var nota=(document.getElementById('cli-nota')||{}).value||'';
  var t='Hola WPC Tandil, armé mi presupuesto en la web:\n\n';
  cart.forEach(function(i,n){
    t+= (n+1)+') '+i.prod+' — '+i.color+' · '+i.term+'\n   '+i.label+'\n   $'+fmt(i.totalARS)+'\n\n';
  });
  var neto=cart.reduce(function(a,i){return a+i.totalARS;},0);
  t+='TOTAL (sin IVA): $'+fmt(neto)+'\n';
  t+='IVA 21%: $'+fmt(neto*IVA)+'\n';
  t+='Total con IVA: $'+fmt(conIva(neto))+'\n';
  t+='(Dólar BNA $'+fmt(BNA)+' · sin instalación)\n\n';
  if(nombre) t+='Nombre: '+nombre+'\n';
  if(lugar)  t+='Zona/obra: '+lugar+'\n';
  if(nota)   t+='Comentario: '+nota+'\n';
  return t;
}

function enviarWA(){
  if(!cart.length){ toast('Agregá al menos un producto'); return; }
  if(window.fbq) fbq('track','Contact',{content_name:'cotizador'});
  window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(textoPresupuesto()),'_blank');
}
function copiarPresupuesto(){
  if(!cart.length){ toast('Agregá al menos un producto'); return; }
  navigator.clipboard.writeText(textoPresupuesto()).then(function(){ toast('Presupuesto copiado'); },
    function(){ toast('No se pudo copiar'); });
}
function imprimirPresupuesto(){
  if(!cart.length){ toast('Agregá al menos un producto'); return; }
  window.print();
}

/* ---------- Navegación / utilidades ---------- */
function irACotizador(prodId){
  var map={deck:'deck', wallpanel:'wallpanel', perfil6042:'perfiles', perfil4023:'perfiles'};
  var t=map[prodId]||'deck';
  var btn=document.querySelector('.ct-tab[data-tab="'+t+'"]');
  selTab(t,btn);
  if(t==='perfiles' && prodId){ var s=document.getElementById('pr-prod'); if(s){ s.value=prodId; actualizarCaras(); } }
  document.getElementById('cotizador').scrollIntoView({behavior:'smooth'});
}
function irA(id){
  var el=document.getElementById(id); if(!el) return;
  el.scrollIntoView({behavior:'smooth'});
}
var toastT=null;
function toast(msg){
  var el=document.getElementById('toast'); if(!el) return;
  el.textContent=msg; el.classList.add('on');
  clearTimeout(toastT); toastT=setTimeout(function(){ el.classList.remove('on'); },2600);
}

/* ---------- Init ---------- */
function initSelects(){
  var colOpts=COLORES.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('');
  ['dk-color','wp-color','pr-color'].forEach(function(id){ var e=document.getElementById(id); if(e) e.innerHTML=colOpts; });
  var deck=PRODUCTOS.find(function(x){return x.id==='deck';});
  var wp=PRODUCTOS.find(function(x){return x.id==='wallpanel';});
  document.getElementById('dk-term').innerHTML=deck.terminaciones.map(function(t){return '<option>'+t+'</option>';}).join('');
  document.getElementById('wp-term').innerHTML=wp.terminaciones.map(function(t){return '<option>'+t+'</option>';}).join('');
}

document.addEventListener('DOMContentLoaded', function(){
  recalcPrecios();
  initSelects();
  renderProductos(); renderColores(); renderTerminaciones();
  renderCamposForma(); actualizarCaras();
  var ph=document.getElementById('pr-hint'); if(ph) ph.textContent=PR_HINT.linear;
  cargar(); repreciarCart(); renderCart();
  document.getElementById('bna-display').textContent='$'+fmt(BNA);
  var pd=document.getElementById('print-date');
  if(pd) pd.textContent=new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'});
  actualizarDolarBNA();
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });

  var pr=document.getElementById('progress');
  if(pr) addEventListener('scroll',function(){
    var h=document.documentElement;
    pr.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  });
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
});
