import * as Crawler from "crawler";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const hook = functions.https.onRequest(async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const crawler = new Crawler({
        maxConnections : 10,
      });
      
      crawler.direct({
        uri: 'http://www.ercot.com/content/cdr/html/hb_lz',
        skipEventRequest: false,
        callback: function(error, response) {
          const $ = response.$;
          if(error) {
            reject(`${response.statusCode}: ${error}`);
          } else {
            const table = [];
            $('.tableStyle > tbody > tr').each((index, row) => {
              if(index <= 1) return;
              const result = {};
              $('td', row).each((columnIndex, column) => {
                result[`column${columnIndex}`] = $(column).text().trim()
              });
              table.push(result);
            });
            resolve(table.reduce((agg, currentValue) => {
              agg[currentValue['column0']] = currentValue;
              return agg;
            }, {}));
          }
        }
      });
    });

    await admin.database().ref('/nest/ercot')
      .child(new Date().valueOf().toString())
      .set(data);
    res.status(200).json(data);
  } catch(ex) {
    console.log(ex);
    res.status(500).send(ex);
  }
});
