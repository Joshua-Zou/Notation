import connectToDb from "../../utils/mongodb"
import { getEmail, getUserHash } from "../../utils/auth";

export default async function handler(req, res) {
  const db = await connectToDb();
  
  var token = req.query.token

  var email = getEmail(token)

  var user = await db.collection("users").findOne({ email: email});
  var notes = JSON.parse(req.query.ids || "[]");

  var data = await db.collection("notes").find({
    id: {
        $in: notes
    }
  })
  data = await data.toArray()

  data = data.map(note => {
    if (user) {
        if (user.email === note.owner) return note
        else if (user.ownedNotes.find(n => n === note.id)) {
            return note
        } else {
          note.downloadLink = null;
          return note;
        }
    } else {
        note.downloadLink = null;
        return note
    }
  })
  data = data.map(note => {
    note.userhash = getUserHash(note.owner)
    note.owner = null;
    return note;
  })
  res.status(200).json({status: "ok", data: data})
}
