const sourceCode = `createComponent('Button', () => {
    return (
        <button reference='referencia'>
               {{ children }}
        </button>
    )
});`;

const transformedCode = sourceCode.replace(/createComponent\('(\w+)', \(\) => {(.*?)\}\);/gs, (match, componentName, componentBody) => {
    return `function ${componentName}(children) {
        ${componentBody.replace(/<(\w+)\s(.*?)>/g, '<$1 $2>').replace(/{{\s(.*?)\s}}/g, '${$1}')}\`
    }`;
});

export default transformedCode;