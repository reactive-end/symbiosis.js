// Definir Importaciones
const fs = require('fs');
const express = require('express');

// Inicializar Servidor
const server = express();

// Definir Constantes
const originHTML = fs.readFileSync('public/index.html', 'utf-8').toString();
const htmlRegex = /(?<=````)[\s\S]*?(?=````)/;
const cssRegex = /(?<=----)[\s\S]*?(?=----)/;
const jsRegex = /(?<={{)[\s\S]*?(?=}})/;

// Obtener codigo
let sourceCode = fs.readFileSync('src/page.sjs', 'utf-8').toString();

// Proceso de Compilacion
function compile() {
    // Remplazar Codigo
    const html = sourceCode.match(htmlRegex);
    const css = sourceCode.match(cssRegex);
    const js = sourceCode.match(jsRegex);

    console.log(events);

    // Objeto de Respuesta
    return {
        html,
        css,
        js
    };
};

server.get('/', (req, res) => {
    const { html, css, js } = compile();
    const output = originHTML.replace('<div id="root"></div>', 
        `
            <div id="root">
                ${html != null ? html : ''}
            </div>
            
            <style>
                ${css != null ? css : ''}
            </style>

            <script>
                ${js != null ? js : ''}
            </script>
        `
    );

    res.send(output);
});

server.listen(3000, () => {
    console.log('compiling and serving at http://localhost:3000');
});