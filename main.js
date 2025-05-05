const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const equationInput = document.getElementById('equationInput');
const zoomSlider = document.getElementById('zoomSlider');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let zoomIndexer = parseFloat(zoomSlider.value);
let planeSize = 100;

function getUnitSize() {
    return (500) / (planeSize * zoomIndexer);
}

let equationString = equationInput.value;

function parseEquation(str) {
    return (x) => {
        try {
            return eval(str.replace(/x/g, `(${x})`));
        } catch {
            return 0;
        }
    };
}

function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    zoomIndexer = parseFloat(zoomSlider.value);
    const unitSize = getUnitSize();
    const centerNodes = { x: canvas.width * 0.5, y: canvas.height * 0.5 };

    const myPlane = new Cplane(centerNodes, planeSize, unitSize, zoomIndexer);
    myPlane.draw(ctx);

    const ruleFunction = parseEquation(equationString);
    const myEquation = new Equation(unitSize, centerNodes, planeSize, ruleFunction);
    myEquation.plot();
    myEquation.draw(ctx);

    requestAnimationFrame(animate);
}

equationInput.addEventListener("change", () => {
    equationString = equationInput.value;
});

zoomSlider.addEventListener("input", () => {
    zoomIndexer = parseFloat(zoomSlider.value);
});

animate();
   