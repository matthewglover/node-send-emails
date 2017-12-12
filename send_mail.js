const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');

const identity = a => a;

const isTestEnvironment = () => process.env.NODE_ENV  === 'test';

const buildEtherealTransporter = () => {
	if (!process.env.ETHEREAL_USERNAME) throw new Error('Missing environment variable: ETHEREAL_USERNAME');
	if (!process.env.ETHEREAL_PASSWORD) throw new Error('Missing environment variable: ETHEREAL_PASSWORD');

	return nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: process.env.ETHEREAL_USERNAME,
			pass: process.env.ETHEREAL_PASSWORD
		}
	});
};

const buildAWSTransporter = () => {
	if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('Missing environment variable: AWS_ACCESS_KEY_ID');
	if (!process.env.AWS_SECRET_ACCESS_KEY_ID) throw new Error('Missing environment variable: AWS_SECRET_ACCESS_KEY_ID');

	return nodemailer.createTransport(ses({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
	}));
};

const transporter = isTestEnvironment() ? buildEtherealTransporter() : buildAWSTransporter();

const addTestUrl = (response) =>
	Object.assign({}, response, { testUrl: nodemailer.getTestMessageUrl(response) });

const decorateResponse = isTestEnvironment() ? addTestUrl : identity;

const sendMail = (mailOptions) =>
	transporter
		.sendMail(mailOptions)
		.then(decorateResponse);

module.exports = sendMail;
