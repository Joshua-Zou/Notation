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

  if (user.listedNotes.find(note => note === noteid) && user.ownedNotes.find(note => note === noteid)) return res.send({status: "error", message: "You already own that note!"});
  let noteInfo = await db.collection("notes").findOne({id: noteid});
  if (!noteInfo) return res.send({status: "error", message: "That note doesn't exist!"}); 
  
  if (user.points < 8) return res.send({status: "error", message: "Sorry :( You don't have enough points!"});
  await db.collection("notes").updateOne({id: noteInfo.id}, {
    $inc: {
        downloadCount: 1
    }
  })
  await db.collection("users").updateOne({email: user.email}, {
    $inc: {
        points: -8
    },
    $push: {
        ownedNotes: noteid
    }
  })
  await db.collection("users").updateOne({email: noteInfo.owner}, {
    $inc: {
        points: 10
    }
  })
  return res.send({status: "ok"})
}
