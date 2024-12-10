let conversion = {
    "Advent calendar": "Shul Calendar",
    "Advent": "Shul Calendar",
    "Christmas": "Chanuka",
    "December": "Kislev",
    "Easter Bunny": "Magic Matzo Ball",
    "Easter": "Pesach",
    "Santa": "The Rebbe",
    "an elf": "a Chossid",
    "elf": "chossid",
    "elves'": "chassidim's",
    "elves": "chassidim",
    "elvish": "chassidish",
    "reindeer": "Moshiach's donkey", // Unfortunately we can't distinguish singular and plural
    "sleigh": "wagon",
    "bells": "accordions",
    "bell": "accordion",
    "stars": "Chanuka candles",
    "star": "Chanuka candle",
    "magic": "kabbalah",
    "magical": "kabbalistic",
    "magician": "kabbalist"
}

// Optimisations so we don't do this every time the function is called
conversion = Object.entries(conversion).map(([from, to]) => [new RegExp(`\\b${from}${/\w$/.test(from) ? '\\b' : ''}`, 'ig'), to]);
// Add stars as a special case, not requiring word boundaries
conversion.push(['*', '🕯']);

// Store all the replacements we've done, so we can toggle
/**
 * @type {{node: Text, orig: string, changed: string}[]}
 */
const replacements = [];

function processNode(/**@type{Node}*/ node) {
    if (node instanceof Text) {
        const orig = node.textContent, 
            changed = fix(node.textContent);
        if (changed !== orig)
            replacements.push({node, orig, changed});
    }
    else if (node instanceof HTMLElement && node.tagName === 'CODE')
        return;
    else if (node instanceof HTMLElement && node.classList.contains('calendar'))
        // Only replace the stars at the end
        node.querySelectorAll('.calendar-mark-complete,.calendar-mark-verycomplete').forEach(processNode);
    else
        node.childNodes.forEach(processNode);
}


function fix(/**@type{string}*/ text) {
    return conversion.reduce(
        (txt, [from, to]) => txt.replaceAll(from, (match) => match[0] === match[0].toUpperCase() ? `${to[0].toUpperCase()}${to.slice(1)}` : to), 
        text
    )
}

processNode(document);

/** @type{HTMLButtonElement} */
let button;

function kosherify() {
    replacements.forEach(({node, changed}) => node.textContent = changed);
    document.body.classList.add('kosher');
    button.title = 'Treifify';
}

function treifify() {
    replacements.forEach(({node, orig}) => node.textContent = orig);
    document.body.classList.remove('kosher');
    button.title = 'Kosherify';
}

function toggle() {
    if (document.body.classList.contains('kosher'))
        treifify();
    else
        kosherify();
}

if (replacements.length) {
    // Create toggle button
    button = document.createElement('button');
    button.id = 'kosherify_toggle';
    // We can't do this in CSS because Chrome doesn't find it
    button.style.backgroundImage = `url(${(globalThis.browser??globalThis.chrome).runtime.getURL('jaoc128.png')})`;
    document.body.appendChild(button);
    button.addEventListener('click', toggle);

    kosherify();
}
