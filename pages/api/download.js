import connectToDb from "../../utils/mongodb"
import { getEmail } from "../../utils/auth";

export default async function handler(req, res) {
  const db = await connectToDb();
  
  var token = req.query.token
  var noteid = req.query.noteid

  if (!token) return res.send({status: "error", message: "Invalid credentials!"});

  var email = getEmail(token)

  var user = await db.collection("users").findOne({ email: email});
  if (!user) return res.send({status: "error", message: "Invalid credentials!"});

   console.log(user.listedNotes.find(note => note !== noteid))
  if (!user.listedNotes.find(note => note === noteid) && !user.ownedNotes.find(note => note === noteid)) return res.send({status: "error", message: "You don't have permissions to download that!"});
  let noteInfo = await db.collection("notes").findOne({id: noteid});
  if (!noteInfo) return res.send({status: "error", message: "That doesn't exist!"}); 
  return res.redirect(noteInfo.downloadLink)
}
