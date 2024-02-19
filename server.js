// Definir Importaciones
const fs = require('fs');
const express = require('express');

// Inicializar Servidor
const server = express();

// Definir Constantes
const originHTML = fs.readFileSync('public/index.html', 'utf-8').toString();
const htmlRegex = /(?<=````)[\s\S]*?(?=````)/;
const cssRegex = /(?<=----)[\s\S]*?(?=----)/;

// Obtener codigo
let sourceCode = fs.readFileSync('src/page.sjs', 'utf-8').toString();

// Proceso de Compilacion
function compile() {
    // Remplazar Codigo
    const htmlMatch = sourceCode.match(htmlRegex);
    const cssMatch = sourceCode.match(cssRegex);

    // Objeto de Respuesta
    return {
        html: htmlMatch,
        css: cssMatch
    };
};

server.get('/', (req, res) => {
    const { html, css } = compile();
    const output = originHTML.replace('<div id="root"></div>', 
        `<div id="root">
            ${html}
        </div>
        
        <style>
            ${css}
        </style>
        `
    );

    res.send(output);
});

server.listen(3000, () => {
    console.log('compiling and serving at http://localhost:3000');
});