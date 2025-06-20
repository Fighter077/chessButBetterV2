const axios = require('axios');

// === Configuration ===
const URL = 'https://www.chessbutbetter.com/api';

// make 20 requests to the URL
async function makeRequests() {
    const requests = Array.from({ length: 100 }, () => axios.post(URL + '/authentication/login', {
        username: 'admin',
        password: 'password'
    }).then(response => {
        //console.log(`Response status: ${response.status}`);

        const sessionID = response.data.sessionId;

        // logout again
        axios.post(URL + '/authentication/logout', {}, {
            headers: {
                'sessionID': `${sessionID}`
            }
        }).then(response => {
            //console.log(`Logout response status: ${response.status}`);
        }).catch(error => {
            console.error('Error logging out:', error.message, error.response.data);
        });
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