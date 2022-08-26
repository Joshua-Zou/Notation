import connectToDb from "../../utils/mongodb"
const crypto = require("crypto")
const sendgrid = require("../../utils/sendgrid.js")
const secrets = JSON.parse(process.env.secrets || JSON.stringify(require("../../secrets.json")))

export default async function handler(req, res) {
  const db = await connectToDb();
  const linkid = crypto.randomBytes(32).toString('hex')

  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;

  if (!email || !firstName || !password) return res.send({status: "error", message: "You must fill out all of the required fields!"});

  let user = await db.collection("users").findOne({email: email});
  if (user) return res.send("You already have an account with that email!")

  await db.collection("emails").insertOne({
    action: "verify-signup",
    data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
    },
    createdDate: Date.now(),
    id: linkid
  })
  sendgrid.send({
    to: email,
    from: "noreply@notation.tk",
    subject: "Verify your Notation account",
    html: `
        Please verify your Notation account by clicking the below link: <a href="${secrets.domain}/api/verify-email?code=${linkid}">${secrets.domain}/api/verify-email?code=${linkid}</a>
    `
  }).then(() => {
    return res.send({status: "ok"})
  }).catch(() => {
    return res.send({status: "error", message: "We couldn't verify your email! Check to see if you made a typo in your email!"})
  })
}
