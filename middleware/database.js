import { MongoClient } from "mongodb";
import nextConnect from "next-connect";

// Middleware setup.
// NOT SECURE - DO NOT PUSH INTO PRODUCTION WITHOUT ADDING ADDITIONAL SECURITY MEASURES
const client = new MongoClient(
	process.env.mongodb_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
	req.db = client.db(process.env.database);
  return next();
}

const middleware = nextConnect();
middleware.use(database);
export default middleware;
