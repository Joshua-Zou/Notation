import connectToDb from "../../utils/mongodb"
import { getEmail } from "../../utils/auth";

export default async function handler(req, res) {
  const db = await connectToDb();
  
  var token = req.query.token

  if (!token) return res.send({status: "error", message: "Invalid credentials!"});

  var email = getEmail(token)

  var user = await db.collection("users").findOne({ email: email});
  if (!user) return res.send({status: "error", message: "Invalid credentials!"});

  delete user.password
  
  res.status(200).json({status: "ok", data: user})
}
