import connectToDb from "../../utils/mongodb"

export default async function handler(req, res) {
    const db = await connectToDb();

    var userhash = req.query.userhash

    if (!userhash) return res.send({ status: "error", message: "Invalid credentials!" });

    let user = await db.collection("users").findOne({
       userhash: userhash
    }) || {}
    delete user.password;
    delete user.email;
    return res.send(user)
}
