import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as request from 'request-promise-native';

const client_id = functions.config().nest.client_id;
const client_secret = functions.config().nest.client_secret;
const pincode = functions.config().nest.pincode;


export const hook = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.database().ref('/nest/token').once("value");
    let token;
    if(!snapshot.exists() || /*is expired*/ false) {
      const tokenJit = await request({
        method: 'POST',
        uri: 'https://api.home.nest.com/oauth2/access_token',
        followAllRedirects: true,
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded' 
        },
        form: {
          client_id,
          client_secret: client_secret,
          grant_type: 'authorization_code',
          code: pincode,
        },
        json: true
      });
      await admin.database().ref('/nest/token')
        .set(tokenJit);
      token = tokenJit;
    } else {
      token = snapshot.val();
    }

    const response = await request({
      method: 'GET',
      uri: 'https://developer-api.nest.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization:`Bearer ${token.access_token}`
      },
      body: {},
      json: true
    });
    await admin.database().ref('/nest/get')
      .child(new Date().valueOf().toString())
      .set(response);
    
    res.status(200).json({
      thermostats: response.devices.thermostats,
      structures: response.devices.structures
    });
  } catch(ex) {
    console.log(ex);
    res.status(500).send('Error');
  }
});
