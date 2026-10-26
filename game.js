import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const game = document.querySelector('#game');
const errorBox = document.querySelector('#errorBox');
const loading = document.querySelector('#loading');
const toast = document.querySelector('#toast');
const hint = document.querySelector('#hint');
const positionText = document.querySelector('#positionText');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
}
try {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#aaa9f0');
  scene.fog = new THREE.Fog('#c8b9ef', 25, 82);
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 180);
  camera.position.set(0, 7, 10);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.setAttribute('aria-label', 'Mundo 3D do Universo Estelar');
  game.prepend(renderer.domElement);

  scene.add(new THREE.HemisphereLight('#f8f0ff', '#7185a5', 2.35));
  const sun = new THREE.DirectionalLight('#fff0d9', 3.2);
  sun.position.set(-12, 22, 10); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -28; sun.shadow.camera.right = 28; sun.shadow.camera.top = 28; sun.shadow.camera.bottom = -28; sun.shadow.bias = -0.0003; scene.add(sun);
  const fill = new THREE.PointLight('#b7c8ff', 38, 45); fill.position.set(3, 7, -8); scene.add(fill);\n  // Ilhas de colinas suaves e nuvens para dar profundidade ao horizonte.\n  const horizonMats=['#c3b8ef','#a9c9ed','#e9c3e4'].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));\n  for(let i=0;i<18;i++){const a=i*Math.PI*2/18,r=42+(i%3)*2,h=5+(i%4)*1.6;const hill=mesh(new THREE.SphereGeometry(1,24,16),horizonMats[i%3],Math.cos(a)*r,h*.2,Math.sin(a)*r,scene,false,true);hill.scale.set(9+(i%3)*2,h,7+(i%4));}\n  const cloudMat=new THREE.MeshStandardMaterial({color:'#fff8ff',roughness:1,transparent:true,opacity:.78});\n  for(let i=0;i<9;i++){const cloud=new THREE.Group();cloud.position.set(-32+i*8,15+(i%3)*2,-30-(i%4)*8);scene.add(cloud);for(let j=0;j<4;j++){const puff=mesh(new THREE.SphereGeometry(1,16,12),cloudMat,(j-1.5)*1.15,(j%2)*.35,0,cloud,false,false);puff.scale.set(1.5,.58,.72);}}

  const mat = (color, roughness=0.82, extra={}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const mats = {
    grass:mat('#8dbaad'),grass2:mat('#a7cdb9'),path:mat('#e6d4ef'),path2:mat('#f5e5f4'),lilac:mat('#b99ce8'),lilacDark:mat('#8265bd'),
    cream:mat('#fff0d9'),roof:mat('#8b75c9'),pink:mat('#f0a9cf'),mint:mat('#8ed4c4'),blue:mat('#9bcaf0'),gold:mat('#f8d58a'),
    wood:mat('#ad8b9b'),white:mat('#fff5ff'),water:new THREE.MeshPhysicalMaterial({color:'#83d8ed',roughness:.16,metalness:.08,transparent:true,opacity:.91}),
    glass:new THREE.MeshPhysicalMaterial({color:'#bdeaff',roughness:.12,metalness:.05,transparent:true,opacity:.58}),bark:mat('#9d7892'),
    leaf1:mat('#88cdb8'),leaf2:mat('#c1a7e8'),leaf3:mat('#f4b9d7')
  };
  function mesh(geometry,material,x,y,z,parent=scene,cast=true,receive=true){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=receive;parent.add(o);return o}
  function box(w,h,d,material,x,y,z,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent)}
  function sphere(r,material,x,y,z,parent=scene,scale=null,segments=20){const o=mesh(new THREE.SphereGeometry(r,segments,Math.max(12,Math.floor(segments*.65))),material,x,y,z,parent);if(scale)o.scale.set(...scale);return o}
  function cylinder(rt,rb,h,material,x,y,z,parent=scene,segments=24){return mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material,x,y,z,parent)}
  function makePath(points,width,material){for(let i=0;i<points.length-1;i++){const a=new THREE.Vector3(points[i][0],.025,points[i][1]),b=new THREE.Vector3(points[i+1][0],.025,points[i+1][1]);const delta=b.clone().sub(a);const o=mesh(new THREE.BoxGeometry(width,.055,delta.length()),material,(a.x+b.x)/2,.025,(a.z+b.z)/2);o.rotation.y=Math.atan2(delta.x,delta.z)}}

  mesh(new THREE.CylinderGeometry(35,36,1.5,96),mats.grass,0,-.8,0,scene,false,true);
  mesh(new THREE.CylinderGeometry(30,31,.12,96),mats.grass2,0,-.015,0,scene,false,true);
  mesh(new THREE.CylinderGeometry(8.2,8.2,.12,64),mats.path,0,.04,0);
  makePath([[0,0],[0,28]],3.5,mats.path);makePath([[0,0],[25,0]],3.5,mats.path);makePath([[0,0],[-25,0]],3.5,mats.path);makePath([[0,0],[0,-26]],3.5,mats.path);
  makePath([[0,0],[14,14]],2.5,mats.path2);makePath([[0,0],[-14,14]],2.5,mats.path2);makePath([[0,0],[14,-14]],2.5,mats.path2);makePath([[0,0],[-14,-14]],2.5,mats.path2);
  for(let i=0;i<180;i++){const a=Math.random()*Math.PI*2,r=9+Math.random()*23,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<2.5||Math.abs(z)<2.5)continue;sphere(.075,[mats.pink,mats.cream,mats.lilac,mats.blue][i%4],x,.08,z,scene,[1,.65,1],8)}

  const fountain=new THREE.Group();scene.add(fountain);
  cylinder(3.05,0,.25,mats.lilacDark,0,.15,0,fountain,48);cylinder(2.82,2.9,.22,mats.cream,0,.31,0,fountain,48);
  cylinder(2.56,2.56,.11,mats.water,0,.44,0,fountain,48);cylinder(1.9,1.9,.12,mats.lilac,0,.49,0,fountain,48);
  cylinder(.34,.42,1.15,mats.cream,0,1.03,0,fountain,24);sphere(.54,mats.gold,0,1.73,0,fountain,[.8,1.15,.8],24);
  const starShape=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2===0?.65:.28,x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)starShape.moveTo(x,y);else starShape.lineTo(x,y)}starShape.closePath();
  const starGeo=new THREE.ExtrudeGeometry(starShape,{depth:.13,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035});
  const crystal=mesh(starGeo,mats.gold,0,2.3,0,fountain);crystal.rotation.x=-.15;crystal.rotation.y=.2;
  const glow=new THREE.PointLight('#ffe0a0',18,9);glow.position.set(0,2.5,0);fountain.add(glow);

  function tree(x,z,color,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);cylinder(.22,.34,1.65,mats.bark,0,.8,0,g,12);sphere(.85,color,0,1.85,0,g,[1,1.05,1],18);sphere(.58,color,-.48,1.55,.05,g,[1,1,1],16);sphere(.62,color,.45,1.58,-.04,g,[1,1,1],16);sphere(.43,mats.cream,.1,2.28,-.38,g,[.2,.2,.2],12)}
  const treeSpots=[[-8,-8],[-11,-5],[-8,8],[-12,10],[8,-8],[11,-5],[8,8],[12,10],[-17,3],[-18,-4],[17,4],[18,-4],[-5,17],[5,18],[-5,-18],[5,-18],[-22,12],[22,12],[-23,-12],[23,-12]];
  treeSpots.forEach((p,i)=>tree(p[0],p[1],[mats.leaf1,mats.leaf2,mats.leaf3][i%3],.78+(i%3)*.12));
  function lamp(x,z){cylinder(.065,.08,1.7,mats.lilacDark,x,.85,z,scene,12);sphere(.2,mats.gold,x,1.78,z,scene,[1,1,1],14);const l=new THREE.PointLight('#ffe2af',3.5,5);l.position.set(x,1.8,z);scene.add(l)}
  [[-3,7],[3,7],[-3,-7],[3,-7],[-7,3],[7,3],[-7,-3],[7,-3],[-14,0],[14,0],[0,14],[0,-14]].forEach(p=>lamp(...p));

  function house(x,z,wallColor,roofColor,rotation=0,shop=false){
    const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;scene.add(g);
    box(4.2,2.8,3.2,wallColor,0,1.45,0,g);const roof=mesh(new THREE.ConeGeometry(3.1,1.65,4),roofColor,0,3.55,0,g);roof.rotation.y=Math.PI/4;roof.scale.z=.8;
    box(.85,1.65,.12,mats.wood,0,.9,-1.66,g);sphere(.06,mats.gold,.25,.9,-1.74,g,null,10);
    box(1.05,.88,.14,mats.glass,-1.28,1.75,-1.67,g);box(1.05,.88,.14,mats.glass,1.28,1.75,-1.67,g);
    box(1.12,.08,.19,mats.cream,-1.28,1.75,-1.77,g);box(.08,.92,.19,mats.cream,-1.28,1.75,-1.77,g);
    box(1.12,.08,.19,mats.cream,1.28,1.75,-1.77,g);box(.08,.92,.19,mats.cream,1.28,1.75,-1.77,g);
    box(1.25,.16,.4,roofColor,0,2.48,-1.83,g);for(let i=0;i<3;i++)sphere(.08,[mats.pink,mats.gold,mats.blue][i],-.22+i*.22,2.55,-2.05,g,null,10);
    if(shop)for(let i=0;i<5;i++)box(.42,.16,.48,i%2?mats.pink:mats.cream,-1+i*.5,2.37,-1.95,g);
  }
  house(-12,0,mats.pink,mats.lilacDark,.12,false);house(12,0,mats.blue,mats.roof,-.12,true);house(-9,-13,mats.cream,mats.pink,.4,false);house(10,-14,mats.mint,mats.lilacDark,-.3,false);
  function bench(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);box(1.5,.14,.42,mats.wood,0,.6,0,g);box(1.5,.14,.14,mats.wood,0,.9,.15,g);for(const x2 of [-.55,.55]){box(.12,.55,.14,mats.lilacDark,x2,.34,0,g);box(.12,.6,.14,mats.lilacDark,x2,.65,.15,g)}}
  bench(-4,5,.6);bench(4,5,-.6);bench(-4,-5,-.6);bench(4,-5,.6);
  const motes=new THREE.Group();scene.add(motes);for(let i=0;i<42;i++){const a=Math.random()*Math.PI*2,r=4+Math.random()*21,y=.7+Math.random()*3;const m=sphere(.035,[mats.gold,mats.white,mats.lilac][i%3],Math.cos(a)*r,y,Math.sin(a)*r,motes,null,8);m.userData.phase=Math.random()*Math.PI*2;m.userData.baseY=y}

  const player=new THREE.Group();player.position.set(0,0,6);scene.add(player);const avatar=new THREE.Group();player.add(avatar);
  const skin=mat('#f3c5ad'),hair=mat('#342047'),outfit=mat('#a98ae8'),accent=mat('#8ee4ee'),dark=mat('#342642'),shoe=mat('#fff1ff');
  function avatarSphere(r,m,x,y,z,sx=1,sy=1,sz=1){return sphere(r,m,x,y,z,avatar,[sx,sy,sz],24)}
  function avatarCapsule(r,h,m,x,y,z){return mesh(new THREE.CapsuleGeometry(r,h,5,12),m,x,y,z,avatar)}
  avatarCapsule(.105,.42,skin,-.15,.37,0);avatarCapsule(.105,.42,skin,.15,.37,0);avatarSphere(.14,shoe,-.15,.12,-.07,1,.52,1.35);avatarSphere(.14,shoe,.15,.12,-.07,1,.52,1.35);
  avatarCapsule(.25,.28,outfit,0,.91,0);avatarCapsule(.075,.34,skin,-.31,.86,0);avatarCapsule(.075,.34,skin,.31,.86,0);
  avatarSphere(.39,skin,0,1.54,0,.91,1,.82);avatarSphere(.41,hair,0,1.79,.035,1,.48,.88);avatarSphere(.27,hair,0,1.68,-.25,1,.52,.34);
  avatarSphere(.11,hair,-.28,1.56,-.14,.8,1.5,.65);avatarSphere(.11,hair,.28,1.56,-.14,.8,1.5,.65);
  avatarSphere(.045,dark,-.13,1.54,-.315,.8,1.3,.45);avatarSphere(.045,dark,.13,1.54,-.315,.8,1.3,.45);
  avatarSphere(.018,shoe,-.145,1.56,-.337,1,1,.5);avatarSphere(.018,shoe,.115,1.56,-.337,1,1,.5);
  const cheek=mat('#f39ab9');avatarSphere(.06,cheek,-.22,1.43,-.28,1,.55,.25);avatarSphere(.06,cheek,.22,1.43,-.28,1,.55,.25);avatarSphere(.07,accent,.25,1.89,-.15,.85,.85,.5);
  const shadow=mesh(new THREE.CircleGeometry(.52,24),new THREE.MeshBasicMaterial({color:'#3d2d67',transparent:true,opacity:.19}),0,.025,0,player,false,false);shadow.rotation.x=-Math.PI/2;

  const joyZone=document.querySelector('#joystickZone'),knob=document.querySelector('#joyKnob');const move={x:0,y:0};let joyPointer=null;
  function updateJoy(e){const rect=joyZone.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,max=34,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),factor=len>max?max/len:1,x=dx*factor,y=dy*factor;knob.style.transform=`translate(${x}px,${y}px)`;move.x=x/max;move.y=y/max}
  joyZone.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joyZone.setPointerCapture(e.pointerId);updateJoy(e);hint.style.opacity='0'});
  joyZone.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)updateJoy(e)});
  function releaseJoy(e){if(e.pointerId!==joyPointer)return;joyPointer=null;move.x=0;move.y=0;knob.style.transform='translate(0,0)'}
  joyZone.addEventListener('pointerup',releaseJoy);joyZone.addEventListener('pointercancel',releaseJoy);
  const keys={};window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()))e.preventDefault()},{passive:false});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
  let yaw=0,camDistance=8.5,cameraMode=0,dragging=false,lastX=0,lastY=0;
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;yaw-=dx*.006;camDistance=THREE.MathUtils.clamp(camDistance+dy*.025,5.5,12);lastX=e.clientX;lastY=e.clientY});
  renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
  document.querySelector('#cameraBtn').addEventListener('click',()=>{cameraMode=(cameraMode+1)%2;showToast(cameraMode?'Câmera mais distante':'Câmera próxima')});
  document.querySelector('#lookBtn').addEventListener('click',()=>{yaw=0;camDistance=8.5;showToast('Câmera centralizada ✦')});
  document.querySelector('#soundBtn').addEventListener('click',()=>showToast('Sons e música chegam em uma próxima etapa ✨'));
  document.querySelector('#interactBtn').addEventListener('click',()=>{
    const targets=[{x:0,z:0,d:3.8,name:'Fonte Estelar'},{x:-12,z:0,d:4.5,name:'Casinha Lilás'},{x:12,z:0,d:4.5,name:'Loja das Estrelas'},{x:-9,z:-13,d:4.5,name:'Casinha dos Sonhos'},{x:10,z:-14,d:4.5,name:'Casa Menta'}];
    let near=null,best=1e9;for(const t of targets){const d=Math.hypot(player.position.x-t.x,player.position.z-t.z);if(d<t.d&&d<best){near=t;best=d}}
    showToast(near?near.name+' ✨ — novas interações em breve':'Chegue mais perto de uma casa ou da fonte para interagir!')
  });
  const clock=new THREE.Clock();const forward=new THREE.Vector3(),right=new THREE.Vector3(),desired=new THREE.Vector3();let elapsed=0;
  function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035);elapsed+=dt;
    let ix=move.x,iy=move.y;if(keys.a||keys.arrowleft)ix-=1;if(keys.d||keys.arrowright)ix+=1;if(keys.w||keys.arrowup)iy-=1;if(keys.s||keys.arrowdown)iy+=1;
    const mag=Math.hypot(ix,iy);if(mag>1){ix/=mag;iy/=mag}forward.set(Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,Math.sin(yaw));desired.set(0,0,0).addScaledVector(right,ix).addScaledVector(forward,-iy);
    const moving=desired.lengthSq()>.015;if(moving){desired.normalize();player.position.addScaledVector(desired,dt*4.1);player.position.x=THREE.MathUtils.clamp(player.position.x,-29,29);player.position.z=THREE.MathUtils.clamp(player.position.z,-29,29);avatar.rotation.y=Math.atan2(-desired.x,-desired.z);avatar.position.y=Math.abs(Math.sin(elapsed*12))*.025;avatar.rotation.z=Math.sin(elapsed*12)*.035}else{avatar.position.y=0;avatar.rotation.z=THREE.MathUtils.damp(avatar.rotation.z,0,8,dt)}
    crystal.rotation.y+=dt*.45;crystal.position.y=2.3+Math.sin(elapsed*1.5)*.09;glow.intensity=17+Math.sin(elapsed*2.3)*4;motes.children.forEach(m=>m.position.y=m.userData.baseY+Math.sin(elapsed*1.2+m.userData.phase)*.16);
    const followDist=cameraMode?camDistance+2.5:camDistance;camera.position.lerp(new THREE.Vector3(player.position.x+Math.sin(yaw)*followDist*.4,player.position.y+5.4,player.position.z+followDist),1-Math.exp(-dt*3.4));camera.lookAt(player.position.x,player.position.y+1.05,player.position.z);
    positionText.textContent=moving?'EXPLORANDO A PRAÇA':'PRONTA PARA EXPLORAR';renderer.render(scene,camera)}
  function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth/innerHeight<1?58:46;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));renderer.setSize(innerWidth,innerHeight)}
  window.addEventListener('resize',resize);loading.classList.add('hidden');setTimeout(()=>loading.remove(),600);animate();
}catch(error){console.error(error);loading.classList.add('hidden');errorBox.hidden=false;errorBox.textContent='Não foi possível iniciar o mundo 3D. Confira sua conexão e tente atualizar a página.\nDetalhe: '+(error?.message||error)}
