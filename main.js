// Loader
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hide');
    createParticles();
  },3800);
});

// Progress bar
window.addEventListener('scroll',()=>{
  const d=document.documentElement,h=d.scrollHeight-d.clientHeight,pct=(d.scrollTop/h)*100;
  document.getElementById('progress').style.width=pct+'%';
  // Nav
  document.getElementById('nav').classList.toggle('scrolled',d.scrollTop>50);
});

// Particles
function createParticles(){
  const c=document.getElementById('particles');
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='particle';
    const size=Math.random()*4+1;
    p.style.cssText=`width:${size}px;height:${size}px;left:${Math.random()*100}%;background:rgba(201,146,42,${Math.random()*.5+.2});animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s`;
    c.appendChild(p);
  }
}

// Intersection Observer for fade-in + counter animations
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // animate trek bars
      if(e.target.contains(document.getElementById('girnarBar'))){
        setTimeout(()=>{
          document.getElementById('girnarBar').style.width='100%';
          animateCount('girnarCount',0,9999,2000);
        },300);
      }
      if(e.target.contains(document.getElementById('palitanaBar'))){
        setTimeout(()=>{
          document.getElementById('palitanaBar').style.width='100%';
          animateCount('palitanaCount',0,3800,2000);
        },300);
      }
      // budget counters
      if(e.target.contains(document.getElementById('grandTotalCount'))){
        setTimeout(()=>{
          animateCountRupee('grandTotalCount',0,31458,2000);
          animateCountRupee('perPersonCount',0,10486,2000);
          animateBars();
          renderChart();
        },300);
      }
    }
  });
},{threshold:.1});
document.querySelectorAll('.fade-in-section').forEach(s=>io.observe(s));

function animateCount(id,from,to,dur){
  const el=document.getElementById(id);if(!el)return;
  const start=performance.now();
  function step(now){
    const p=Math.min((now-start)/dur,1);
    const v=Math.floor(from+(to-from)*easeOut(p));
    el.textContent=v.toLocaleString('en-IN');
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animateCountRupee(id,from,to,dur){
  const el=document.getElementById(id);if(!el)return;
  const start=performance.now();
  function step(now){
    const p=Math.min((now-start)/dur,1);
    const v=Math.floor(from+(to-from)*easeOut(p));
    el.textContent='₹'+v.toLocaleString('en-IN');
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t){return 1-Math.pow(1-t,3)}

function animateBars(){
  document.querySelectorAll('.budget-bar-fill').forEach(b=>{
    const w=b.dataset.width;
    b.style.width=w+'%';
  });
}

function renderChart(){
  const ctx=document.getElementById('budgetChart');
  if(!ctx)return;
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Trains','Road','Stay','Activities','Food & Misc'],
      datasets:[{
        data:[3765,7400,3300,5880,10110],
        backgroundColor:['#4A90E2','#C9922A','#7B68EE','#E8663A','#4CAF50'],
        borderColor:'#0A0A0A',borderWidth:2,hoverOffset:8
      }]
    },
    options:{
      responsive:true,plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:ctx=>'₹'+ctx.parsed.toLocaleString('en-IN')}}
      },cutout:'65%'
    }
  });
}
