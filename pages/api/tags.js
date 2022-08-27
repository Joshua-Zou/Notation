import connectToDb from "../../utils/mongodb"

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
  } else {
    let tags = await db.collection("tags").findOne({ type: "tag-list" });
    return res.send(tags.tags)
  }
}
