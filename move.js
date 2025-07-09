
// --- Matter.js Setup ---
const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Events,
    Mouse,
    MouseConstraint
} = Matter;

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

const engine = Engine.create();
const world = engine.world;

// --- Fridge Magnet-like Physics Settings ---
engine.gravity.scale = 0.0005; // Reduce gravity influence
const frictionAir = 0.1;      // Increase air resistance to slow motion
const restitution = 0.2;    // Reduce bounciness

let isGridMode = false; // Flag to track grid mode, initially false (chaos mode)

// --- Elements for the static background layer ---
const staticBgLayer = document.getElementById('static-background-layer');
const staticBgImage = document.getElementById('static-background-image');
const staticBgText = document.getElementById('static-background-text');

// --- Configuration for your static background content ---
const staticBgContent = {
    imageSrc: 'png/Untigggtled-1 3.png', // <--- IMPORTANT: SET YOUR IMAGE PATH HERE
    text: ''
};

let bodies = []; // Array to hold Matter.js bodies for your images

// --- Image Assets ---
const images = [
    'png/1.png', 'png/2.png', 'png/3.png', 'png/4.png', 'png/44.png', 'png/55.png',
    'png/afa.png', 'png/g.png', 'png/h.png', 'png/Layer 1.png', 'png/Layer 2.png', 'png/Layer 3.png', 'png/Layer 4.png', 'png/Layer 5.png',
    'png/Layer 6.png', 'png/Layer 7.png', 'png/Layer 9.png', 'png/Layer 10.png',
    'png/Layer 11.png', 'png/Layer 12.png', 'png/Layer 13.png', 'png/Layer 14.png', 'png/Layer 15.png',
    'png/Layer 16.png', 'png/Layer 17.png', 'png/usm.png', 'png/veld.png',
    'png/u1.png', 'png/u2.png', 'png/u3.png', 'png/u4.png', 'png/u5.png', 'png/u7.png', 'png/u8.png', 'png/u9.png',
    'png/i1.png', 'png/i2.png', 'png/i4.png', 'png/i5.png', 'png/i6.png', 'png/y1.png',
    'png/y2.png', 'png/y3.png', 'png/y4.png', 'png/y6.png', 'png/y5.png', 'png/y7.png', 'png/y8.png', 'png/j.png', 'png/h1.png', 'png/h2.png',
    'png/h3.png', 'png/h4.png', 'png/h5.png', 'png/h6.png', 'png/h7.png', 'png/h8.png', 'png/Layer 18.png', 'png/Layer 19.png',
    'png/Layer 20.png', 'png/Layer 21.png', 'png/Layer 22.png', 'png/Layer 23.png', 'png/Layer 24.png', 'png/Layer 25.png',
    'png/q1.png', 'png/q2.png', 'png/q3.png', 'png/q4.png', 'png/q5.png', 'png/q6.png', 'png/q7.png', 'png/q8.png', 'png/q9.png', 'png/q10.png', 'png/q11.png', 'png/q12.png',
    'png/q13.png', 'png/q14.png', 'png/q15.png', 'png/q16.png', 'png/q17.png', 'png/q18.png', 'png/q19.png', 'png/q20.png', 'png/q21.png', 'png/q22.png', 'png/q23.png', 'png/q24.png', 'png/q25.png', 'png/q26.png',
    'png/q27.png', 'png/q28.png', 'png/q29.png', 'png/q30.png', 'png/q31.png', 'png/q32.png'
];
const loadedImages = []; // Stores loaded Image objects

const imageCategories = {
    'png/1.png': 'advertising', 'png/2.png': 'sports/city pride', 'png/3.png': 'sports/city pride', 'png/4.png': 'personal/artistic', 'png/44.png': 'personal/artistic', 'png/55.png': 'personal/artistic', 'png/afa.png': 'political', 'png/g.png': 'advertising', 'png/h.png': 'personal/artistic',
    'png/h1.png': 'personal/artistic', 'png/h2.png': 'advertising', 'png/h3.png': 'political', 'png/h4.png': 'political', 'png/h5.png': 'advertising', 'png/h6.png': 'political', 'png/h7.png': 'sports/city pride', 'png/h8.png': 'political', 'png/hsdf.png': 'political',
    'png/i1.png': 'personal/artistic', 'png/i2.png': 'nett hier!', 'png/i4.png': 'advertising', 'png/i5.png': 'nett hier!', 'png/i6.png': 'nett hier!',
    'png/j.png': 'sports/city pride', 'png/Layer 1.png': 'political', 'png/Layer 2.png': 'personal/artistic', 'png/Layer 3.png': 'advertising', 'png/Layer 4.png': 'personal/artistic', 'png/Layer 5.png': 'personal/artistic', 'png/Layer 6.png': 'advertising', 'png/Layer 7.png': 'personal/artistic', 'png/Layer 9.png': 'personal/artistic', 'png/Layer 10.png': 'advertising', 'png/Layer 11.png': 'personal/artistic', 'png/Layer 12.png': 'personal/artistic', 'png/Layer 13.png': 'personal/artistic', 'png/Layer 14.png': 'advertising', 'png/Layer 15.png': 'advertising', 'png/Layer 16.png': 'personal/artistic', 'png/Layer 17.png': 'personal/artistic',
    'png/u1.png': 'political', 'png/u2.png': 'sports/city pride', 'png/u3.png': 'sports/city pride', 'png/u4.png': 'advertising', 'png/u5.png': 'sports/city pride', 'png/u7.png': 'advertising', 'png/u9.png': 'advertising', 'png/u8.png': 'personal/artistic', 'png/usm.png': 'sports/city pride', 'png/veld.png': 'personal/artistic',
    'png/y1.png': 'nett hier!', 'png/y2.png': 'advertising', 'png/y3.png': 'nett hier!', 'png/y4.png': 'advertising', 'png/y5.png': 'sports/city pride', 'png/y6.png': 'advertising', 'png/y7.png': 'advertising', 'png/y8.png': 'personal/artistic',
    'png/Layer 18.png': 'political', 'png/Layer 19.png': 'political', 'png/Layer 20.png': 'political', 'png/Layer 21.png': 'advertising', 'png/Layer 22.png': 'sports/city pride', 'png/Layer 23.png': 'political', 'png/Layer 24.png': 'personal/artistic', 'png/Layer 25.png': 'advertising',
    'png/q1.png': 'personal/artistic', 'png/q2.png': 'political', 'png/q3.png': 'advertising', 'png/q4.png': 'personal/artistic', 'png/q5.png': 'personal/artistic', 'png/q6.png': 'personal/artistic', 'png/q7.png': 'sports/city pride', 'png/q8.png': 'political', 'png/q9.png': 'personal/artistic', 'png/q10.png': 'political', 'png/q11.png': 'sports/city pride', 'png/q12.png': 'personal/artistic',
    'png/q13.png': 'sports/city pride', 'png/q14.png': 'personal/artistic', 'png/q15.png': 'advertising', 'png/q16.png': 'sports/city pride', 'png/q17.png': 'personal/artistic', 'png/q18.png': 'sports/city pride', 'png/q19.png': 'political', 'png/q20.png': 'sports/city pride', 'png/q21.png': 'political', 'png/q22.png': 'political', 'png/q23.png': 'political', 'png/q24.png': 'sports/city pride', 'png/q25.png': 'sports/city pride', 'png/q26.png': 'sports/city pride',
    'png/q27.png': 'personal/artistic', 'png/q28.png': 'personal/artistic', 'png/q29.png': 'personal/artistic', 'png/q30.png': 'sports/city pride', 'png/q31.png': 'personal/artistic', 'png/q32.png': 'personal/artistic',
};

// Define your imageTextData array with number and description
// MAKE SURE THE ORDER OF THESE TEXTS MATCHES THE ORDER OF YOUR 'images' ARRAY
const imageTextData = [
    { number: "01", description: ">a black heart advertising raulstefan tattooer. >translation - n/a. >49°5958.8N 8°1625.0E" },
    { number: "02", description: "two covered faces of ultras mainz fans/hooligans. translation - n/a. 49°98872.7N 8°22458.2E" },
    { number: "03", description: "a simple red, white and black sticker: LVNG MNZ. translation - Loving Mainz. 49°5922.1N 8°1331.2E" },
    { number: "04", description: "a yellow sticker stating: DU BIST SO SCHON SELBST & STANDIG!   translation - YOU ARE SO BEAUTIFUL YOURSELF & ALWAYS! 49°59'51.5N 8°16'46.9E" },
    { number: "05", description: "the letters WZ in light blue color. translation - n/a. 49°99743.6N, 8°27827.2E" },
    { number: "06", description: "A name written in a street style - PANIK. translation - n/a. 49°5950.6N 8°1641.7E"},
    { number: "07", description: "A sticker stating “dorf antifa DRF AFA schwaim foer kreis.” translation - n/a. 49°5922.7N 8°1333.7E"},
    { number: "08", description: "A green leaf with peaceful face, advertising old but golds tattoo shop. translation - n/a 50°0013.7N 8°1610.7E"},
    { number: "09", description: "A cartoon dog gnawing on its own leg. translation - n/a. 49°5942.0N 8°1331.5E" },
    { number: "10", description: ">“VIVE LE SERVICE PUBLIC quand tout sera prive, on sera prive de tout” >translation - “LONG LIVE PUBLIC SERVICE when everything is private, we will be deprived of everything” >49°5954.2N 8°1641.5E"},
    { number: "11", description: ">a black circular sticker: “SPJAM.” >translation - n/a. >49°5950.9N 8°1646.3E."},
    { number: "12", description: ">a black and white sticker advertising the KD student council. >translation - “student council.” >49°5947.3N 8°1644.4E"},
    { number: "13", description: ">a square, red sticker featuring a frog smoking a cigarette. >translation - n/a. >49°5950.9N 8°1646.3E"},
    { number: "14", description: ">an artistic piece in black and yellow. >translation - n/a. >49°5950.9N 8°1646.3E"},
    { number: "15", description: "Final artistic piece in the collection."},
    { number: "16", description: ">two anthropomorphic bunnies, one red and one blue, engaged in an intimate pose. >translation - n/a >49°99683.5N 8°27919.6E"},
    { number: "17", description: ">a purple sticker stating: “very happy 2024. fontspectrum.com.”  >translation - n/a >49°5950.9N 8°1646.3E"},
    { number: "18", description: ">a square sticker in shades of pink and purple, advertising the UN/SEEN symposium. >translation - n/a. >49°5947.3N 8°1644.4E"},
    { number: "19", description: ">a drawing of a creature peeking out of a trash can. >translation -n/a. >49°5950.9N 8°1646.3E"},
    { number: "20", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "21", description: ">4 girls in matching outfits, “the space girls the lunar edition mission completed.” >translation -n/a >49°5950.9N 8°1646.3E"},
    { number: "22", description: ">a grey circular sticker advertising the 2023 KD werkschau. >translation - “workshow, 14-15 july 23, HS mainz, @hsm.kd.werkschau 14:00 - 20:00.” >49°5947.3N 8°1644.4E"},
    { number: "23", description: ">an eye. >translation - n/a. >49°5947.3N 8°1644.4E"},
    { number: "24", description: ">a red sticker stating: “WER WARST DU, WENN DU DIE WAHL HATTEST?” >translation - “WHO WERE YOU IF YOU HAD THE CHOICE?” >49°5950.9N 8°1646.3E"},
    { number: "26", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "27", description: ">“mainz 05 - fans gegen rechts!” >translation - “Mainz 05 - fans against the right!” >49°5906.1N 8°1333.7E"},
    { number: "28", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "29", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "30", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "31", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "32", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "33", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "34", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "35", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "36", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "37", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "38", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "39", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "40", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "41", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "42", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "43", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "44", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "45", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "46", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "47", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "48", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "49", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "50", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "51", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "52", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "53", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "54", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "55", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "56", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "57", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "58", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "59", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "60", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "61", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "62", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "63", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "64", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "65", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "66", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "67", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "68", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "69", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "70", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "71", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "72", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "73", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "74", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "75", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "76", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "77", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "78", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "79", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "80", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "81", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "82", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "83", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "84", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "85", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "86", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "87", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "88", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "89", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "90", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "91", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "92", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "93", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "94", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "95", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "96", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "97", description: ">a black and white drawing of a girl. >translation - n/a. >"},
    { number: "98", description: ">a black and white drawing of a girl. >translation - n/a. >"},
];

// --- Utility Function: Text Wrapping ---
function wrapText(context, text, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim()); // Trim to remove trailing space
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim()); // Add the last line, trimmed

    return lines;
}

// --- Main Setup Function ---
function setup() {
    const canvasWidth = window.innerWidth;
    const canvasHeight = 7300; // Increased height for more space

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    Composite.clear(world, false); // Clear existing bodies from the world
    bodies = []; // Reset bodies array

loadedImages.forEach((img, i) => {
    const scale = 0.39;
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;

    const x = 100 + Math.random() * (canvasWidth - 200);
    const y = 100 + Math.random() * (canvasHeight - 400);

    const src = images[i];
    const category = imageCategories[src] || 'uncategorized';
    const textObjectForImage = imageTextData[i] || { number: '?', description: 'No description' };

    const body = Bodies.rectangle(x, y, width, height, {
        label: `img${i}`,
        restitution: restitution,
        frictionAir: frictionAir
    });

    body.renderImg = {
        width,
        height,
        category,
        number: textObjectForImage.number,
        description: textObjectForImage.description,
        image: img
        
    };

    bodies.push(body);
});

    Composite.add(world, bodies); // Add all created bodies to the physics world

    // Add static boundaries
    Composite.add(world, [
        Bodies.rectangle(canvasWidth / 2, canvasHeight + 25, canvasWidth, 50, { isStatic: true, label: 'ground' }),
        Bodies.rectangle(-25, canvasHeight / 2, 50, canvasHeight, { isStatic: true, label: 'leftWall' }),
        Bodies.rectangle(canvasWidth + 25, canvasHeight / 2, 50, canvasHeight, { isStatic: true, label: 'rightWall' }),
        Bodies.rectangle(canvasWidth / 2, -25, canvasWidth, 50, { isStatic: true, label: 'ceiling' })
    ]);

    // Setup mouse interaction
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    Composite.add(world, mouseConstraint);

    // Disable default mouse wheel behavior for Matter.js if it conflicts
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
}

// --- Image Preloading ---
function preloadImages(callback) {
    let loadedCount = 0;
    images.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages[i] = img;
            loadedCount++;
            if (loadedCount === images.length) callback();
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            loadedCount++;
            if (loadedCount === images.length) callback(); // Still call callback even if an image fails
        };
    });
}

// --- Update Static Background Visibility ---
function updateStaticBackgroundVisibility() {
    if (isGridMode) {
        staticBgLayer.style.opacity = 0; // Fade out when in grid mode
    } else {
        staticBgLayer.style.opacity = 1; // Fade in when in chaos mode
    }
}

// --- Main Render Loop ---
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for each frame

    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const img = body.renderImg.image;;
        const size = body.renderImg; // Contains width, height, category, number, description

        // Only draw if image is loaded and not hidden by filter
        if (img && size && !size.hidden) {
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            ctx.drawImage(img, -size.width / 2, -size.height / 2, size.width, size.height);
            ctx.restore();

            // Render text only in grid mode
            if (isGridMode) {
                const numberText = size.number;
                const descriptionText = size.description;

                ctx.save();
                ctx.textAlign = 'left';

     // --- Draw the Number (on top) ---
    ctx.fillStyle = 'black';
    ctx.font = 'bold 68px test'; // Adjust font size/style as needed
    ctx.fillText(numberText, body.position.x - size.width / 2.5, body.position.y - size.height / 2 - 10); // Position above image

                // --- Draw the Description (below) ---
                ctx.fillStyle = 'black';
                ctx.font = '14px kb'; // Set font before measuring text for accuracy in wrapText

                // Define maximum width for the text block (e.g., 1.5 times the image width)
                const textMaxWidth = size.width * 1.5;
                const lineHeight = 20; // Vertical spacing between lines

                let textY = body.position.y + size.height / 2 + 30; // Initial Y for the first line of description

                const lines = wrapText(ctx, descriptionText, textMaxWidth, lineHeight);

    // Draw each wrapped line
    for (let j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], body.position.x - size.width / 2, textY); // Start text at the left edge of the image
        textY += lineHeight; // Move down for the next line
    }

    ctx.restore();
}

        }
    }

    requestAnimationFrame(render); // Loop the render function
}

// --- Device Orientation (Gyroscope) ---
function setupControls() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.body.addEventListener('click', function requestGyroPermission() {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                        // Remove the info message if permission granted
                        const info = document.getElementById('gyro-info');
                        if (info) info.remove();
                    }
                })
                .catch(console.error);
            document.body.removeEventListener('click', requestGyroPermission); // Remove listener after first click
        }, { once: true }); // Only listen for the first click

        // Display info message for permission
        const info = document.createElement('div');
        info.id = 'gyro-info'; // Add an ID to easily remove it
        info.style.position = 'absolute';
        info.style.top = '50%';
        info.style.left = '50%';
        info.style.transform = 'translate(-50%, -50%)';
        info.style.color = 'white';
        info.style.fontFamily = 'sans-serif';
        info.style.fontSize = '20px';
        info.style.textAlign = 'center';
        info.innerText = 'Click to enable gyroscope control (if available)';
        document.body.appendChild(info);
    } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }
}

function handleOrientation(event) {
    const x = event.gamma / 90;
    const y = event.beta / 90;
    engine.world.gravity.x = Math.max(-1, Math.min(1, x));
    engine.world.gravity.y = Math.max(-1, Math.min(1, y));
}

// --- Grid Position Calculation (with "Imperfection") ---
function calculateGridPositions() {
    // Adjust spacing and item size based on screen width
    const screenWidth = window.innerWidth;
    let horizontalSpacing, verticalSpacing, itemSize;

    if (screenWidth < 600) { // Mobile devices
        horizontalSpacing = 50;
        verticalSpacing = 100;
        itemSize = 50;
    } else if (screenWidth < 1024) { // Tablets
        horizontalSpacing = 100;
        verticalSpacing = 150;
        itemSize = 75;
    } else { // Desktops
        horizontalSpacing = 150;
        verticalSpacing = 250;
        itemSize = 100;
    }

    const cols = Math.floor((canvas.width - horizontalSpacing) / (itemSize + horizontalSpacing));
    const positions = [];
    const gridContentWidth = cols * (itemSize + horizontalSpacing) - horizontalSpacing;
    const initialXOffset = (canvas.width - gridContentWidth) / 2.4;
    const initialYOffset = 150;

    for (let i = 0; i < bodies.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        let x = initialXOffset + col * (itemSize + horizontalSpacing) + itemSize / 2;
        let y = initialYOffset + row * (itemSize + verticalSpacing) + itemSize / 2;

        positions.push({ x, y });
    }
    return positions;
}
function organizeIntoGrid() {
    isGridMode = true; // Set flag to true
    animateToGrid(); // Call the animation function
    updateStaticBackgroundVisibility(); // Update visibility after mode change
}

// --- Reset to Chaos Mode ---
function resetPositions() {
    isGridMode = false; // Set flag to false
    bodies.forEach(body => {
        Matter.Body.setStatic(body, false); // Make the body dynamic again
        // Re-randomize positions for chaos
        const x = 100 + Math.random() * (canvas.width - 200);
        const y = 100 + Math.random() * (canvas.height - 400);
        Matter.Body.setPosition(body, { x, y });
    });
    updateStaticBackgroundVisibility(); // Update visibility after mode change
}

// --- Category Filtering ---
function filterByCategory(selectedCategory) {
    bodies.forEach(body => {
        const visible = selectedCategory === 'all' || body.renderImg.category === selectedCategory;
        body.isStatic = !visible; // Freeze if hidden
        body.renderImg.hidden = !visible; // Track visibility for rendering
    });
    // Note: Filtering logic might conflict with grid mode if you hide items
    // and then go into grid mode. Consider how you want these two features to interact.
    // For simplicity, this filter applies to both modes for now.
}


// --- Window Load Event ---
window.onload = () => {
    // 1. Preload all images, then proceed with setup
    preloadImages(() => {
        setup(); // Initialize Matter.js engine, world, and bodies

        // Set content for the static background layer as soon as images are loaded
        staticBgImage.src = staticBgContent.imageSrc;
        staticBgText.innerText = staticBgContent.text;
        // Initial visibility check based on default `isGridMode` (false, so it should be visible)
        updateStaticBackgroundVisibility();

        requestAnimationFrame(render); // Start the custom rendering loop
        const runner = Runner.create();
        Runner.run(runner, engine); // Start the Matter.js physics engine
    });

    // 2. Setup gyroscope controls
    setupControls();

    // 3. Attach event listeners for buttons
    document.getElementById('organizeButton').addEventListener('click', organizeIntoGrid);
    document.getElementById('resetButton').addEventListener('click', resetPositions);

    // 4. Attach event listeners for filter buttons
    document.querySelectorAll('#filter-bar button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterByCategory(category);
        });
    });
};

function animateToGrid() {
    const positions = calculateGridPositions();
    const duration = 2000; // Duration of the animation in milliseconds
    const startTime = performance.now();

    function animate() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure progress does not exceed 1

        bodies.forEach((body, i) => {
            const startX = body.position.x;
            const startY = body.position.y;
            const targetX = positions[i].x;
            const targetY = positions[i].y;

            // Interpolate between the start and target positions
            const newX = startX + (targetX - startX) * progress;
            const newY = startY + (targetY - startY) * progress;

            Matter.Body.setPosition(body, { x: newX, y: newY });
        });

        if (progress < 1) {
            requestAnimationFrame(animate); // Continue the animation
        } else {
            // Finalize positions and make bodies static
            bodies.forEach(body => {
                Matter.Body.setStatic(body, true);
            });
        }
    }

    requestAnimationFrame(animate);
}

// --- Window Resize Event ---
window.addEventListener('resize', setup); // Re-run setup on window resize to adjust canvas and walls



