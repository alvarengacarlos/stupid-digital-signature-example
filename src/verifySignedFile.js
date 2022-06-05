/* global __dirname */
const { X509Certificate, createVerify } = require("crypto");
const fileSystem = require("fs");
const path = require("path");

module.exports = function verifySignedFile() {

	const certificatePath = path.resolve(__dirname, "..", "self-signed-certificate", "certificate.pem");
	const certificate = fileSystem.readFileSync(certificatePath);

	const fileSignedTxtPath = path.resolve(__dirname, "signed-file.txt");
	const signedFileBuffer = fileSystem.readFileSync(fileSignedTxtPath);
   
	const signatureObject = JSON.parse(signedFileBuffer.toString());
	const signature = signatureObject.signature;

	const verifyInstance = createVerify("rsa-sha256");
	verifyInstance.write(signatureObject.content);
	verifyInstance.end();

	const signatureIsValid = verifyInstance.verify(certificate, signature, "hex");
	console.log("######################");
	console.log("Signature is %s", signatureIsValid ? "Valid" : "Invalid");

	const x509 = new X509Certificate(certificate);
	console.log("######################");
	console.log("Certificate info");     
	console.log(x509.subject);
	console.log("######################");
};