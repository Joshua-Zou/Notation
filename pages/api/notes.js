import connectToDb from "../../utils/mongodb"
import { getEmail, getUserHash } from "../../utils/auth";

export default async function handler(req, res) {
  const db = await connectToDb();

  if (req.query.action === "add-tag") {
    let tagName = req.body.tagName;
    if (tagName.length < 3 || tagName.length > 30) return res.send({ status: "error", message: "Please enter a tag name with greater than 3 characters, and less than 30!" })
    let tags = await db.collection("tags").findOne({ type: "tag-list" });
    var findX = tags.tags.find(obj => {
      if (Object.keys(obj)[0].toLowerCase() === tagName.toLowerCase()) return true;
      else return false;
    });
    if (findX) return res.send({ status: "error", message: "That tag already exists!" })
    function getColor() {
      return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)'
    }
    tags.tags.push({
      [tagName]: getColor()
    })
    db.collection("tags").updateOne({
      type: "tag-list"
    }, {
      $set: {
        tags: tags.tags
      }
    })
    return res.send({ status: "ok" })
  } else if (req.query.action === "list-tags") {
    let tags = await db.collection("tags").findOne({ type: "tag-list" });
    return res.send(tags.tags)
  } else {


    var token = req.query.token

    var email = getEmail(token)
  
    var user = await db.collection("users").findOne({ email: email });
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
    res.status(200).json({ status: "ok", data: data })
  }
}

export async function directApi(ids) {
  const db = await connectToDb();

  var notes = ids;
  var data = await db.collection("notes").find({
    id: {
      $in: notes
    }
  })
  data = await data.toArray()

  data = data.map(note => {
    note.downloadLink = null;
    return note
  })
  data = data.map(note => {
    note.userhash = getUserHash(note.owner)
    note.owner = null;
    return note;
  })
  return data;
}