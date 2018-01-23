import dotenv from "dotenv";

dotenv.config();

module.exports = 
{
	"accessKeyId": process.env.AWS_ACCESS, 
	"secretAccessKey": process.env.AWS_SECRET, 
	"region": "us-east-2"
}