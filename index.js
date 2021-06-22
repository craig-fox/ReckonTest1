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

app.listen(port, hostname, () => {
    console.log(`Running at http://${hostname}:${port}/`)
    let outputMessage = [];

    Promise.all([fetch(bounds_endpoint), fetch(outputs_endpoint)])
        .then(async ([resBounds, resOutputs]) => {
            const boundsJson = await resBounds.json()
            const outputsJson = await resOutputs.json()
            return [boundsJson, outputsJson]
        })
        .then(([boundsJson, outputsJson]) => {
            let lowerBound = boundsJson['lower'];
            let upperBound = boundsJson['upper'];
            let outputDetails = outputsJson['outputDetails'];

            console.log(boundsJson)
            console.log(outputsJson)
            messages = outputMessages(lowerBound, upperBound, outputDetails);
            messages.forEach(message => console.log(message));
        })

})

