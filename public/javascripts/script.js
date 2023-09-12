


const camera = new THREE.PerspectiveCamera(80, 2 / 2, 0.1, 200);
// camera.position.z = 10;
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: canvas
});

const scene = new THREE.Scene();

const ambientLight = new THREE.HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
    0.4, // intensity
);
const mainLight = new THREE.DirectionalLight('white', 1);
mainLight.position.set(10, 10, 10);

scene.add(ambientLight);
scene.add(mainLight);


//-------- ----------
// SCENE CHILD OBJECTS - Mesh Using cone geometry with custom segment counts
//-------- ----------
const geometry = new THREE.ConeGeometry(
    8, // radius
    10, // height
    15, //radial segments,
    1, // height segments
    false, // open ended or capped, false means capped
    0, // start angle
);
//-------- ----------
// MATERIAL/MESH
//-------- ----------
const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//-------- ----------
// RENDER
//-------- ----------
camera.position.set(-18, 11, 20);
camera.lookAt(0, 0, 0);
//renderer.render(scene, camera);





// const geometry = new THREE.ConeGeometry(1, 7);
// const material = new THREE.MeshNormalMaterial();


// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

scene.add(camera)
// animation

renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setAnimationLoop(animation);
// ...

// Рендерер

function animation(time) {

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);

}

//const fileStream = fs.createWriteStream(path);
