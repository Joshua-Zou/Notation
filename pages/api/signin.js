import connectToDb from "../../utils/mongodb"
import { getToken } from "../../utils/auth";

export default async function handler(req, res) {
  const db = await connectToDb();
  
  var email = req.body.email;
  var password = req.body.password;

  var user = await db.collection("users").findOne({ email: email, password: password});
  if (!user) return res.send({status: "error", message: "Invalid credentials!"});

  
  res.status(200).json({status: "ok", token: getToken(email)})
}
