/* global __dirname */
const { createSign } = require("crypto");
const fileSystem = require("fs");
const path = require("path");

module.exports = function signFile() {

	const fileTxtPath = path.resolve(__dirname, "file.txt");
	const data = fileSystem.readFileSync(fileTxtPath);
	const dataObject = JSON.parse(data.toString());

	const privateKeyPath = path.resolve(__dirname, "..", "self-signed-certificate", "key.pem");
	const privateKey = fileSystem.readFileSync(privateKeyPath);
    
	const sign = createSign("rsa-sha256");
	sign.write(dataObject.content);
	sign.end();
	const signature = sign.sign(privateKey, "hex");                
    
	dataObject.signature = signature;    

	const fileSignedTxtPath = path.resolve(__dirname, "signed-file.txt");
	fileSystem.writeFileSync(fileSignedTxtPath, JSON.stringify(dataObject), { encoding: "utf8" });

};