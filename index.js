const sendMail = require('./send_mail');

sendMail({
			from: 'from@address.co.uk',
			to: 'to@address.co.uk',
			subject: 'Testing 1, 2, 3',
			text: 'Hello world?'
	})
	.then(console.log)
	.catch(console.error)

