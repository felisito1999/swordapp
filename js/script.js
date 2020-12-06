//Variables que almacenan la información de los colores de las partes de la espada
const bladeColors = [
    { name: "White blade", price: 1500, value: "#FFFFFF" },
    { name: "Red blade", price: 1000, value: "#FF1319" },
    { name: "Black blade", price: 1750, value: "#000000" },
    { name: "Orange blade", price: 1100, value: "#FF781F" },
    { name: "Gold blade", price: 3000, value: "#D4AF37" },
];

const gripColors = [
    { name: "White grip", price: 150, value: "#FFFFFF" },
    { name: "Red grip", price: 100, value: "#FF1319" },
    { name: "Black grip", price: 175, value: "#000000" },
    { name: "Orange grip", price: 110, value: "#FF781F" },
    { name: "Gold grip", price: 200, value: "#D4AF37" },
];

//Declaraciones de variables a las que se les asignaran la espada y partes de la espada 

let sword;
let blade;
let grip;

//Declaracion y asignacion de variables que representan los elementos de los campos de la pagina 

const swordPriceDisplay = document.getElementById("sword-price");

const swordSizeCounter = document.getElementById("zangetsu-size-display");

const bladeColorRadios = document.getElementsByName("blade-color");

//Creacion de los event listeners de los elementos html

bladeColorRadios.forEach(function (element) {
    element.addEventListener("change", function (event) {
        if (event.target.checked) {
            const color = event.target.value;
            changeBladeColor(color);

            return;
        }
    });
});

const gripColorRadios = document.getElementsByName("grip-color");

gripColorRadios.forEach(function (element) {
    element.addEventListener("change", function (event) {
        if (event.target.checked) {
            const color = event.target.value;
            changeGripColor(color);

            return;
        }
    });
});

const swordSizePicker = document.getElementById("sword-sizePicker");
swordSizePicker.addEventListener("input", function (event) {
    const swordScale = event.target.value;
    changeSwordSize(swordScale);
});

//Asignacion y declaraciones de variables de control del modelo 

let swordScale = swordSizePicker.value;
let swordGripColor = gripColorRadios[1].value;
let swordBladeColor = bladeColorRadios[0].value;

//Configuracion de threejs 

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e2e2e);
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const container = document.getElementById("canvas-area");
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);

const width = window.innerWidth * 0.75;
const height = window.innerHeight * 0.4;

renderer.setSize(width, height);
container.appendChild(renderer.domElement);

camera.aspect = width / height;

camera.updateProjectionMatrix();

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
scene.add(directionalLight);

const light = new THREE.AmbientLight(0x222222, 3); // soft white light
scene.add(light);

//Extraccion del modelo 3D

const loader = new THREE.GLTFLoader();
loader.load(
    "/model/fbIchigoSword.gltf",
    function (gltf) {
        sword = gltf.scene.children[0];

        blade = sword.children[0].children[0].children[1];
        grip = sword.children[0].children[0].children[3];

        sword.scale.x = swordScale;
        sword.scale.y = swordScale;
        sword.scale.z = swordScale;

        sword.needUpdate = true;

        scene.add(sword);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

camera.position.y = 10;
camera.position.z = 5;

controls.update();
const animate = function () {
    requestAnimationFrame(animate);
    controls.update();

    renderer.render(scene, camera);
};

animate();

//Declaraciones de funciones

function changeGripColor(color) {
    swordGripColor = color;
    const newGripMaterial = new THREE.MeshLambertMaterial({
        color: swordGripColor,
    });
    newGripMaterial.opacity = 1;
    grip.material = newGripMaterial;

    container.scrollIntoView();

    calculatePrice();
}

function changeSwordSize(size) {
    swordScale = size;
    sword.scale.set(swordScale, swordScale, swordScale);

    swordSizeCounter.innerText = swordScale;

    camera.position.y = 10 + size / 1.5;
    camera.position.z = 5 + size / 1.5; 

    calculatePrice();
}

function changeBladeColor(color) {
    swordBladeColor = color;
    const clonedBladeMaterial = blade.material.clone();
    clonedBladeMaterial.color.set(swordBladeColor);

    blade.material = clonedBladeMaterial;

    container.scrollIntoView();

    calculatePrice();
}

function calculatePrice() {
    let sizePrice = 400 * swordScale;
    const bladePrice = bladeColors
        .filter((bladeColor) => bladeColor.value == swordBladeColor)
        .shift().price;
    const gripPrice = gripColors
        .filter((gripColor) => gripColor.value == swordGripColor)
        .shift().price;

    const result = sizePrice + bladePrice + gripPrice;
    swordPriceDisplay.innerText = result;

    return result;
}

//Funcion para ajustar el tamaño del canvas en caso de que el tamaño de la pantalla cambie

onresize = function () {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.4;

    camera.aspect = width / height;

    renderer.setSize(width, height);

    camera.updateProjectionMatrix();
};

calculatePrice();
