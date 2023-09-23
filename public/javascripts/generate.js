

const genForm = document.getElementById('generate-form');
const smoothInp = document.getElementById('smooth-input');
const segmentsInp = document.getElementById('segments-input');
const langBtn = document.getElementById('lang');

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let radius = 5;
let height = 5;
let segments = 5;
let segments_height = 1;

function main(radius, height, segments, segments_height) {

    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    let fov = 45;
    let aspect = 2; // the canvas default
    let near = 0.1;
    let far = 100;

    let open = false; // ended or capped, false means capped
    let angle = 0;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    class MinMaxGUIHelper {

        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {

            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);

        }
        get max() {

            return this.obj[this.maxProp];

        }
        set max(v) {

            this.obj[this.maxProp] = v;
            this.min = this.min; // this will call the min setter

        }

    }

    function updateCamera() {

        camera.updateProjectionMatrix();

    }

    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightblue');

    {

        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        //texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 1;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * - .5;
        scene.add(mesh);
    }

    {

        const geometry = new THREE.ConeGeometry(radius, height, segments, segments_height, open, angle);

        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, height / 2, 0);

        scene.add(mesh);
    }

    {

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(- 5, 0, 0);
        scene.add(light);
        scene.add(light.target);

    }

    function resizeRendererToDisplaySize(renderer) {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {

            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main(radius, height, segments, segments_height);

smoothInp.addEventListener('click', event => {

    if (smoothInp.checked) {
        segmentsInp.value = '';
        segmentsInp.required = false;
        segmentsInp.disabled = true;

    }
    else {
        segmentsInp.required = true;
        segmentsInp.disabled = false;
    }

})

genForm.addEventListener('submit', event => {


    event.preventDefault();
    let smooth = false;

    if (smoothInp.checked) { smooth = true; }
    else smooth = false;
    fetch('/cone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            smooth: smooth,
            segments: segmentsInp.value,
            radius: document.getElementById('radius_input').value,
            height: document.getElementById('height_input').value,
        })
    })
        .then(res => res.json())
        .then(data => {
            try {
                let radius = data.radius;
                let height = data.height;
                let segments = data.segments;
                let segments_height = data.segments_height;

                main(radius, height, segments, segments_height);
            }
            catch (er) {
                alert(er)
            }
        })
        .catch(error => {
            console.error(error);
            alert(error);

        });
})

langBtn.addEventListener('click', event => {
    //alert(langBtn.value)
    // if (smoothInp.checked) {
    //     segmentsInp.value = '';
    //     segmentsInp.required = false;
    //     segmentsInp.disabled = true;

    // }
    // else {
    //     segmentsInp.required = true;
    //     segmentsInp.disabled = false;
    // }

})