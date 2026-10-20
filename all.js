
/* HeatWise v1.9.33 — overzichtelijker testen en resultaten, bestaande data en invoer-ID's behouden. */
(function(){
 const zibro=document.getElementById('register');
 const gas=document.getElementById('heating');
 const overview=document.getElementById('overview');
 const byTitle=(section,fragment)=>Array.from(section.querySelectorAll(':scope > .card')).find(c=>(c.querySelector('h2')?.textContent||'').includes(fragment));
 const move=(node,dest)=>{if(node&&dest)dest.appendChild(node);};
 const makeCard=(title,note)=>{const card=document.createElement('div');card.className='card';const h=document.createElement('h2');h.textContent=title;card.append(h);if(note){const p=document.createElement('p');p.className='muted';p.textContent=note;card.append(p);}return card;};
 const historic=byTitle(overview,'Zibro – metingen');
 const legacy=byTitle(gas,'Verwarmingsbeurt');
 const gasSettings=byTitle(gas,'Gasprijsinstellingen');
 const petrol=byTitle(gas,'Petroleumprijzen');
 const phases=document.getElementById('phaseSettings');
 const testPrediction=byTitle(zibro,'Nieuwe verwarmingstest');
 const gasP1=byTitle(zibro,'P1-gasregistratie');
 const tank=byTitle(zibro,'Zibro-tank');
 const results=byTitle(overview,'Mijn overzicht');
 const settings=byTitle(overview,'Instellingen');
 // Zibro: test, eerdere Zibro-brandtesten, tankcyclus, petroleum en oudere registraties.
 move(petrol,zibro);
  if(historic){
    // Oude formulieren blijven in het DOM voor compatibiliteit, maar verdwijnen uit de gewone bediening.
    historic.classList.add('hidden');historic.setAttribute('aria-hidden','true');
  }
 const saved=document.getElementById('hwSavedTests');
 if(saved){
   const h=saved.previousElementSibling;
   if(h?.tagName==='P'&&h.previousElementSibling?.textContent.includes('Mijn Zibro-brandtesten')){h.previousElementSibling.remove();h.remove();}
    const savedCard=makeCard('📋 Mijn Zibro-resultaten','Lopende en afgeronde testen, temperatuurmetingen en opmerkingen staan hier samen. Open een test om alle metingen te bekijken.');
    savedCard.classList.add('hw-results-card');
    savedCard.append(saved);
    if(historic){
      const h=document.createElement('h3');h.textContent='Eerdere temperatuurmetingen';savedCard.append(h);
      const hint=document.createElement('p');hint.className='tiny';hint.textContent='Metingen van vóór de start- en stopknop blijven beschikbaar en tellen niet als aparte brandtest.';savedCard.append(hint);
      savedCard.append(document.getElementById('zibroLog'));
    }
    const hoursLabel=document.createElement('h3');hoursLabel.textContent='Geregistreerde branduren';savedCard.append(hoursLabel);
    savedCard.append(document.getElementById('zRunSummary'));
    const oldRuns=document.createElement('details');oldRuns.id='hwLegacyRunsDetails';
    oldRuns.innerHTML='<summary>Bekijk handmatig geregistreerde branduren</summary><div id="hwLegacyRuns"></div>';
    savedCard.append(oldRuns);
    if(tank)zibro.insertBefore(savedCard,tank);else zibro.append(savedCard);
    if(tank){tank.querySelector('h2').textContent='⛽ Mijn tank en petroleumverbruik';
      const tankHint=document.createElement('p');tankHint.className='tiny hw-tank-hint';tankHint.textContent='Volgens je eerdere meting werd de tank op 19 oktober tot het 7-literstreepje gevuld. Dat is nog geen gemeten verbruik. Registreer een nieuwe vulling pas wanneer je werkelijk bijtankt.';
      const st=tank.querySelector('.tankrow');if(st)st.after(tankHint);
      const cyc=document.getElementById('zCycleSummary');if(cyc)tank.append(cyc);
    }
 }
  // Bellfires: eerst registreren, daarna de bijbehorende resultaten bekijken.
  move(gasSettings,overview);
  move(testPrediction,gas);move(gasP1,gas);
  if(testPrediction){testPrediction.querySelector('h2').textContent='🔥 Bellfires · Nieuwe test vastleggen';
    const d=testPrediction.querySelector('.muted');if(d)d.textContent='Bewaar hier de beginstand en voorspelling van een nieuwe gastest. Vervolgens kun je de gemeten gasmeterstanden toevoegen. Dit is nog geen automatische start-/stopknop.';
  }
  if(gasP1){gasP1.querySelector('h2').textContent='🔥 Gasverbruik registreren (P1)';}
  if(gasSettings){gasSettings.classList.add('hw-gas-settings');}
  
 const testHistory=document.getElementById('testHistory');
 if(testHistory){
   const h=testHistory.previousElementSibling;
   if(h?.tagName==='H3'&&h.textContent.includes('Bewaarde teststarts'))h.remove();
   const testsCard=makeCard('🔥 Bellfires · testresultaten','Bestaande gasmetingen, voorspellingen en werkelijke testduren. Testen met een combinatie van Zibro en gas blijven als zodanig herkenbaar.');
   testsCard.append(testHistory);
   gas.append(testsCard);
 }
 // Oude invoer uitsluitend verbergen, zodat bestaande velden geen JavaScript-fouten veroorzaken.
 if(legacy){legacy.classList.add('hidden');legacy.setAttribute('aria-hidden','true');move(legacy,overview);}
 // Geavanceerde aannames horen bij instellingen, niet in het dagelijkse Zibro-testscherm.
 if(phases&&settings)overview.insertBefore(phases,settings);
 // Overzicht: enkel gemeenschappelijke cijfers, oudere gecombineerde gegevens en gegevensbeheer.
  document.querySelector('#zibroTestPanel h2').textContent='⛽ Mijn Zibro · Test uitvoeren';
  document.querySelector('#zibroTestPanel > p.muted').textContent='Start de kachel, bewaar onderweg je temperaturen en opmerkingen en stop wanneer je hem uitzet. Alles wordt automatisch bij dezelfde test bewaard.';
  if(results?.querySelector('h2'))results.querySelector('h2').textContent='📊 Mijn verwarmingsoverzicht';
  const oldHead=Array.from(results?.querySelectorAll('h2')||[]).find(x=>x.textContent.includes('Geschiedenis'));
  if(oldHead){
    const history=document.getElementById('history');const d=document.createElement('details');d.id='hwCombinedHistory';
    d.innerHTML='<summary>Oudere gecombineerde verwarmingsbeurten</summary>';
    if(history)d.append(history);oldHead.replaceWith(d);
  }
  const blankTestHeading=Array.from(results?.querySelectorAll('h2')||[]).find(x=>x.textContent.includes('Bewaarde teststarts'));
  if(blankTestHeading)blankTestHeading.remove();
  // Geef de gasinstellingen een discrete plek onder de algemene instellingen.
  if(gasSettings&&settings){const advanced=document.createElement('details');advanced.className='hw-settings-detail';advanced.innerHTML='<summary>Gasprijs: netkosten en heffingen</summary>';gasSettings.classList.remove('card');advanced.append(gasSettings);settings.append(advanced);}
  
})();
// v1.9.34: presentatie herindelen, zonder gegevens of bestaande invoer-ID's te veranderen.
(function(){
 const $=id=>document.getElementById(id),z=$('register'),g=$('heating'),o=$('overview');
 const saved=z.querySelector('.hw-results-card'),tank=Array.from(z.children).find(c=>c.querySelector('h2')?.textContent.includes('Mijn tank en petroleumverbruik'));
 const petrol=Array.from(z.children).find(c=>c.querySelector('h2')?.textContent.includes('Petroleumprijzen'));
 const archive=document.createElement('div');archive.className='card hw-archive-card';archive.id='hwArchive';
 archive.innerHTML='<details><summary>📋 Oudere registraties bekijken</summary><p class="tiny">Bewaarde metingen van vóór de start- en stopfunctie. Deze worden niet als aparte nieuwe testen geteld.</p><h3>Eerdere temperatuurmetingen</h3><div id="hwOldLogsSlot"></div><h3>Handmatig geregistreerde branduren</h3><div id="hwOldRunsSlot"></div></details>';
 if(saved&&tank){
  const oldLogs=$('zibroLog'),oldRuns=$('hwLegacyRunsDetails'),summary=$('zRunSummary');
  for(const el of Array.from(saved.children)){
   if(el.tagName==='H3'||el.classList.contains('tiny')&&el.textContent.includes('Metingen van vóór'))el.remove();
  }
  if(oldLogs)archive.querySelector('#hwOldLogsSlot').append(oldLogs);
  if(oldRuns)archive.querySelector('#hwOldRunsSlot').append(oldRuns);
  const row=tank.querySelector('.tankrow');if(row){
   const start=document.createElement('div');start.className='hw-tank-baseline';start.id='hwTankBaseline';
   start.innerHTML='<strong>Startvulling: 19 oktober 2026</strong><span>Tot het 7-literstreepje. De hoeveelheid die sindsdien verbruikt is, kennen we nog niet.</span>';
   row.after(start);
  }
  const summaryBox=document.createElement('div');summaryBox.className='hw-tank-hours';
  const title=document.createElement('h3');title.textContent='Geregistreerde branduren';summaryBox.append(title);
  if(summary)summaryBox.append(summary);tank.insertBefore(summaryBox,tank.querySelector('#tankWarning'));
  // De bekende startvulling is reeds vastgelegd onder db.zibroTankStart. Geen nieuwe liters of vulling registreren.
  if(petrol)petrol.after(archive);else z.append(archive);
 }
 const ref=$('refillLitres');if(ref){ref.value='';ref.placeholder='Pas invullen wanneer je werkelijk bijtankt';ref.min='0.1';}
 if(tank){const caution=tank.querySelector('.warning');if(caution){const why=document.createElement('details');why.className='hw-tank-how';why.innerHTML='<summary>Hoe werkt de tankcyclus?</summary>';caution.replaceWith(why);why.append(caution);}}
 const newResult=$('bellNewResults');const oldHistory=$('testHistory');
 if(newResult&&oldHistory){const h=oldHistory.parentElement;if(h){const sub=document.createElement('h3');sub.textContent='Eerdere Bellfires-resultaten';sub.className='hw-historic-heading';newResult.append(sub,oldHistory);h.remove();}}
 const oldCards=Array.from(g.children).filter(c=>c.querySelector('h2')&&/Nieuwe test vastleggen|Gasverbruik registreren \(P1\)/.test(c.querySelector('h2').textContent));
 if(oldCards.length){const holder=document.createElement('details');holder.id='bellLegacyInputs';holder.className='card hw-accordion hw-legacy-gas';holder.innerHTML='<summary>Oudere Bellfires-invoer bekijken</summary><p class="tiny">Alleen voor oudere testen. Voor een nieuwe test gebruik je bovenaan de start- en stopknop.</p>';oldCards.forEach(c=>{c.classList.remove('card');holder.append(c)});g.append(holder)}
 const original=$('phaseSettings'),settingCard=Array.from(o.children).find(c=>c.querySelector('h2')?.textContent.includes('Instellingen'));
 if(original&&settingCard){
  const gas=settingCard.querySelector('.hw-settings-detail');
  const backup=Array.from(settingCard.children).find(c=>c.tagName==='DETAILS'&&c!==gas&&c.querySelector('summary')?.textContent.includes('Bescherm je gegevens'));
  const adv=document.createElement('details');adv.className='card hw-accordion';adv.id='hwAdvanced';adv.innerHTML='<summary>⚙️ Geavanceerde instellingen</summary>';
  original.open=true;original.classList.remove('card');original.classList.add('hw-inner-phase');adv.append(original);
  settingCard.classList.remove('card');settingCard.classList.add('hw-settings-inside');const h=settingCard.querySelector('h2');if(h)h.remove();adv.append(settingCard);
  o.append(adv);
  if(gas){gas.classList.remove('hw-settings-detail');gas.classList.add('card','hw-accordion');gas.querySelector('summary').textContent='🔥 Gasprijs: netkosten en heffingen';const nested=gas.querySelector('details');if(nested)nested.open=true;o.append(gas)}
  if(backup){backup.classList.add('card','hw-accordion');backup.querySelector('summary').textContent='🛡️ Bescherm je gegevens';o.append(backup)}
 }
 const tempLabel=$('tankInfo');if(tempLabel){tempLabel.setAttribute('aria-live','polite');}
})();

;

const $=id=>document.getElementById(id),KEY='heatwise-v1';let db;try{db=JSON.parse(localStorage.getItem(KEY))||{sessions:[],refills:[],settings:{}}}catch{db={sessions:[],refills:[],settings:{}}}db.sessions=db.sessions||[];db.tests=db.tests||[];db.refills=db.refills||[];db.settings=db.settings||{};db.zibroLogs=db.zibroLogs||[];db.zibroRuns=db.zibroRuns||[];db.zibroCycles=db.zibroCycles||[];
const initialZibroLogs=[
{id:'initial-18-1857',date:'2026-10-18',time:'18:57',living:21,outside:9,set:22,type:'gemeten',note:'Zibro begint werkelijk te branden; starttemperatuur living 21°C. Instelling later naar 23°C.'},
{id:'initial-18-1915',date:'2026-10-18',time:'19:15',living:22.75,outside:9,set:23,type:'geschat',note:'Witte thermometer bijna 23°C; waarde 22,75 is indicatieve middenwaarde, geen exacte meting.'},
{id:'initial-18-evening',date:'2026-10-18',living:23,outside:9,set:22,type:'gemeten',note:'Living 23°C; instelling verlaagd van 23 naar 22°C. Exact tijdstip niet genoteerd.'},
{id:'initial-18-2052',date:'2026-10-18',time:'20:52',living:22,outside:9,set:22,type:'gemeten',note:'Witte thermometer 22°C; vermoedelijk laag brandvermogen. Later weer ingesteld op 23°C.'},
{id:'initial-18-kitchen',date:'2026-10-18',time:'22:22',living:23,kitchen:20,outside:9,set:23,type:'gemeten',note:'Keuken 20°C gemeten met witte thermometer na circa uur op die plaats; living 23°C door gebruiker gemeld. Keuken start ~19°C was schatting.'},
{id:'initial-19-start',date:'2026-10-19',time:'18:00',living:19,outside:14,set:23,type:'gemeten',note:'Werkelijke start Zibro 18.00 uur, bevestigd door gebruiker. Living 19°C vóór start; display ROOM 17°C. Tank gevuld tot 7-literstreepje (geen gemeten verbruik).'}
];
// Bevestigde Bellfires-test van 18 oktober: werkelijk 30 minuten, zonder voorspelling te overschrijven.
for(const t of db.tests){if(String(t.when||'').startsWith('2026-10-18T16:30')&&Number(t.duration)===1&&Math.abs(Number(t.gasM3)-0.4)<0.001&&t.actualMinutes==null)t.actualMinutes=30;}
db.deletedInitialLogIds=db.deletedInitialLogIds||[];db.mixedTests=db.mixedTests||[];for(const item of initialZibroLogs){if(db.deletedInitialLogIds.includes(item.id))continue;const existing=db.zibroLogs.find(x=>x.id===item.id);if(!existing)db.zibroLogs.push(item);else if(item.id==='initial-19-start'&&!existing.time){existing.time=item.time;existing.note=item.note;}}
if(!db.zibroTankStart)db.zibroTankStart={date:'2026-10-19',level:'7-literstreepje',note:'Vulling; geen exacte verbruikte liters vastgesteld'};
localStorage.setItem('heatwise-v1',JSON.stringify(db));
const fields=['petrolPrice','zRate','gasKwh','gasEff','heatDemand'];const num=id=>Number(String($(id).value).replace(',','.'));const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=n=>'€ '+(Number.isFinite(n)?n:0).toFixed(2).replace('.',',');const save=()=>{localStorage.setItem(KEY,JSON.stringify(db));render()};const stamp=()=>new Date().toISOString().slice(0,10);$('sessionDate').value=stamp();for(const id of fields)if(db.settings[id]!=null)$(id).value=db.settings[id];const settings=()=>({...Object.fromEntries(fields.map(id=>[id,num(id)])),contractGas:num('contractGas'),gasExtra:num('gasExtra'),spot:num('spot')});$('purchasePriceToday').value=String(db.settings.petrolPrice??1.20);$('currentPetrolPrice').value=String(db.settings.currentPetrolPrice??2.00);function updateSavings(){const a=num('purchasePriceToday'),b=num('currentPetrolPrice');$('tankSaving').textContent=Number.isFinite(a)&&Number.isFinite(b)&&a>=0&&b>=0?money(7*(b-a)):'—';$('savingPurchase').textContent=Number.isFinite(a)&&a>=0?a.toFixed(2):'—';$('savingCurrent').textContent=Number.isFinite(b)&&b>=0?b.toFixed(2):'—';$('savingNote').textContent='Prijsverschil op een tank van 7 liter. '+(b<a?'De huidige prijs ligt lager dan je aankoopprijs.':'Actuele prijs zelf ingevuld of overgenomen; de werkelijke pompprijs kan afwijken.')}function updatePetrol(){const a=num('purchasePriceToday'),b=num('currentPetrolPrice');if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<0)return;db.settings.petrolPrice=a;db.settings.currentPetrolPrice=b;$('petrolPrice').value=String(a);localStorage.setItem(KEY,JSON.stringify(db));updateSavings();markPending()}$('purchasePriceToday').addEventListener('input',updatePetrol);$('currentPetrolPrice').addEventListener('input',updatePetrol);updateSavings();const rate=()=>db.zibroCycles.some(r=>r.hours>0)?db.zibroCycles.filter(r=>r.hours>0).reduce((a,r)=>a+r.litres,0)/Math.max(.01,db.zibroCycles.filter(r=>r.hours>0).reduce((a,r)=>a+r.hours,0)):db.refills.some(r=>r.hours>0)?db.refills.filter(r=>r.hours>0).reduce((a,r)=>a+r.litres,0)/Math.max(.01,db.refills.filter(r=>r.hours>0).reduce((a,r)=>a+r.hours,0)):num('zRate');function updateGasEstimate(){
 const spot=num('spot'),extra=num('gasExtra');
 if(!Number.isFinite(spot)||spot<0||!Number.isFinite(extra)||extra<0){$('gasFormulaInfo').textContent='Vul een geldige Gasradar-prijs en opslag in.';return;}
 const energy=((spot*10)*0.11111+0.2165)*1.06;
 const total=energy+extra;
 $('contractGas').value=total.toFixed(2);
 $('gasFormulaInfo').textContent='Energie volgens EnergyVision: '+energy.toFixed(2).replace('.',',')+' ct/kWh incl. btw + voorlopige opslag '+extra.toFixed(2).replace('.',',')+' = '+total.toFixed(2).replace('.',',')+' ct/kWh. Dagprijs als indicatie; geen definitieve maandafrekening.';
 db.settings.spot=spot;db.settings.gasExtra=extra;db.settings.contractGas=total;
 localStorage.setItem(KEY,JSON.stringify(db));
}
function gasPrice(){return num('contractGas')/100}function calculate(){
 const hours=num('duration'),outside=num('outside'),inside=num('inside'),target=num('target');
 const referenceLoss=num('heatDemand'),petrol=num('petrolPrice'),gas=gasPrice(),eff=num('gasEff')/100;
 const slider=$('zSplit');slider.max=String(Math.max(0,hours));if(Number(slider.value)>hours)slider.value=String(hours);
 const zHours=Number(slider.value),gHours=Math.max(0,hours-zHours),fmt=h=>h.toLocaleString('nl-BE',{maximumFractionDigits:1})+' u';
 $('zTime').textContent=fmt(zHours);$('gTime').textContent=fmt(gHours);$('zBar').style.width=(hours>0?100*zHours/hours:0)+'%';
 if(![hours,outside,inside,target,referenceLoss,petrol,gas,eff,zHours].every(Number.isFinite)||hours<=0||referenceLoss<=0||eff<=0||petrol<0||gas<0){$('comparison').innerHTML='<div class="card warning">Controleer de ingevoerde waarden.</div>';return}
 const lossCoeff=referenceLoss/21,meanInside=(inside+target)/2;
 const maintaining=Math.max(0,lossCoeff*(meanInside-outside)*hours);
 const warmup=Math.max(0,target-inside)*1.5;
 const needed=maintaining+warmup,avgPower=needed/hours;
 const zibroEffective=0.85,zUnit=petrol/(10*zibroEffective),gUnit=gas/eff;
 const zMax=4.85;
 // Het tijdschema is een simulatie met aannames over gemiddelde afgegeven warmte.
 // De Zibro kan moduleren; Bellfires wordt door de gebruiker handmatig bediend.
 const zHighHours=Math.min(zHours,Math.max(0,num('zHighHours')||0)),gHighHours=Math.min(gHours,Math.max(0,num('gHighHours')||0));
 // Benaderingen: Zibro thermostaat moduleert; temperatuurstand is geen vaste kW-stand.
 const zHighPower=3.8,zLowPower=2.0;
 // Bellfires-waarden zijn NIET gemeten en moeten met P1-data worden geijkt.
 const gPowerOne=3.5,gPowerTwo=6.5;
 const gHiPower=$('gHighBurners').value==='2'?gPowerTwo:gPowerOne;
 const gLoPower=$('gLowBurners').value==='2'?gPowerTwo:gPowerOne;
 const zHeat=zHighHours*zHighPower+(zHours-zHighHours)*zLowPower;
 const gHeat=gHighHours*gHiPower+(gHours-gHighHours)*gLoPower;
 const delivered=zHeat+gHeat;
 const splitCost=zHeat*zUnit+gHeat*gUnit;window.lastPlanCost=splitCost;
 // Alle drie de prijzen zijn tijdschema's voor exact dezelfde gekozen duur.
 // Zibro: voorlopige liter/uur-aanname; na tankcyclus gebruiken we gemeten gemiddelde.
 const zRateActual=rate(),zOnly=hours*zRateActual*petrol;
 const zMix=zHours*zRateActual*petrol;
 // Bellfires: testmetingen 18 oktober: 1 brander 0,4 m³/30min, 2 branders 0,6 m³/30min.
 // Dit zijn voorlopige meetwaarden, niet gegarandeerde constante verbruiken.
 const gOne=0.8,gTwo=1.2;
 const gasHour=b=>b==='2'?gTwo:gOne;
 const gMixM3=gHighHours*gasHour($('gHighBurners').value)+(gHours-gHighHours)*gasHour($('gLowBurners').value);
 const gOnlyHi=Math.min(hours,Math.max(0,num('gHighHours')||0));
 const gOnlyM3=gOnlyHi*gasHour($('gHighBurners').value)+(hours-gOnlyHi)*gasHour($('gLowBurners').value);
 const gMixCost=gMixM3*num('gasKwh')*gas, gOnly=gOnlyM3*num('gasKwh')*gas;
 const splitRuntimeCost=zMix+gMixCost;
 window.lastPlanCost=splitRuntimeCost;
 const fmtShort=h=>h.toLocaleString('nl-BE',{maximumFractionDigits:1})+'u';
 const zIcon='<img class="scene-photo" src="./zibro-scene.jpg" alt="Zibro LC-150, mijn eigen model" loading="eager">';
 const gIcon='<img class="scene-photo" src="./bellfires-scene.jpg" alt="Bellfires Smart Bell 75/80 (ontwerpvisualisatie)" loading="eager">';
 const items=[
 {label:'Zibro',sub:fmtShort(hours)+' petroleum',icon:zIcon,cost:zOnly},
 {label:'Mijn mix',sub:fmtShort(zHours)+' + '+fmtShort(gHours),icon:'<img class="scene-photo" src="./mix-icons-v1932.jpg" alt="Zibro en Bellfires samen (ontwerpvisualisatie)" loading="eager">',cost:splitRuntimeCost},
 {label:'Bellfires',sub:fmtShort(hours)+' gas',icon:gIcon,cost:gOnly}
 ];
 $('comparison').innerHTML='<div class="card cost-panel"><div class="compare-heading"><strong>Geschatte kosten · '+fmt(hours)+'</strong><small>Zelfde duur, verschillende toestellen</small></div><div class="cost-grid">'+items.map((x,i)=>'<div class="cost-choice '+(Math.abs(x.cost-Math.min(...items.map(y=>y.cost)))<0.005?'best-value':'')+'"><div class="choice-icon">'+x.icon+'</div><strong>'+x.label+'</strong><small>'+x.sub+'</small><div class="choice-price">'+money(x.cost)+'</div></div>').join('')+'</div><p class="cost-note">Richtprijzen voor branduren, <b>niet</b> voor gegarandeerd dezelfde kamertemperatuur. Zibro '+zRateActual.toFixed(3).replace('.',',')+' l/u '+(db.zibroCycles.length?'(tankmeting)':'(voorlopige schatting)')+'; Bellfires 0,8/1,2 m³/u bij 1/2 branders (korte tests). Gasprijs indicatief.</p><details><summary>ⓘ Berekening en aannames</summary><p class="tiny">Zibro: '+fmt(hours)+' × '+zRateActual.toFixed(3)+' l/u × '+money(petrol)+'/l. Bellfires: hoge fase '+fmt(gOnlyHi)+' met '+$('gHighBurners').value+' branders; daarna '+fmt(hours-gOnlyHi)+' met '+$('gLowBurners').value+' branders. Mix gebruikt dezelfde fase-instellingen binnen de gekozen uren. Gas: '+num('gasKwh')+' kWh/m³ × '+num('contractGas').toFixed(2)+' ct/kWh. Gemeten halve-uurtests kunnen afwijken bij langere beurten. De Zibro moduleert; het echte verbruik is pas bekend na een volledige tankcyclus. Buitentemperatuur en gewenste temperatuur helpen de warmtebehoefte beoordelen, maar bepalen deze tijdsprijzen niet. De vergelijking is indicatief en garandeert geen gelijk comfort. Gasradar is niet je contracttarief. Volg bij gebruik van een petroleumkachel de veiligheidsvoorschriften van de handleiding.</p></details></div>';

}
function render(){let opts='<option value="">Kies test of verwarmingsbeurt</option>'+db.tests.slice().reverse().map(t=>'<option value="t:'+t.id+'">🧪 '+t.when.replace('T',' ')+' — '+t.day+(t.gasM3!=null?' ✓':'')+'</option>').join('')+db.sessions.slice().reverse().map(s=>'<option value="s:'+s.id+'">🔥 '+s.date+' — '+s.zMinutes+' min Zibro / '+s.gMinutes+' min gas</option>').join('');let current=$('gasSession').value;$('gasSession').innerHTML=opts;if([...db.tests.map(t=>'t:'+t.id),...db.sessions.map(t=>'s:'+t.id)].includes(current))$('gasSession').value=current;let tank=db.tank||{};$('tankStatus').textContent=tank.status==='warning'?'⚠️ Bijvullen nodig':tank.status==='full'?'✓ Bijgevuld':db.zibroTankStart?'✓ Startvulling bekend':'Nog niet geregistreerd';$('tankWarningInfo').textContent=tank.status==='warning'?'Waarschuwing geregistreerd op '+(tank.warningDate||'onbekende datum')+'. Vul de tank volledig en registreer de liters.':tank.status==='full'?'Laatste volledige vulling: '+(tank.filledDate||'onbekend')+'.':db.zibroTankStart?'Startvulling 19 oktober tot het 7-literstreepje is bekend. Tik op de waarschuwing zodra de Zibro echt om petroleum vraagt.':'Tik op de waarschuwing zodra de Zibro erom vraagt.';let allH=db.sessions.reduce((a,s)=>a+s.zMinutes/60,0),used=db.refills.reduce((a,r)=>a+r.litres,0),tracked=db.refills.reduce((a,r)=>a+r.hours,0);$('tankInfo').textContent=(db.refills.some(r=>r.hours>0)?'Gemeten gemiddeld: '+rate().toFixed(3)+' liter/uur ('+db.refills.filter(r=>r.hours>0).length+' cycli).':'Werkelijk petroleumverbruik nog onbekend. Wacht tot de volgende echte tankvulling.');let z=0,g=0;
// Eén bron per brandregistratie: geregistreerde Zibro-runs incl. afzonderlijke en gemengde testen.
const runs=db.zibroRuns.filter(r=>Number.isFinite(Number(r.minutes))&&Number(r.minutes)>0);
const zHours=runs.reduce((sum,r)=>sum+Number(r.minutes)/60,0);
const zRate=rate(),zPrice=num('petrolPrice');z=zHours*zRate*zPrice;
// Oude gecombineerde sessies alleen meetellen als zij niet al als losse Zibro-run bestaan.
for(const s of db.sessions){const sessionStart=new Date(String(s.date||'')+'T00:00:00');const matchingRun=runs.some(r=>r.date===s.date);if(!matchingRun&&Number(s.zMinutes)>0)z+=Number(s.zMinutes)/60*zRate*zPrice;
if(s.gasM3!=null)g+=s.gasM3*(s.gasKwh||num('gasKwh'))*(s.gasPrice??gasPrice())}for(const t of db.tests){if(t.gasM3!=null)g+=t.gasM3*(t.gasKwh||num('gasKwh'))*(t.gasPrice??gasPrice())} for(const t of db.bellfiresTests||[]){if(t.gasM3!=null)g+=t.gasM3*(t.gasKwh||num('gasKwh'))*(t.gasPrice??gasPrice())} for(const t of db.mixedTests||[]){if(t.gasM3!=null)g+=t.gasM3*(t.gasKwh||num('gasKwh'))*(t.gasPrice??gasPrice())} $('totals').innerHTML='<div class="grid"><div class="result"><small>Zibro geschat</small><div class="price">'+money(z)+'</div></div><div class="result"><small>Gas gemeten</small><div class="price">'+money(g)+'</div></div></div><p><b>Samen: '+money(z+g)+'</b></p><small>Dit is de som van geregistreerde beurten, niet noodzakelijk je volledige energiefactuur. Zibro-branduren worden inclusief gemengde tests meegeteld. Petroleum blijft een schatting zolang geen tankcyclus is gemeten. Gas zonder P1 wordt niet als gemeten gas geboekt.</small>';$('testHistory').innerHTML=db.tests.length?db.tests.slice().reverse().map(t=>{let gas=t.gasM3!=null;let oldMatch=String(t.prediction||'').match(/Mijn plan:[^€]{0,70}€\s*([0-9]+[,.][0-9]{2})/);let predictionCost=t.predictionCost!=null?money(t.predictionCost):oldMatch?'€ '+oldMatch[1]:'Zie details';let dateLabel=String(t.when||'').replace('T',' ');return '<div class="test-entry"><div class="row"><strong>🧪 '+dateLabel+'</strong><span class="tag">'+(gas?'✓ Gemeten':'Start bewaard')+'</span></div><small>'+escapeHtml(t.day||'')+' · Buiten '+t.outside+'°C · Binnen '+t.inside+'°C → doel '+t.target+'°C · '+t.duration+' u</small><div class="row"><small>Voorspelling: <b>'+predictionCost+'</b></small><small>Gas: <b>'+(gas?t.gasM3.toFixed(2).replace('.',',')+' m³':'Nog te meten')+'</b></small></div>'+(gas?'<small>Gemeten gaskosten: <b>'+money(t.gasM3*(t.gasKwh||num('gasKwh'))*(t.gasPrice??gasPrice()))+'</b> · '+(t.gasMode==='day'?'Dagtotaal gas':'meterstanden')+'</small>':'')+'<details><summary>Werkelijke testduur corrigeren</summary><p class="tiny">De oorspronkelijke voorspelling blijft bewaard. Corrigeer alleen de echte duur van de test.</p><label>Werkelijke duur (minuten)</label><input type="number" min="1" max="1440" step="1" id="actualDuration-'+t.id+'" value="'+(t.actualMinutes??'')+'" placeholder="bv. 30"><button type="button" class="btn" data-fix-test="'+t.id+'">Bewaar werkelijke duur</button></details>'+ (t.actualMinutes!=null?'<small>Werkelijke testduur: <b>'+t.actualMinutes+' minuten</b> (voorspelde duur: '+t.duration+' uur)</small>':'<small>Werkelijke duur nog niet afzonderlijk bevestigd; '+t.duration+' uur is de oorspronkelijke voorspelling.</small>') +'<details><summary>Voorspelling en details</summary><div class="test-prediction">'+escapeHtml(t.prediction||'')+'</div></details></div>'}).join(''):'<p class="muted">Nog geen teststarts bewaard.</p>' ;$('history').innerHTML=db.sessions.length?db.sessions.slice().reverse().map(s=>'<div class="history"><strong>'+s.date+'</strong> — '+s.startTemp+' → '+s.endTemp+'°C<br><small>Zibro '+s.zMinutes+' min op '+s.zThermostat+'°C • Bellfires '+s.gMinutes+' min ('+s.burners+' brander(s))'+(s.gasM3!=null?' • P1 '+s.gasM3.toFixed(3)+' m³':' • P1 nog niet ingevoerd')+'</small></div>').join(''):'<p class="muted">Nog geen verwarmingsbeurten.</p>';if($('hwCombinedHistory'))$('hwCombinedHistory').classList.toggle('hidden',!db.sessions.length)}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('section').forEach(s=>s.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden');document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));render()});const calculateInputs=['outside','inside','target','duration','spot','gasExtra','zSplit','zHighTemp','zLowTemp','zHighHours','gHighBurners','gLowBurners','gHighHours'];
function markPending(){ $('comparison').classList.remove('fresh');$('calcPending').classList.remove('hidden');$('recalculate').textContent='↻ Bereken';$('recalculate').classList.add('pending'); }
function refreshSplitPreview(){const hours=Math.max(0,Number($('duration').value)||0),slider=$('zSplit');slider.max=hours;const zh=Math.min(hours,Math.max(0,Number(slider.value)||0));slider.value=zh;const gh=Math.max(0,hours-zh),fmt=h=>h.toLocaleString('nl-BE',{maximumFractionDigits:1})+' u';$('zTime').textContent=fmt(zh);$('gTime').textContent=fmt(gh);$('zBar').style.width=(hours?100*zh/hours:0)+'%';}
calculateInputs.forEach(id=>$(id).addEventListener('input',()=>{refreshSplitPreview();boundPhaseHours();markPending()}));
$('testHistory').addEventListener('click',e=>{const b=e.target.closest('[data-fix-test]');if(!b)return;const t=db.tests.find(x=>String(x.id)===b.dataset.fixTest);if(!t)return;const field=$('actualDuration-'+t.id),minutes=Number(field.value);if(!field.value||!Number.isInteger(minutes)||minutes<1||minutes>1440)return alert('Vul de werkelijke duur in minuten in.');if(!confirm('Werkelijke duur op '+minutes+' minuten zetten? De oorspronkelijke voorspelling blijft ongewijzigd.'))return;t.actualMinutes=minutes;save();});
$('recalculate').addEventListener('click',()=>{calculate();$('comparison').classList.add('fresh');$('calcPending').classList.add('hidden');$('recalculate').textContent='↻ Bereken';$('recalculate').classList.remove('pending')});$('saveTest').onclick=()=>{if(!$('calcPending').classList.contains('hidden'))return alert('Klik eerst op Bereken zodat de voorspelling actueel is.');const p=$('testP1').value.trim();if(p&&(!Number.isFinite(Number(p))||Number(p)<0))return alert('Controleer de P1-startstand.');let t={id:Date.now(),when:$('testTime').value||new Date().toLocaleString('sv-SE').replace(' ','T').slice(0,16),day:$('daytype').selectedOptions[0].textContent,outside:num('outside'),inside:num('inside'),target:num('target'),duration:num('duration'),spot:num('spot'),gasPrice:gasPrice(),petrolPrice:num('petrolPrice'),p1:p?Number(p):null,zHours:num('zSplit'),zHighTemp:num('zHighTemp'),zLowTemp:num('zLowTemp'),zHighHours:num('zHighHours'),gHighBurners:$('gHighBurners').value,gLowBurners:$('gLowBurners').value,gHighHours:num('gHighHours'),predictionCost:window.lastPlanCost??null,prediction:$('comparison').innerText};db.tests=db.tests||[];db.tests.push(t);save();$('testInfo').textContent='Teststart bewaard: '+t.when;alert('Teststart en voorspelling bewaard.');};$('saveSettings').onclick=()=>{db.settings={...db.settings,...settings()};$('purchasePriceToday').value=$('petrolPrice').value;updateSavings();save();markPending();alert('Instellingen bewaard')};$('saveSession').onclick=()=>{if(num('zMinutes')<0||num('gMinutes')<0)return alert('Vul geldige tijden in');db.sessions.push({id:Date.now(),date:$('sessionDate').value||stamp(),startTemp:num('startTemp'),endTemp:num('endTemp'),zMinutes:num('zMinutes'),zThermostat:num('zThermostat'),gMinutes:num('gMinutes'),burners:$('burners').value});save();alert('Verwarmingsbeurt bewaard')};$('gasMode').addEventListener('change',()=>{$('gasInfo').textContent=$('gasMode').value==='day'?'Vul twee dagtotalen van dezelfde dag in, bijvoorbeeld 0,0 en 0,4 m³. De app berekent het verschil.':'Vul de twee cumulatieve standen van de gasmeter in.'});$('saveGas').onclick=()=>{let choice=$('gasSession').value,record=choice.startsWith('t:')?db.tests.find(t=>'t:'+t.id===choice):db.sessions.find(t=>'s:'+t.id===choice);if(!record)return alert('Kies eerst een test of verwarmingsbeurt');let start=num('gasBegin'),end=num('gasEnd');if(!$('gasBegin').value||!$('gasEnd').value||!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<start)return alert('Controleer de meterstanden');if(record.gasM3!=null&&!confirm('Voor deze test bestaat al een gasmeting. Overschrijven?'))return;record.gasM3=end-start;record.gasBegin=start;record.gasEnd=end;record.gasMode=$('gasMode').value;record.gasPrice=gasPrice();record.gasKwh=num('gasKwh');save();alert('Gasmeting bewaard bij de gekozen test!')};$('tankWarning').onclick=()=>{db.tank={...(db.tank||{}),status:'warning',warningDate:stamp()};save()};$('saveRefill').onclick=()=>{let litres=num('refillLitres'),total=db.sessions.reduce((a,s)=>a+s.zMinutes/60,0);if(!Number.isFinite(litres)||litres<=0)return alert('Vul de werkelijk bijgevulde liters in.');if(!db.tank?.filledDate){if(!confirm('Eerste volledige vulling als STARTPUNT bewaren? De toegevoegde liters zijn nog geen gemeten verbruik.'))return;db.tank={status:'full',filledDate:stamp(),startHours:total,firstLitres:litres};save();alert('Startpunt van de tankmeting bewaard.');return;}if(db.tank.status!=='warning')return alert('Registreer eerst dat de Zibro om petroleum vraagt.');let last=db.tank.startHours??db.refills.at(-1)?.totalHours??0,hours=total-last;if(hours<=0)return alert('Registreer eerst de Zibro-branduren sinds de vorige vulling.');if(!confirm('Volledige tankcyclus afsluiten: '+litres+' liter bijgevuld na '+hours.toFixed(1)+' geregistreerde branduren?'))return;db.refills.push({date:stamp(),litres,hours,totalHours:total});db.tank={status:'full',filledDate:stamp(),startHours:total};save();alert('Tankcyclus bewaard.');};$('export').onclick=()=>{let blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='heatwise-backup-'+stamp()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('backupMessage').textContent='De download is gestart. Controleer in Bestandsbeheer → Download of heatwise-backup-'+stamp()+'.json aanwezig is. Je huidige metingen blijven bewaard.'};$('import').onchange=async e=>{try{let data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data.sessions)||!Array.isArray(data.refills)||!data.settings)throw Error();if(confirm('Let op: je huidige HeatWise-metingen en instellingen worden vervangen door de gegevens uit deze veiligheidskopie. Wil je doorgaan?')){db=data;save();location.reload()}}catch{alert('Ongeldige back-up')}};$('reset').onclick=()=>{if(confirm('WAARSCHUWING: alle opgeslagen HeatWise-metingen en instellingen op dit toestel worden definitief gewist. Heb je eerst een veiligheidskopie gemaakt?')){localStorage.removeItem(KEY);location.reload()}};for(const id of ['zHighTemp','zLowTemp','zHighHours','gHighBurners','gLowBurners','gHighHours']){const v=db.phase?.[id];if(v!==undefined)$(id).value=v;$(id).addEventListener('change',()=>{db.phase=Object.fromEntries(['zHighTemp','zLowTemp','zHighHours','gHighBurners','gLowBurners','gHighHours'].map(k=>[k,$(k).value]));localStorage.setItem(KEY,JSON.stringify(db))})};$('spot').value=Number(db.settings.spot??8.8).toLocaleString('nl-BE',{minimumFractionDigits:2,maximumFractionDigits:2});$('gasExtra').value=String(db.settings.gasExtra??3.40);$('spot').addEventListener('input',()=>{updateGasEstimate();markPending()});$('spot').addEventListener('blur',()=>{const price=num('spot');if(Number.isFinite(price)&&price>=0)$('spot').value=price.toLocaleString('nl-BE',{minimumFractionDigits:2,maximumFractionDigits:2})});$('gasExtra').addEventListener('input',()=>{updateGasEstimate();markPending()});updateGasEstimate();
const profileSettings={mild:{zHighTemp:22,zLowTemp:20,zHighHours:0.5,gHighBurners:2,gLowBurners:1,gHighHours:0.5},cold:{zHighTemp:23,zLowTemp:21,zHighHours:1,gHighBurners:2,gLowBurners:1,gHighHours:1},verycold:{zHighTemp:23,zLowTemp:21,zHighHours:1,gHighBurners:2,gLowBurners:1,gHighHours:1.5}};
const phaseIds=['zHighTemp','zLowTemp','zHighHours','gHighBurners','gLowBurners','gHighHours'];
function boundPhaseHours(){const total=Math.max(0,num('duration')||0),z=Math.min(total,Math.max(0,num('zSplit')||0)),g=Math.max(0,total-z);for(const [id,max] of [['zHighHours',z],['gHighHours',g]]){const el=$(id);el.max=String(max);const current=Number(el.value);if(!Number.isFinite(current)||current<0||current>max)el.value=String(Math.min(max,Math.max(0,current||0)));}}

$('weatherProfile').value=db.profile||'custom';
$('weatherProfile').addEventListener('change',()=>{const name=$('weatherProfile').value,profile=profileSettings[name];if(profile){for(const [id,value] of Object.entries(profile))$(id).value=value;db.phase=Object.fromEntries(phaseIds.map(id=>[id,$(id).value]));}boundPhaseHours();db.phase=Object.fromEntries(phaseIds.map(id=>[id,$(id).value]));db.profile=name;localStorage.setItem(KEY,JSON.stringify(db));markPending();});
phaseIds.forEach(id=>$(id).addEventListener('input',()=>{if($('weatherProfile').value!=='custom'){$('weatherProfile').value='custom';db.profile='custom';localStorage.setItem(KEY,JSON.stringify(db))}}));

const zNumber=id=>{const raw=$(id).value.trim().replace(',','.');return raw===''?null:(Number.isFinite(Number(raw))?Number(raw):NaN)};
function zRender(){const fmt=n=>n==null?'—':Number(n).toLocaleString('nl-BE',{maximumFractionDigits:2})+'°C';
const oldLogs=db.zibroLogs.filter(x=>!x.testId||!db.zibroTests.some(t=>t.id===x.testId));
$('zibroLog').innerHTML='<details><summary>Bekijk eerdere temperatuurmetingen ('+oldLogs.length+')</summary>'+oldLogs.slice().sort((a,b)=>(b.date+(b.time||'')).localeCompare(a.date+(a.time||''))).map(x=>'<div class="history hw-measurement"><b>'+escapeHtml(x.date)+' '+escapeHtml(x.time||'tijd onbekend')+'</b><div>Living '+fmt(x.living)+' · Keuken '+fmt(x.kitchen)+' · Buiten '+fmt(x.outside)+' · SET '+fmt(x.set)+' · ROOM '+fmt(x.room)+'</div><small>'+(x.type==='geschat'?'⚠️ Geschat':'✓ Gemeten / gemeld')+(x.note?' — '+escapeHtml(x.note):'')+'</small><button type="button" class="hw-measure-delete" data-zold-delete="'+escapeHtml(x.id)+'" aria-label="Verwijder deze meting" title="Verwijder meting">🗑</button></div>').join('')+'</details>';
const relevantRuns=db.zibroRuns.filter(r=>r.date>='2026-10-19');
const minutes=relevantRuns.reduce((n,r)=>n+(Number(r.minutes)||0),0);
$('zRunSummary').textContent='Sinds 19 oktober: '+Math.floor(minutes/60)+' uur en '+minutes%60+' minuten ('+relevantRuns.length+' brandbeurt'+(relevantRuns.length===1?'':'en')+').';
const legacyRuns=relevantRuns.filter(r=>r.source!=='zibroTest');
const legacyBox=$('hwLegacyRuns');if(legacyBox)legacyBox.innerHTML=legacyRuns.length?legacyRuns.slice().reverse().map(r=>'<div class="history hw-measurement"><strong>'+escapeHtml(r.date||'')+' · '+escapeHtml(r.start||'')+'–'+escapeHtml(r.end||'')+'</strong><div>'+Math.floor((Number(r.minutes)||0)/60)+' uur '+(Number(r.minutes)||0)%60+' minuten (handmatig geregistreerd)</div></div>').join(''):'<p class="tiny">Geen aparte handmatige branduren.</p>';
const legacyDetail=$('hwLegacyRunsDetails');if(legacyDetail)legacyDetail.classList.toggle('hidden',!legacyRuns.length);
$('zCycleSummary').classList.toggle('hidden',!db.zibroCycles.length);$('zCycleSummary').textContent=db.zibroCycles.length?'Laatste afgesloten tankcyclus: '+db.zibroCycles.at(-1).litres.toLocaleString('nl-BE')+' liter / '+db.zibroCycles.at(-1).hours.toLocaleString('nl-BE',{maximumFractionDigits:2})+' uur = '+db.zibroCycles.at(-1).rate.toLocaleString('nl-BE',{maximumFractionDigits:3})+' l/uur.':'Nog geen werkelijk gemeten petroleumverbruik. De kosten op Vandaag blijven een modelschatting.';
}
$('zLogDate').value=stamp();$('zRunDate').value=stamp();if(stamp()==='2026-10-19')$('zRunStart').value='18:00';
$('zAddLog').onclick=()=>{const date=$('zLogDate').value,fields=[['zLogLiving','living'],['zLogKitchen','kitchen'],['zLogOutside','outside'],['zLogSet','set'],['zLogRoom','room']];if(!date)return alert('Vul een datum in');let x={id:Date.now().toString(),date,time:$('zLogTime').value,type:$('zLogType').value,note:$('zLogNote').value};for(const [id,k] of fields){x[k]=zNumber(id);if(Number.isNaN(x[k]))return alert('Controleer de temperatuur: '+id)}if(x.living==null&&x.kitchen==null)return alert('Vul minstens één binnentemperatuur in');db.zibroLogs.push(x);save();zRender();alert('Zibro-meting bewaard')};
$('zAddRun').onclick=()=>{const date=$('zRunDate').value,a=$('zRunStart').value,b=$('zRunEnd').value;if(!date||!a||!b)return alert('Vul datum, start en einde in');const mins=t=>{let [h,m]=t.split(':').map(Number);return h*60+m};let diff=mins(b)-mins(a);if(diff<=0)diff+=1440;if(diff>1200)return alert('Controleer de uren (maximaal 20 uur per beurt)');if(db.zibroRuns.some(r=>r.date===date&&r.start===a&&r.end===b))return alert('Deze branduren zijn al geregistreerd.');db.zibroRuns.push({id:Date.now(),date,start:a,end:b,minutes:diff});save();zRender();alert('Branduren bewaard')};
$('zCloseCycle').onclick=()=>{const litres=zNumber('zRefillLitres'),hours=db.zibroRuns.filter(r=>r.date>='2026-10-19').reduce((n,r)=>n+r.minutes,0)/60-db.zibroCycles.reduce((n,r)=>n+r.hours,0);if(litres==null||!Number.isFinite(litres)||litres<=0||hours<=0)return alert('Vul werkelijk bijgevulde liters in en registreer alle branduren');if(!confirm('Tankcyclus afsluiten met '+litres+' werkelijk bijgevulde liters over '+hours.toFixed(2)+' branduren?'))return;db.zibroCycles.push({date:stamp(),litres,hours,rate:litres/hours});save();zRender();alert('Tankcyclus bewaard. Let op: controleer of alle branduren ingevoerd zijn.')};

// v1.9.27: eenvoudige Zibro-brandtesten; dezelfde lokale opslag en back-up als bestaande metingen.
db.zibroTests=db.zibroTests||[];db.bellfiresTests=db.bellfiresTests||[];
const hwNow=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':')};
const hwLocalDate=(iso)=>iso.slice(0,10);
const hwLocalTime=(iso)=>iso.slice(11,16);
const hwMinutes=(start,end)=>Math.round((new Date(end).getTime()-new Date(start).getTime())/60000);
const hwNum=(id)=>{const raw=$(id).value.trim().replace(',','.');if(!raw)return null;const n=Number(raw);return Number.isFinite(n)?n:NaN};
function hwCurrent(){return db.zibroTests.find(t=>t.status==='active')||null}
function hwRenderSavedTests(){
 const box=$('hwSavedTests');if(!box)return;
 const tests=db.zibroTests.slice().reverse();
 if(!tests.length){box.innerHTML='<p class="muted">Nog geen brandtesten met Start en Stop. Je oudere metingen vind je hieronder.</p>';return;}
 const fmtVal=v=>v==null||v===''?'—':Number(v).toLocaleString('nl-BE',{maximumFractionDigits:2})+' °C';
 const entries=t=>Array.isArray(t.measurements)?t.measurements:[];
 box.innerHTML=tests.map(t=>{
  const active=t.status==='active';
  const start=escapeHtml(String(t.start||'').replace('T',' ').slice(0,16));
  const end=escapeHtml(String(t.end||'').replace('T',' ').slice(0,16));
  const mins=Number(t.minutes)||0;
  const list=entries(t);
  const label=active?'🟢 Lopende test':'✓ Afgeronde test';
  const details=list.length?list.map(m=>'<div class="hw-measurement"><strong>'+escapeHtml((m.date||'')+' '+(m.time||''))+(m.final?' · eindmeting':'')+'</strong><div>Living '+fmtVal(m.living)+' · Buiten '+fmtVal(m.outside)+'</div><div>Zibro SET '+fmtVal(m.set)+' · ROOM '+fmtVal(m.room)+(m.kitchen!=null?' · Keuken '+fmtVal(m.kitchen):'')+'</div>'+(m.note?'<div class="hw-note">📝 '+escapeHtml(m.note)+'</div>':'')+'<button type="button" class="hw-measure-delete" data-hw-measure="'+escapeHtml(m.id)+'" data-hw-test="'+escapeHtml(t.id)+'" aria-label="Verwijder deze temperatuurmeting" title="Verwijder meting">🗑</button></div>').join(''):'<p class="tiny">Nog geen temperatuurmetingen binnen deze test.</p>';
  const stopNote=t.stopNote?'<div class="hw-note">Stopopmerking: '+escapeHtml(t.stopNote)+'</div>':'';
  const warning=t.warning?'<p class="tiny">'+escapeHtml(t.warning)+'</p>':'';
  return '<div class="hw-test-entry"><div class="hw-test-head"><b>'+label+'</b><span>'+start+'</span></div>'+
   '<p class="tiny">'+(active?'Brandtijd loopt vanaf de start.': 'Einde: '+end+' · '+Math.floor(mins/60)+' u '+mins%60+' min')+' · '+list.length+' meting(en)</p>'+
   '<details '+(active?'open':'')+'><summary>Bekijk '+list.length+' temperatuurmeting(en) en opmerkingen</summary>'+details+stopNote+'</details>'+warning+
   (active?'':'<button type="button" class="btn danger hw-delete-button" data-hw-delete="'+escapeHtml(t.id)+'">🗑️ Verwijder deze test</button>')+'</div>';
 }).join('');
}
function hwDeleteTest(id){
 const t=db.zibroTests.find(x=>x.id===id);if(!t)return;
 const count=Array.isArray(t.measurements)?t.measurements.length:0;
 const reason=t.status==='active'?'Deze lopende proef':'Deze afgeronde test';
 const warning=t.inTankCycle&&db.zibroCycles.length?'\nLET OP: er zijn al tankcycli afgesloten. Controleer na het verwijderen of je historische verbruikscijfers nog kloppen.':'';
 if(!confirm(reason+' verwijderen, inclusief '+count+' bijbehorende temperatuurmeting(en) en eventueel geregistreerde branduren?\n\nAndere Zibro-metingen, echte brandbeurten en instellingen blijven behouden.'+warning))return;
 db.zibroTests=db.zibroTests.filter(x=>x.id!==id);
 db.zibroLogs=db.zibroLogs.filter(x=>x.testId!==id);
 db.zibroRuns=db.zibroRuns.filter(x=>!(x.source==='zibroTest'&&x.id===id));
 hwStoppedAt=null;
 $('hwStopNote').value='';$('hwNote').value='';$('hwMeasurementFeedback').textContent='';
 save();zRender();hwUpdate();
 alert('De proef is verwijderd. Bijbehorende metingen en branduren tellen niet meer mee.');
}
let hwLastAutoFill='';
function hwAutofill(t){if(!t||!t.measurements?.length)return;const m=t.measurements.at(-1),key=t.id+':'+m.id;if(hwLastAutoFill===key)return;for(const [id,name] of [['hwOutside','outside'],['hwLiving','living'],['hwSet','set'],['hwRoom','room'],['hwKitchen','kitchen']])$(id).value=m[name]==null?'':String(m[name]);$('hwNote').value='';hwLastAutoFill=key;}
function hwUpdate(){hwRenderSavedTests();const t=hwCurrent(),active=!!t;if(active)hwAutofill(t);$('hwStartTest').classList.toggle('hidden',active);$('hwActiveTest').classList.toggle('hidden',!active);$('hwStopOptions').classList.add('hidden');if(active){$('hwTestStatus').textContent='🟢 Test loopt sinds '+t.start.replace('T',' ').slice(0,16)+' · '+t.measurements.length+' meting(en) opgeslagen.'; $('hwTestSummary').textContent='Je kunt HeatWise sluiten: deze test blijft bewaard tot je hem stopt.';}else{$('hwTestStatus').textContent='Geen lopende Zibro-test.';const last=db.zibroTests.at(-1);$('hwTestSummary').textContent=last&&last.status==='finished'?'Laatste test: '+last.start.replace('T',' ').slice(0,16)+' · '+last.minutes+' minuten brandtijd.':'';}}
function hwReadMeasurement(when,final=false){const vals=[['hwOutside','outside'],['hwLiving','living'],['hwSet','set'],['hwRoom','room'],['hwKitchen','kitchen']];const m={id:'hw-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),when,date:hwLocalDate(when),time:hwLocalTime(when),type:'gemeten',note:$('hwNote').value.trim(),final};for(const [id,key] of vals){m[key]=hwNum(id);if(Number.isNaN(m[key])){alert('Controleer het getal bij '+$(id).previousElementSibling.textContent);return null}}if(m.living==null&&m.kitchen==null){alert('Vul minstens de livingtemperatuur in.');return null}return m}
function hwStoreMeasurement(m,t){t.measurements.push(m);db.zibroLogs.push({...m,testId:t.id});save();zRender();$('hwNote').value='';$('hwMeasurementFeedback').textContent='Meting van '+m.time+' bewaard. De test loopt verder.';hwUpdate()}
$('hwSavedTests').addEventListener('click',e=>{
 const one=e.target.closest('[data-hw-measure]');if(one){const t=db.zibroTests.find(x=>x.id===one.dataset.hwTest);if(!t)return;const m=t.measurements.find(x=>x.id===one.dataset.hwMeasure);if(!m)return;if(!confirm('Alleen deze Zibro-temperatuurmeting en haar opmerking verwijderen? Branduren en andere metingen blijven behouden.'))return;t.measurements=t.measurements.filter(x=>x.id!==m.id);db.zibroLogs=db.zibroLogs.filter(x=>!(x.testId===t.id&&x.id===m.id));save();zRender();hwUpdate();return;}
 const b=e.target.closest('[data-hw-delete]');if(b)hwDeleteTest(b.dataset.hwDelete)
});
$('zibroLog').addEventListener('click',e=>{const b=e.target.closest('[data-zold-delete]');if(!b)return;const m=db.zibroLogs.find(x=>String(x.id)===b.dataset.zoldDelete);if(!m)return;if(!confirm('Alleen deze oudere temperatuurmeting en haar opmerking verwijderen?'))return;if(String(m.id).startsWith('initial-'))db.deletedInitialLogIds.push(m.id);db.zibroLogs=db.zibroLogs.filter(x=>x.id!==m.id);save();zRender()});
$('hwDiscardActive').onclick=()=>{const t=hwCurrent();if(t)hwDeleteTest(t.id)};
$('hwDiscardFromStop').onclick=()=>{const t=hwCurrent();if(t)hwDeleteTest(t.id)};
$('hwStartTest').onclick=()=>{if(hwCurrent())return alert('Er loopt al een test.');const start=hwNow();hwLastAutoFill='';for(const id of ['hwOutside','hwLiving','hwSet','hwRoom','hwKitchen','hwNote'])$(id).value='';db.zibroTests.push({id:'test-'+Date.now(),start,status:'active',measurements:[],startNote:''});save();$('hwMeasurementFeedback').textContent='';hwUpdate()};
$('hwSaveMeasurement').onclick=()=>{const t=hwCurrent();if(!t)return;const m=hwReadMeasurement(hwNow());if(m)hwStoreMeasurement(m,t)};
let hwStoppedAt=null;
$('hwStopTest').onclick=()=>{if(!hwCurrent())return;hwStoppedAt=hwNow();$('hwStopOptions').classList.remove('hidden')};
$('hwCancelStop').onclick=()=>{hwStoppedAt=null;$('hwStopOptions').classList.add('hidden')};
function hwFinish(withReading){const t=hwCurrent();if(!t)return;const end=hwStoppedAt||hwNow(),mins=hwMinutes(t.start,end);if(mins<0)return alert('Het einduur ligt voor het startuur. Controleer de klok van je toestel.');if(mins>60*24*7&&!confirm('Deze test duurt meer dan 7 dagen. Klopt dat?'))return;
let m=null;if(withReading){m=hwReadMeasurement(end,true);if(!m)return;}const stopNote=$('hwStopNote').value.trim();if(m){m.note=[m.note,stopNote].filter(Boolean).join(' · ');hwStoreMeasurement(m,t)}t.status='finished';t.end=end;t.minutes=mins;t.stopNote=stopNote;
const date=hwLocalDate(t.start),start=hwLocalTime(t.start),finish=hwLocalTime(end);
// Gebruik dezelfde lijst als de oude tankcyclus, zonder bestaande branduren te verdubbelen.
const overlap=db.zibroRuns.some(r=>{const a=new Date(r.date+'T'+r.start+':00').getTime();let b=new Date(r.date+'T'+r.end+':00').getTime();if(b<=a)b+=86400000;return new Date(t.start).getTime()<b&&new Date(t.end).getTime()>a});
if(!overlap){db.zibroRuns.push({id:t.id,date,start,end:finish,minutes:mins,source:'zibroTest'});t.inTankCycle=true;}else{t.inTankCycle=false;t.warning='Brandtijd overlapt een eerder geregistreerde beurt en is niet dubbel toegevoegd.';}
save();zRender();$('hwStopNote').value='';$('hwNote').value='';hwStoppedAt=null;hwUpdate();alert('Test beëindigd. Brandtijd: '+Math.floor(mins/60)+' u '+mins%60+' min.'+(t.inTankCycle?'':' Let op: overlappende branduren zijn niet dubbel geteld.'))}
$('hwFinishNoReading').onclick=()=>hwFinish(false);
$('hwFinishWithReading').onclick=()=>hwFinish(true);
// Laat de laatst ingevulde temperaturen staan voor volgende metingen.
hwUpdate();
zRender();
refreshSplitPreview();boundPhaseHours();render();$('comparison').innerHTML='<div class="card cost-panel"><div class="compare-heading"><strong>Geschatte kosten</strong><small>Klik op Bereken</small></div><div class="cost-grid">'+['Zibro','Mijn mix','Bellfires'].map((x,i)=>'<div class="cost-choice"><div class="choice-icon"><img class="scene-photo" src="./'+['zibro-scene.jpg','mix-icons-v1932.jpg','bellfires-scene.jpg'][i]+'" alt="'+x+'" loading="eager"></div><strong>'+x+'</strong><div class="choice-price">—</div></div>').join('')+'</div></div>';if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

;

/* HeatWise v1.9.30: Statbel-petroleum C en GasRadar-weergave. Bestaande metingen ongewijzigd. */
(function(){
 const el=id=>document.getElementById(id);
 const tabs=document.querySelectorAll('[data-tab]');
 const money4=n=>Number(n).toLocaleString('nl-BE',{minimumFractionDigits:4,maximumFractionDigits:4});
 const gas2=n=>Number(n).toLocaleString('nl-BE',{minimumFractionDigits:2,maximumFractionDigits:2});
 const SOURCE='https://bestat.statbel.fgov.be/bestat/api/views/c42c9c16-9330-437b-9608-13781b795ec1/result/JSON';
  const HISTORY_SOURCE='https://bestat.statbel.fgov.be/bestat/api/views/ef2a5bfb-a361-47a6-b113-e3df26563404/result/JSON';
 let weather=null, officialPetrol=null,gasRadar=null;
  const belgiumToday=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const isoDate=(str)=>{let x=String(str||'').trim();if(/^\d{4}-\d{2}-\d{2}/.test(x))return x.slice(0,10);let m=x.toLowerCase().match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(m)return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');m=x.toLowerCase().match(/^(\d{1,2})(jan|feb|mrt|mar|apr|mei|jun|jul|aug|sep|okt|nov|dec)(\d{2,4})$/);if(m){const months=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];return (m[3].length===2?'20'+m[3]:m[3])+'-'+String(months.indexOf(m[2])+1).padStart(2,'0')+'-'+m[1].padStart(2,'0')}return null};
 function showSources(){
  document.querySelectorAll('main section').forEach(x=>x.classList.add('hidden'));
  el('sources').classList.remove('hidden');tabs.forEach(x=>x.classList.remove('active'));
  const gas=Number(el('spot').value.replace(',','.'));
  el('srcGasInput').value=Number.isFinite(gas)?gas2(gas):'';
  el('srcGas').textContent=Number.isFinite(gas)?gas2(gas)+' ct/kWh (huidige invoer)':'Geen prijs ingevuld';
  const priceField=el('currentPetrolPrice')||el('petrolCurrent')||el('currentPrice');
  const current=Number(priceField?.value);
  el('srcPetrolInput').value=priceField?.value||'';el('srcPetrolDate').value=el('srcPetrolDate').value||db.settings.petrolPriceEffectiveDate||belgiumToday();
  el('srcPetrol').textContent=Number.isFinite(current)?'Huidige prijs in HeatWise: € '+money4(current)+'/L':'Huidige prijs in HeatWise: —';
 }
 el('openSources').addEventListener('click',()=>{showSources();loadWeather();loadPetrol();loadGasRadar()});
 el('backSources').addEventListener('click',()=>{
  el('sources').classList.add('hidden');el('today').classList.remove('hidden');
  tabs.forEach(x=>x.classList.toggle('active',x.dataset.tab==='today'));
 });
 async function fetchTimed(url,seconds){
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),seconds*1000);
  try{const response=await fetch(url,{signal:controller.signal,cache:'no-store',credentials:'omit'});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return await response.json();
  }finally{clearTimeout(timeout)}
 }
 async function loadWeather(){
  el('srcWeather').textContent='Ophalen…';el('applyWeather').disabled=true;
  try{
   const j=await fetchTimed('https://api.open-meteo.com/v1/forecast?latitude=50.8074&longitude=5.1037&current=temperature_2m&timezone=Europe%2FBrussels',10);
   const n=j?.current?.temperature_2m;
   if(typeof n!=='number'||!Number.isFinite(n))throw new Error('Geen temperatuur');
   weather=n;el('srcWeather').textContent=n.toLocaleString('nl-BE',{maximumFractionDigits:1})+' °C';
   el('srcWeatherInfo').textContent='Open-Meteo · '+(j.current.time||'tijd onbekend')+' · Tienen (weermodel). Je kunt dit altijd aanpassen.';
   el('applyWeather').disabled=false;
  }catch(err){weather=null;el('srcWeather').textContent='Niet beschikbaar';el('srcWeatherInfo').textContent='Automatisch ophalen mislukt. Controleer je verbinding of gebruik de weerwebsite.';}
 }
 // Statbel publiceert een vrije JSON-export. Alleen exact lamppetroleum C aan de pomp, prijs incl. btw.
 // Let op: browserbeveiliging (CORS) van de bron kan direct ophalen verhinderen.
 async function loadGasRadar(){
   gasRadar=null;el('useGasRadar').disabled=true;el('srcGasAutoStatus').textContent='GasRadar ophalen…';
   try{
     const j=await fetchTimed('https://gasradar.be/api/now',10);
     const price=Number(j?.price?.centPerKwh),date=isoDate(j?.price?.todayDate);
     if(!Number.isFinite(price)||price<=0||price>100||!date)throw new Error('Ongeldig API-antwoord');
     const current=belgiumToday();gasRadar={price,date};
     el('srcGasAutoStatus').textContent='GasRadar · gasdag '+date+' · '+gas2(price)+' ct/kWh. '+(date<current?'Prijs van eerdere gasdag; controleer de datum.':'Actuele gasdag.') ;
     el('useGasRadar').disabled=false;
     // Alleen automatisch overnemen wanneer dezelfde gasdag actief is, nooit een oudere prijs stilzwijgend overschrijven.
     if(date===current){el('spot').value=gas2(price);el('spot').dispatchEvent(new Event('input',{bubbles:true}));el('srcGas').textContent=gas2(price)+' ct/kWh (GasRadar · '+date+')';}
   }catch(err){el('srcGasAutoStatus').textContent='Automatisch ophalen niet mogelijk. Handmatige GasRadar-invoer blijft beschikbaar; je bestaande prijs is niet gewijzigd.';}
 }
 async function loadPetrol(){
  officialPetrol=null;el('useOfficialPetrol').disabled=true;
  el('srcOfficialPetrol').textContent='Officiële prijs ophalen…';
  el('srcPetrolInfo').textContent='Statbel: huidige en aangekondigde petroleum C-prijzen controleren…';
  try{
   // De "laatste wijziging" kan morgen al bevatten. Zoek daarom ook in het historische overzicht.
   const [latest,history]=await Promise.allSettled([fetchTimed(SOURCE,12),fetchTimed(HISTORY_SOURCE,12)]);
   const rows=[];for(const r of [latest,history])if(r.status==='fulfilled'&&Array.isArray(r.value?.facts))rows.push(...r.value.facts);
   if(!rows.length)throw new Error('Geen gegevens');
   const matches=rows.filter(x=>/lamppetroleum\s*\(type\s*c\)\s*\(aan\s*de\s*pomp\)/i.test(String(x.Product||x.Producten||'')))
     .map(x=>({price:Number(String(x['Prijs incl. BTW']||'').replace(',','.')),date:isoDate(x.Dag||x.Datum)}))
     .filter(x=>Number.isFinite(x.price)&&x.price>.1&&x.price<10&&x.date);
   const today=belgiumToday();const effective=matches.filter(x=>x.date<=today).sort((a,b)=>b.date.localeCompare(a.date))[0];
   const next=matches.filter(x=>x.date>today).sort((a,b)=>a.date.localeCompare(b.date))[0];
   if(effective){officialPetrol=effective;el('srcOfficialPetrol').textContent='€ '+money4(effective.price)+'/L · geldig '+effective.date;el('useOfficialPetrol').disabled=false;}
   else el('srcOfficialPetrol').textContent='Huidige officiële prijs niet vastgesteld';
   el('srcPetrolInfo').textContent='Statbel/FOD Economie · lamppetroleum C aan de pomp, incl. btw.'+
     (effective?' Huidige geldige maximumprijs vanaf '+effective.date+'.':' Huidige geldige prijs niet gevonden; bestaande invoer behouden.')+
     (next?' Aangekondigd vanaf '+next.date+': € '+money4(next.price)+'/L (nog NIET actueel).':'')+' Werkelijke stationsprijs kan afwijken.';
  }catch(error){
   el('srcOfficialPetrol').textContent='Automatisch ophalen niet gelukt';
   el('srcPetrolInfo').textContent='Statbel niet bereikbaar vanuit de app. De bestaande prijs blijft staan. Controleer de officiële tabel of voer handmatig een geldige prijs en datum in.';
  }
 }
 el('refreshWeather').addEventListener('click',loadWeather);
 el('refreshPetrol').addEventListener('click',loadPetrol);el('refreshGasRadar').addEventListener('click',loadGasRadar);el('useGasRadar').addEventListener('click',()=>{if(!gasRadar)return;el('srcGasInput').value=gas2(gasRadar.price);el('applyGas').click()});
 el('applyWeather').addEventListener('click',()=>{if(weather===null)return;el('outside').value=String(weather);el('outside').dispatchEvent(new Event('input',{bubbles:true}));el('backSources').click()});
 el('applyGas').addEventListener('click',()=>{
  const n=Number(el('srcGasInput').value.replace(',','.'));
  if(!Number.isFinite(n)||n<0||!el('srcGasInput').value.trim())return alert('Vul een geldige gasprijs in.');
  el('spot').value=gas2(n);el('spot').dispatchEvent(new Event('input',{bubbles:true}));
  el('srcGas').textContent=gas2(n)+' ct/kWh (handmatig)';
  alert('GasRadar-prijs aangepast. Klik op Bereken om de vergelijking bij te werken.');
 });
 function applyPetroleum(price,source,effectiveDate){
  const target=el('currentPetrolPrice')||el('petrolCurrent')||el('currentPrice');
  if(!target){alert('Geen veilig petroleumprijsveld gevonden.');return}
  if(effectiveDate&&isoDate(effectiveDate)>belgiumToday()){alert('Deze petroleumprijs gaat pas in op '+effectiveDate+'. De huidige prijs blijft behouden.');return}
  target.value=String(price);db.settings.petrolPriceEffectiveDate=isoDate(effectiveDate)||belgiumToday();db.settings.petrolPriceSource=source;localStorage.setItem(KEY,JSON.stringify(db));
  target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));
  el('srcPetrolInput').value=String(price);
  el('srcPetrol').textContent='Huidige prijs in HeatWise: € '+money4(price)+'/L ('+source+')';
  alert('Actuele petroleumprijs bijgewerkt. Je eigen aankoopprijs blijft ongewijzigd.');
 }
 el('useOfficialPetrol').addEventListener('click',()=>{
  if(!officialPetrol)return;
  applyPetroleum(officialPetrol.price,'officiële maximumprijs, '+officialPetrol.date,officialPetrol.date);
 });
 el('applyPetrol').addEventListener('click',()=>{
  const raw=el('srcPetrolInput').value.trim().replace(',','.');const n=Number(raw);
  if(!raw||!Number.isFinite(n)||n<0)return alert('Vul een geldige petroleumprijs in.');
  applyPetroleum(n,'handmatig',el('srcPetrolDate').value||belgiumToday());
 });
  // GasRadar proberen te laden zodra HeatWise start; handmatige invoer blijft steeds mogelijk.
  loadGasRadar();
})();

;

// Bellfires: start / meet / stop / wacht op P1; onafhankelijk van oude Bellfires-data.
(function(){
 const el=id=>document.getElementById(id),now=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':')};
 const minutes=(a,b)=>Math.round((new Date(b)-new Date(a))/60000);
 const active=()=>db.bellfiresTests.find(x=>x.status==='active')||null;
 const format=v=>v==null?'—':Number(v).toLocaleString('nl-BE',{maximumFractionDigits:2})+' °C';
 const localDate=iso=>String(iso||'').replace('T',' ').slice(0,16);
 let filledKey='';
 const saveDb=()=>{localStorage.setItem(KEY,JSON.stringify(db));render();draw();};
 const prefill=t=>{if(!t?.measurements?.length)return;const m=t.measurements.at(-1),key=t.id+':'+m.when;if(filledKey===key)return;for(const [id,k] of [['bellOutside','outside'],['bellLiving','living'],['bellKitchen','kitchen']])el(id).value=m[k]==null?'':String(m[k]);el('bellBurners').value=String(m.burners||'1');el('bellNote').value='';filledKey=key;};
 function draw(){
  const t=active();el('bellStart').classList.toggle('hidden',!!t);el('bellActive').classList.toggle('hidden',!t);
  el('bellStatus').textContent=t?'🟢 Test loopt sinds '+localDate(t.start)+' · '+(t.measurements||[]).length+' meting(en) opgeslagen.':'Geen lopende Bellfires-test.';
  if(t)prefill(t);
  el('bellSaved').innerHTML=db.bellfiresTests.slice().reverse().map(x=>{
   const running=x.status==='active',pending=x.status==='waiting',list=x.measurements||[],mins=x.minutes||0;
   const label=running?'🟢 Lopende test':pending?'⏳ Wacht op P1':'✓ Afgeronde test';
   const notes=list.map((m,i)=>'<div class="hw-measurement"><strong>'+escapeHtml(localDate(m.when))+'</strong><div>Living '+format(m.living)+' · Buiten '+format(m.outside)+' · '+(m.burners||'?')+' brander(s)'+(m.kitchen!=null?' · Keuken '+format(m.kitchen):'')+'</div>'+(m.note?'<div class="hw-note">📝 '+escapeHtml(m.note)+'</div>':'')+'<button type="button" class="hw-measure-delete" data-bell-measure="'+i+'" data-bell-parent="'+escapeHtml(x.id)+'" aria-label="Verwijder deze temperatuurmeting" title="Verwijder meting">🗑</button></div>').join('')||'<p class="tiny">Nog geen temperatuurmetingen.</p>';
   const dur=running?'Brandtijd loopt vanaf de start':'Einde: '+localDate(x.end)+' · '+Math.floor(mins/60)+' u '+mins%60+' min';
   const p1=running?'':`<div class="hw-p1-panel"><strong>${pending?'⏳ P1-gegevens later aanvullen':'Gasverbruik gemeten'}</strong><p class="tiny">De brandtijd blijft vaststaan op het moment van Stop. Meterstanden mogen later worden aangevuld.</p><label>Soort meterstanden</label><select data-bell-mode="${x.id}"><option value="day" ${x.gasMode==='day'?'selected':''}>Dagtotaal gas (m³)</option><option value="meter" ${x.gasMode==='meter'?'selected':''}>Cumulatieve gasmeterstand (m³)</option></select><div class="grid"><div><label>Beginstand (m³)</label><input inputmode="decimal" data-bell-begin="${x.id}" value="${x.gasBegin??x.initialP1??''}" placeholder="bv. 1250,40"></div><div><label>Eindstand (m³)</label><input inputmode="decimal" data-bell-end="${x.id}" value="${x.gasEnd??''}" placeholder="bv. 1250,80"></div></div><button type="button" class="btn wide" data-bell-p1="${x.id}">${pending?'Bewaar P1-verbruik':'Corrigeer P1-gegevens'}</button>${x.gasM3!=null?'<p class="tiny">Gemeten: <strong>'+x.gasM3.toLocaleString('nl-BE',{maximumFractionDigits:3})+' m³</strong> · '+money(x.gasM3*(x.gasKwh||10.5)*(x.gasPrice??gasPrice()))+'</p>':''}</div>`;
   return '<div class="hw-test-entry"><div class="hw-test-head"><b>'+label+'</b><span>'+escapeHtml(localDate(x.start))+'</span></div><p class="tiny">'+dur+' · '+list.length+' meting(en)</p><details '+(running?'open':'')+'><summary>Bekijk temperatuurmetingen en opmerkingen</summary>'+notes+(x.stopNote?'<div class="hw-note">Stop: '+escapeHtml(x.stopNote)+'</div>':'')+'</details>'+p1+'<button type="button" class="btn danger hw-delete-button" data-bell-delete="'+x.id+'">🗑️ Verwijder deze test</button></div>';
  }).join('')||'<p class="muted">Nog geen Bellfires-testen met de nieuwe start- en stopknoppen. Oudere gasmetingen staan hieronder.</p>';
 }
 const getNum=id=>{const raw=el(id).value.trim().replace(',','.');return raw===''?null:Number(raw)};
 el('bellStart').onclick=()=>{if(active())return;const start=now();db.bellfiresTests.push({id:'bell-'+Date.now(),start,status:'active',measurements:[],gasM3:null,gasPrice:gasPrice(),gasKwh:num('gasKwh')});filledKey='';for(const id of ['bellOutside','bellLiving','bellKitchen','bellNote','bellStopNote'])el(id).value='';el('bellFeedback').textContent='';saveDb()};
 el('bellSaveTemp').onclick=()=>{const t=active();if(!t)return;const outside=getNum('bellOutside'),living=getNum('bellLiving'),kitchen=getNum('bellKitchen');if(living==null||![living,outside,kitchen].filter(x=>x!=null).every(Number.isFinite))return alert('Vul een geldige livingtemperatuur in en controleer de andere waarden.');const when=now();t.measurements.push({id:'bm-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),when,living,outside,kitchen,burners:Number(el('bellBurners').value),note:el('bellNote').value.trim()});el('bellFeedback').textContent='Meting van '+when.slice(11,16)+' bewaard. Test loopt verder.';el('bellNote').value='';saveDb()};
 el('bellStop').onclick=()=>{const t=active();if(!t)return;t.end=now();t.minutes=minutes(t.start,t.end);if(t.minutes<0)return alert('Controleer de klok op je toestel.');t.status='waiting';t.stopNote=el('bellStopNote').value.trim();saveDb();alert('Bellfires-test gestopt. Brandtijd: '+Math.floor(t.minutes/60)+' u '+t.minutes%60+' min. De P1-gegevens kun je later invullen.');};
 el('bellDiscard').onclick=()=>{const t=active();if(!t)return;if(!confirm('Deze lopende Bellfires-proef en al haar metingen verwijderen?'))return;db.bellfiresTests=db.bellfiresTests.filter(x=>x.id!==t.id);saveDb()};
 el('bellSaved').addEventListener('click',e=>{
  const del=e.target.closest('[data-bell-delete]');if(del){const t=db.bellfiresTests.find(x=>x.id===del.dataset.bellDelete);if(!t)return;if(!confirm('Deze Bellfires-test met al haar temperatuur- en P1-metingen definitief verwijderen?'))return;db.bellfiresTests=db.bellfiresTests.filter(x=>x.id!==t.id);saveDb();return;}
  const b=e.target.closest('[data-bell-p1]');if(!b)return;const id=b.dataset.bellP1,t=db.bellfiresTests.find(x=>x.id===id);if(!t||t.status==='active')return;
  const first=el('bellSaved').querySelector('[data-bell-begin="'+id+'"]'),second=el('bellSaved').querySelector('[data-bell-end="'+id+'"]');
  const begin=Number(first.value.trim().replace(',','.')),end=Number(second.value.trim().replace(',','.'));
  if(!first.value.trim()||!second.value.trim()||![begin,end].every(Number.isFinite)||begin<0||end<begin)return alert('Vul twee geldige P1-standen in. De eindstand mag niet lager zijn dan de beginstand.');
  if(t.gasM3!=null&&!confirm('Eerder opgeslagen gasmeterstanden vervangen?'))return;
  t.gasBegin=begin;t.gasEnd=end;t.gasMode=el('bellSaved').querySelector('[data-bell-mode="'+id+'"]')?.value||'day';t.gasM3=Math.round((end-begin)*1000)/1000;t.status='finished';t.p1RecordedAt=now();saveDb();alert('P1-verbruik opgeslagen: '+t.gasM3.toLocaleString('nl-BE',{maximumFractionDigits:3})+' m³. De oorspronkelijke brandduur is behouden.');
 });
 const go=el('heating');document.querySelector('[data-tab="heating"]').addEventListener('click',draw);
 draw();
})();

;

/* HeatWise 1.9.35 — gemengde start/stop-tests, uitsluitend op Overzicht. */
(function(){
 const E=id=>document.getElementById(id);
 const now=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':')};
 const display=iso=>escapeHtml(String(iso||'').replace('T',' ').slice(0,16));
 const mins=(a,b)=>Math.max(0,Math.round((new Date(b)-new Date(a))/60000));
 const fmt=n=>n==null?'—':Number(n).toLocaleString('nl-BE',{maximumFractionDigits:2})+' °C';
 const parsed=id=>{const raw=E(id).value.trim().replace(',','.');if(!raw)return null;const n=Number(raw);return Number.isFinite(n)?n:NaN};
 const active=()=>db.mixedTests.find(x=>x.status==='active')||null;
 const segment=(t,device)=>t.segments.find(s=>s.device===device&&!s.end)||null;
 const sum=(t,device)=>t.segments.filter(s=>s.device===device&&s.end).reduce((a,s)=>a+s.minutes,0);
 const costZ=t=>(sum(t,'zibro')/60)*rate()*num('petrolPrice');
 const gasEstimateM3=t=>t.segments.filter(s=>s.device==='bellfires'&&s.end).reduce((a,s)=>a+(s.minutes/60)*(Number(s.burners)===2?1.2:0.8),0);
 const sumGas=t=>t.gasM3!=null?t.gasM3*(t.gasKwh||num('gasKwh'))*(t.gasPrice??gasPrice()):gasEstimateM3(t)*num('gasKwh')*gasPrice();
 const commit=()=>{localStorage.setItem(KEY,JSON.stringify(db));render();zRender();draw()};
 function safeStop(t,device,when){
   const s=segment(t,device);if(!s)return;
   s.end=when;s.minutes=mins(s.start,when);
   if(device==='zibro'&&s.minutes>0){
     const a=new Date(s.start).getTime(),b=new Date(s.end).getTime();
     const conflict=db.zibroRuns.some(r=>{
       const x=new Date(r.date+'T'+r.start+':00').getTime();let y=new Date(r.date+'T'+r.end+':00').getTime();if(y<=x)y+=86400000;return Number.isFinite(x)&&a<y&&b>x;
     });
     if(!conflict){db.zibroRuns.push({id:s.id,date:s.start.slice(0,10),start:s.start.slice(11,16),end:s.end.slice(11,16),minutes:s.minutes,source:'mixedTest',mixedTestId:t.id});s.counted=true;}
     else{s.counted=false;t.warning='Een Zibro-segment overlapt reeds geregistreerde branduren en is niet dubbel in de totalen opgenomen.';}
   }
 }
 function draw(){
   const t=active(); E('hwMixedStart').classList.toggle('hidden',!!t);E('hwMixedActive').classList.toggle('hidden',!t);
   E('hwMixedStatus').textContent=t?'🟢 Gemengde test actief sinds '+display(t.start)+' · '+t.measurements.length+' temperatuurmeting(en)':'Geen gemengde test actief.';
   if(t){
     for(const [device,statusId,buttonId,label] of [['zibro','hwMixZibroStatus','hwMixZibroToggle','Zibro'],['bellfires','hwMixBellStatus','hwMixBellToggle','Bellfires']]){
       const on=segment(t,device);E(statusId).textContent=on?'🟢 Actief sinds '+display(on.start):'Uit · '+Math.floor(sum(t,device)/60)+' u '+sum(t,device)%60+' min geregistreerd';
       E(statusId).classList.toggle('hw-mix-active',!!on);
       E(buttonId).textContent=on?'■ Stop '+label:'▶ Start '+label;
       E('hwMixBurners').disabled=!!segment(t,'bellfires');
     }
   }
   const saved=db.mixedTests.slice().reverse();
   E('hwMixedSaved').innerHTML=saved.map(x=>{
     const running=x.status==='active',z=sum(x,'zibro'),g=sum(x,'bellfires'),measurements=x.measurements||[];
     const rows=measurements.map((m,i)=>'<div class="hw-measurement"><strong>'+display(m.when)+'</strong><div>Living '+fmt(m.living)+' · Buiten '+fmt(m.outside)+(m.kitchen!=null?' · Keuken '+fmt(m.kitchen):'')+'</div><div>Zibro SET '+fmt(m.set)+' · ROOM '+fmt(m.room)+'</div>'+(m.note?'<div class="hw-note">📝 '+escapeHtml(m.note)+'</div>':'')+'<button type="button" class="hw-measure-delete" data-mix-measure="'+i+'" data-mix-parent="'+escapeHtml(x.id)+'" aria-label="Verwijder temperatuurmeting" title="Verwijder meting">🗑</button></div>').join('')||'<p class="tiny">Nog geen temperatuurmetingen.</p>';
     const periods=x.segments.map(s=>'<div class="tiny">'+(s.device==='zibro'?'⛽ Zibro':'🔥 Bellfires ('+s.burners+' brander(s))')+': '+display(s.start)+' → '+(s.end?display(s.end):'loopt')+(s.end?' · '+s.minutes+' min':'')+'</div>').join('');
     const cost=costZ(x)+sumGas(x);
     const p1=running||g===0?'':`<div class="hw-mix-p1"><strong>Bellfires · P1-gasgegevens</strong><p class="tiny">Vul later twee gasstanden van hetzelfde type in. Bij een dagtotaal kan ander gasverbruik inbegrepen zijn.</p><label>Soort meterstanden</label><select data-mix-mode="${escapeHtml(x.id)}"><option value="day" ${x.gasMode==='day'?'selected':''}>Dagtotaal gas (m³)</option><option value="meter" ${x.gasMode==='meter'?'selected':''}>Cumulatieve meterstand (m³)</option></select><div class="hw-mix-fields"><div><label>Begin (m³)</label><input inputmode="decimal" data-mix-begin="${escapeHtml(x.id)}" value="${x.gasBegin??''}"></div><div><label>Eind (m³)</label><input inputmode="decimal" data-mix-end="${escapeHtml(x.id)}" value="${x.gasEnd??''}"></div></div><button type="button" class="btn wide" data-mix-p1="${escapeHtml(x.id)}">${x.gasM3!=null?'Corrigeer P1-gegevens':'Bewaar P1-gegevens'}</button></div>`;
     return '<div class="hw-test-entry"><div class="hw-test-head"><b>'+(running?'🟢 Lopende gemengde test':'✓ Gemengde test')+'</b><span>'+display(x.start)+'</span></div><p class="tiny">Zibro '+Math.floor(z/60)+'u '+z%60+'m · Bellfires '+Math.floor(g/60)+'u '+g%60+'m'+(running?' · loopt': ' · einde '+display(x.end))+'</p>'+
     '<div class="tiny">⛽ Petroleum: <b>'+money(costZ(x))+'</b> (geschat) · 🔥 Gas: <b>'+money(sumGas(x))+'</b> ('+(x.gasM3!=null?'P1 gemeten':'modelschatting')+')</div><p class="tiny"><b>Samen: '+money(cost)+'</b>'+(x.gasM3==null?' · voorlopig, gas geschat':'')+'</p>'+
     (x.warning?'<p class="hw-mix-note">⚠️ '+escapeHtml(x.warning)+'</p>':'')+
     '<details '+(running?'open':'')+'><summary>Temperatuurmetingen ('+measurements.length+') en opmerkingen</summary>'+rows+(x.stopNote?'<div class="hw-note">Eindopmerking: '+escapeHtml(x.stopNote)+'</div>':'')+'</details><details><summary>Bekijk afzonderlijke brandfases</summary>'+periods+'</details>'+p1+
     '<button type="button" class="btn danger hw-delete-button" data-mix-delete="'+escapeHtml(x.id)+'">🗑️ Verwijder deze gemengde test</button></div>';
   }).join('')||'<p class="muted">Nog geen gemengde verwarmingstests bewaard.</p>';
 }
 let lastFill='';
 function fillLatest(t){const m=t.measurements.at(-1);if(!m)return;const key=m.id;if(lastFill===key)return;for(const [id,k] of [['hwMixLiving','living'],['hwMixOutside','outside'],['hwMixKitchen','kitchen'],['hwMixSet','set'],['hwMixRoom','room']])E(id).value=m[k]==null?'':String(m[k]);E('hwMixNote').value='';lastFill=key;}
 E('hwMixedStart').onclick=()=>{
   if(active())return alert('Er loopt al een gemengde test.');
   const start=now();db.mixedTests.push({id:'mix-'+Date.now(),start,status:'active',segments:[],measurements:[],gasM3:null,gasPrice:gasPrice(),gasKwh:num('gasKwh')});
   for(const id of ['hwMixLiving','hwMixOutside','hwMixKitchen','hwMixSet','hwMixRoom','hwMixNote','hwMixStopNote'])E(id).value='';lastFill='';E('hwMixFeedback').textContent='';commit();
 };
 function toggleDevice(device){
   const t=active();if(!t)return;const when=now();
   if(segment(t,device))safeStop(t,device,when);
   else t.segments.push({id:'seg-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),device,start:when,end:null,burners:device==='bellfires'?Number(E('hwMixBurners').value):null});
   commit();
 }
 E('hwMixZibroToggle').onclick=()=>toggleDevice('zibro');E('hwMixBellToggle').onclick=()=>toggleDevice('bellfires');
 E('hwMixSaveTemp').onclick=()=>{
   const t=active();if(!t)return;const v={};for(const [id,k] of [['hwMixLiving','living'],['hwMixOutside','outside'],['hwMixKitchen','kitchen'],['hwMixSet','set'],['hwMixRoom','room']]){v[k]=parsed(id);if(Number.isNaN(v[k]))return alert('Controleer de ingevoerde temperatuur: '+k)}
   if(v.living==null)return alert('Vul een livingtemperatuur in.');const when=now();const m={id:'mixm-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),when,...v,note:E('hwMixNote').value.trim()};t.measurements.push(m);E('hwMixFeedback').textContent='Meting van '+display(when)+' bewaard.';commit();fillLatest(t)
 };
 E('hwMixedFinish').onclick=()=>{
   const t=active();if(!t)return;
   if(!t.segments.length&&!confirm('Er zijn nog geen brandfasen geregistreerd. De test toch afronden?'))return;
   const when=now();safeStop(t,'zibro',when);safeStop(t,'bellfires',when);t.status='finished';t.end=when;t.stopNote=E('hwMixStopNote').value.trim();commit();alert('Gemengde test afgerond. P1-gegevens kunnen later worden ingevuld.');
 };
 function removeTest(id){const t=db.mixedTests.find(x=>x.id===id);if(!t)return;if(!confirm('Deze gemengde test verwijderen? Alleen de gekoppelde brandfases en temperatuurmetingen verdwijnen; andere tests en tankgegevens blijven behouden.'))return;db.mixedTests=db.mixedTests.filter(x=>x.id!==id);db.zibroRuns=db.zibroRuns.filter(r=>!(r.source==='mixedTest'&&r.mixedTestId===id));commit()}
 E('hwMixedDiscard').onclick=()=>{const t=active();if(t)removeTest(t.id)};
 E('hwMixedSaved').addEventListener('click',e=>{
   const m=e.target.closest('[data-mix-measure]');if(m){const t=db.mixedTests.find(x=>x.id===m.dataset.mixParent),i=Number(m.dataset.mixMeasure);if(!t||!t.measurements[i])return;if(!confirm('Alleen deze temperatuurmeting en haar opmerking verwijderen? Branduren blijven behouden.'))return;t.measurements.splice(i,1);lastFill='';commit();return;}
   const del=e.target.closest('[data-mix-delete]');if(del){removeTest(del.dataset.mixDelete);return;}
   const btn=e.target.closest('[data-mix-p1]');if(!btn)return;const id=btn.dataset.mixP1,t=db.mixedTests.find(x=>x.id===id);if(!t||t.status==='active')return;
   const first=E('hwMixedSaved').querySelector('[data-mix-begin="'+id+'"]'),last=E('hwMixedSaved').querySelector('[data-mix-end="'+id+'"]');
   const a=Number(first.value.trim().replace(',','.')),b=Number(last.value.trim().replace(',','.'));
   if(!first.value.trim()||!last.value.trim()||![a,b].every(Number.isFinite)||a<0||b<a)return alert('Controleer de meterstanden.');
   if(t.gasM3!=null&&!confirm('Bestaande P1-gegevens vervangen?'))return;
   t.gasBegin=a;t.gasEnd=b;t.gasMode=E('hwMixedSaved').querySelector('[data-mix-mode="'+id+'"]')?.value||'day';t.gasM3=Math.round((b-a)*1000)/1000;t.p1RecordedAt=now();commit();alert('P1-gasverbruik bewaard bij deze gemengde test.');
 });
 // Gebruiker kan van tab wisselen zonder actieve test te verliezen.
 document.querySelector('[data-tab="overview"]').addEventListener('click',draw);
 draw();
})();


;
