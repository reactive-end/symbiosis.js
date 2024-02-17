// Código fuente original
const fs = require('fs');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    const sourceCode = fs.readFileSync('src/App.symbiosis').toString();
    const html = fs.readFileSync('public/index.html').toString();

    // Función para compilar el código fuente a JavaScript
    function compile(sourceCode) {
        // Analizar el código fuente y aplicar transformaciones
        const transformedCode = sourceCode
            .replace(
                /createComponent\('(\w+)',\s*\(\)\s*=>\s*{([\s\S]*?)\}\);?/g,
                function (match, componentName, componentBody) {
                    return `
                        function ${componentName}() {
                            const fragment = document.createDocumentFragment();
                            const element = document.createElement('button');
                            element.setAttribute('reference', 1);
                            element.innerHTML = 'button';
                            fragment.appendChild(element);
                            var buttonState = element.getAttribute('reference');
                            document.getElementById('root').appendChild(fragment);
                        }

                        ${componentName}();
                    `;
                }
            )
            .replace(
                /setStateOf\('(\w+)',\s*(\w+),\s*(\d+)\);?/g,
                function (match, reference, variable, value) {
                    return `const ${variable} = ${value};`;
                }
            );

        return transformedCode;
    };

    // Compilar y obtener el código JavaScript resultante
    const compiledCode = compile(sourceCode);

    const htmlToShow = html.replace('<div id="root"></div>', 
        `<div id="root">
            <script>${compiledCode}</script>
        </div>`
    );

    res.send(htmlToShow);
});

app.listen(3000, () => {
    console.log('compiling and rendering, server in port 3000...');
});