import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer,CSS2DObject } from 'https://unpkg.com/three@0.141.0/examples/jsm/renderers/CSS2DRenderer'
import { getFresnelMat }  from './src/getFresnelMat.js'
const u = document.getElementById('three')
const h = 700;
const w = 700;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, w / h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
const earthGroup = new THREE.Group()
scene.add(earthGroup);
u.appendChild(renderer.domElement);

const label = new CSS2DRenderer()
label.setSize(w, h);

label.domElement.style.position = 'absolute';
label.domElement.style.top = '0px';
label.domElement.style.margin = '0px';
label.domElement.style.left = '0px';
label.domElement.style.pointerEvents = 'none';
u.appendChild(label.domElement);

camera.position.z = 5;
const loader = new THREE.TextureLoader();
const detail = 16;
const map = loader.load('img/jpeg-optimizer_Albedo.jpeg')
// const bump = loader.load('img/bump1.jpg')
const geometry = new THREE.IcosahedronGeometry(1, 16);
const material = new THREE.MeshStandardMaterial({ 
    map:map,
    // bumpMap:bump,
    // bumpScale:0.5,
    // color:0xffff
 });


const earth = new THREE.Mesh(geometry, material);
earthGroup.add(earth);

const light = new THREE.HemisphereLight(0xffffff, 0x444444,1);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040); // Add ambient light
scene.add(ambientLight);


const free = getFresnelMat()
const freeMat = new THREE.Mesh(geometry,free)
scene.add(freeMat);



const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load('img/Clouds.png'),
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
})
const cloud = new THREE.Mesh(geometry, cloudMat)
scene.add(cloud);
cloud.scale.setScalar(1.015)



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.autoRotate = false;
controls.minDistance = 4.7
controls.maxDistance = 6
controls.enablePan = false
controls.minPolarAngle =Math.PI / 2.5
controls.maxPolarAngle =Math.PI -Math.PI / 1






function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = (radius * Math.sin(phi) * Math.cos(theta));
    const z = -(radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    console.log(x);
    console.log(y);
    console.log(z);
    
    

    return new THREE.Vector3(x, y, z);
}


function create(name ,lat,lon){

    
    // Create a dot for Turkey
    const dotGeometry = new THREE.SphereGeometry(0.02, 32, 32); // Dot size
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x00ADB5 });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    // Position the dot and add it to the Earth
    const dotPosition = latLongToVector3(lat, lon, 1);
    console.log(dotPosition)
    dot.position.copy(dotPosition);
    dot.name = name
    console.log(dot.name);
    return scene.add(dot); // 

    
}


//the group 
const group = new THREE.Group()
//istanbul coordinate
const istanbul =create('istanbul',41.008238,28.978359)
group.add(istanbul); //
//jeddah coordinate
const jeddah = create('jeddah',21.492500,39.177570)
group.add(jeddah); //


const p = document.createElement('p');
p.className = 'country'
const pContiner = document.createElement('div');
pContiner.appendChild(p)
const pPoint = new CSS2DObject(pContiner)
scene.add(pPoint)


const raycaster = new THREE.Raycaster()
// jeddah.rotation.z = -23.4 * Math.PI /180

window.addEventListener('mousemove', function (e) {
    const canvasRect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const mouseY = -((e.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
    const intersects = raycaster.intersectObject(group);


    if (intersects.length > 0) {
        switch (intersects[0].object.name){
            case 'istanbul':
                p.innerHTML = 'based in<br>istanbul'
                p.className = 'show'
                pPoint.position.set(-0.6601394987297271,0.7961675345211931,0.5655954168985757)
            
                break;
            case 'jeddah':
                p.innerHTML = 'born<br>KSA jeddah'
                p.className = 'show'
                pPoint.position.set(-0.7212893035296314,0.49637943220984776,0.7877991598048852)
                break;
            default:
                p.className = 'hide'
                p.innerHTML = ''
           
                break;
        }
    }
})



function animate() {
    requestAnimationFrame(animate);
    controls.update()
    label.render(scene, camera)
    earthGroup.rotation.y 
    jeddah.rotation.y +=0.0005
    cloud.rotation.y +=0.00001
    renderer.render(scene, camera);
}

animate();
