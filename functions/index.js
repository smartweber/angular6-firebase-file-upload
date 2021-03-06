const functions = require('firebase-functions');
const cors       = require('cors')({ origin: true });
const axios      = require('axios');
const api_key   = 'api_key';
const domain    = 'domain.com';
const mailgun   = require('mailgun-js')({apiKey: api_key, domain: domain});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function sendMail(title, content, mailTo) {
	var data = {
		from: 'no-reply@test.com',
		subject: title,
		html: content,
		to: mailTo
	};

	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, function(error, body) {
			if (error) {
				return reject(error);
			}

			return resolve();
		});
	});
}

exports.detectHistory = functions.database.ref('/histories/{userId}').onWrite((event, context) => {
  console.log('--start--');
  console.log(event.before.val());
  console.log(event.after.val());
  var mailTo = ['web.business815@gmail.com', 'upworktest2@itnetsys.com'];
  var title = 'Notification';
  var content = 'testing';
  return sendMail(title, content, mailTo);
});

exports.getData = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.body.url) {
			var strUrl = req.body.url;
 
			axios.get(strUrl, {
        responseType: 'arraybuffer'
      })
				.then(posts => {
					res.send({
						data: posts.data
					});
				})
				.catch(error => {
					res.status(500).send({
						message: error
					});
				});
		} else {
			res.status(500).send({
				message: 'url is invalid'
			});
		}
	});
});