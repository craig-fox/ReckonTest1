const http = require('http')
const fetch = require('node-fetch');
const hostname = 'localhost'
const port = 9999
const bounds_endpoint = "https://join.reckon.com/test1/rangeInfo"
const outputs_endpoint = "https://join.reckon.com/test1/divisorInfo"

const app = http.createServer((req, res) => {})

function outputMessages(lowerBound, upperBound, outputDetails) {
    let messages = [];
    for(i=lowerBound; i<= upperBound; i++) {
        let outputDetail = []
        outputDetails.forEach(detail => {
            const divisor = detail['divisor'];
            if(i > 0 && i % divisor === 0) {
                outputDetail.push(detail['output']);
            }

        })
        messages.push(`${i} ${outputDetail.join('')}`)
    }
    return messages
}

async function retry(endpoint, n=10) {
    for (let i = 0; i < n; i++) {
        try {
            return await fetch(endpoint);
        } catch {}
    }

    throw new Error(`Failed retrying ${n} times`);
}

(async function() {
    await app.listen(port, hostname, () => {
        console.log(`Running at http://${hostname}:${port}/`)
    });
    const resBounds = await retry(bounds_endpoint);
    const resOutputs = await retry(outputs_endpoint);
    const boundsJson = await resBounds.json()
    const outputsJson = await resOutputs.json();
    let lowerBound = boundsJson['lower'];
    let upperBound = boundsJson['upper'];
    let outputDetails = outputsJson['outputDetails'];
    messages = outputMessages(lowerBound, upperBound, outputDetails);
    messages.forEach(message => console.log(message));
})();


