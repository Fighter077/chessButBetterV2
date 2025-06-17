const axios = require('axios');

// === Configuration ===
const URL = 'https://www.chessbutbetter.com';

// make 100 requests to the URL
async function makeRequests() {
    const requests = Array.from({ length: 1000 }, () => axios.get(URL).then(response => {
        console.log(`Response status: ${response.status}`);
    }));

    try {
        const responses = await Promise.all(requests);
        console.log(`Successfully made ${responses.length} requests to ${URL}`);
    } catch (error) {
        console.error('Error making requests:', error.message);
    }
}

// === Main ===
(async () => {
    await makeRequests();
})();
// === End of Code ===