import connectToDb from "../../utils/mongodb"


export default async function handler(req, res) {
  const db = await connectToDb();
  var code = req.query.code;
  let action = await db.collection("emails").findOne({
    id: code
  });
  if (!action) return res.send("That was an invalid or expired link!");
  if (action.action === "verify-signup") {
    await db.collection("emails").deleteOne({
        id: code
    });
    let user = await db.collection("users").findOne({email: action.data.email});
    if (user) return res.send("You already have an account with that email!")
    await db.collection("users").insertOne({
        email: action.data.email,
        firstName: action.data.firstName,
        lastName: action.data.lastName,
        password: action.data.password,
        points: 0,
        listedNotes: [],
        ownedNotes: []
    });
    return res.send("Congrats! You've successfully registered! Navigate to the sign in page to continue!")
  }
}
