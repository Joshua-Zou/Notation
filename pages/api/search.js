import connectToDb from "../../utils/mongodb"
import { getEmail } from "../../utils/auth";

export default async function handler(req, res) {
    try {
        const db = await connectToDb();

        var query = req.query.query;
        var tags = req.query.tags
        var cursor = req.query.cursor || 0;

        if (tags === "undefined") tags = null


        var dbQuery = {
            $text: {
                $search: query
            }
        }


        if (!query) delete dbQuery.$text;
        if (tags && JSON.parse(tags).length !== 0) {
            dbQuery.tags = {
                $in: JSON.parse(tags)
            }
        }

        var data = await db.collection("notes").find(dbQuery).limit(20).skip(Number(cursor))
        data = await data.toArray()

        data = data.map(note => {
            note.downloadLink = null;
            return note
        })
        res.status(200).json({ status: "ok", data: data })
    } catch (e) {
        console.log(e)
        return res.send({ status: "error", message: "Something went horribly wrong! Try again later" })
    }
}
