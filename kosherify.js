let conversion = {
    "Advent calendar": "Shul Calendar",
    "Advent": "Shul Calendar",
    "Christmas": "Chanuka",
    "Santa": "The Rebbe",
    "an elf": "a Chossid",
    "elf": "chossid",
    "elves'": "chassidim's",
    "elves": "chassidim",
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
conversion.push(['*', '🕎']); // I tried 🕯️ but it didn't look good

/**
 * 
 * @param {Node} node 
 */
function processNode(node) {
    if (node instanceof Text)
        node.textContent = fix(node.textContent);
    else if (node instanceof HTMLElement && node.tagName === 'CODE')
        return;
    else
        node.childNodes.forEach(processNode);
}

/**
 * 
 * @param {string} text 
 */
function fix(text) {
    return conversion.reduce(
        (txt, [from, to]) => txt.replaceAll(from, (match) => match[0] === match[0].toUpperCase() ? `${to[0].toUpperCase()}${to.slice(1)}` : to), 
        text
    )
}

processNode(document);
