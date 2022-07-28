
import nextConnect from "next-connect";
import middleware from "../../middleware/database";
const handler = nextConnect();
handler.use(middleware);

// API Handler
handler.post(async (req, res) => {
    let body = JSON.parse(req.body);
    if (req.method === "POST") {
        await req.db
          .collection(`trades`)
          .insertOne( body, { upsert: true });
        res.status(200).json({ status: "Inserted" });
      } else {
        console.log("POST REQUESTS ONLY");
        res.status(200).json({ status: negRes });
      }
});

export default handler;

