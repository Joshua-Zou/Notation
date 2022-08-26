import connectToDb from "../../utils/mongodb"
import { getEmail } from "../../utils/auth";
import { Formidable } from 'formidable'
import AWS from 'aws-sdk'
const crypto = require("crypto")
const fs = require("fs")
const secrets = JSON.parse(process.env.secrets)

//set bodyparser
export const config = {
    api: {
        bodyParser: false
    }
}

const s3 = new AWS.S3({
    accessKeyId: secrets["aws-key-id"],
    secretAccessKey: secrets["aws-key"]
})

export default async function handler(req, res) {
    const db = await connectToDb();

    var token = req.query.token

    if (!token) return res.send({ status: "error", message: "Invalid credentials!" });

    var email = getEmail(token)

    var user = await db.collection("users").findOne({ email: email });
    if (!user) return res.send({ status: "error", message: "Invalid credentials!" });

    try {

        if (req.query.action === "create") {
            const data = await new Promise((resolve, reject) => {
                const form = new Formidable({
                    maxFileSize: 30 * 1024 * 1024
                })

                form.parse(req, (err, fields, files) => {
                    if (err) reject({ err })
                    resolve({ err, fields, files })
                })
            })

            var name = data.fields.name
            var tags = JSON.parse(data.fields.tags)
            var tagline = data.fields.tagline
            var description = data.fields.description
            var pdfPath = data.files.pdf.filepath;

            if (!name || name === "undefined") return res.send({ status: "error", message: "You must provide a name for your note!" })
            if (!tags || tags.length === 0) return res.send({ status: "error", message: "You must provide at least one tag for your note!" })
            if (!tagline || tagline === "undefined") return res.send({ status: "error", message: "You must provide a tagline for your note!" })
            if (!description || description === "undefined") return res.send({ status: "error", message: "You must provide a description for your note!" })
            if (!pdfPath || pdfPath === "undefined") return res.send({ status: "error", message: "You must upload your file in pdf form!" })

            var id = crypto.randomBytes(32).toString('hex')
            var downloadlinkid = crypto.randomBytes(56).toString('hex')

            let link = await uploadFile(pdfPath, `${downloadlinkid}.pdf`);
            await db.collection("notes").insertOne({
                id: id,
                name: name,
                tags: tags,
                tagline: tagline,
                description: description,
                downloadLink: link,
                owner: email,
                downloadCount: 0
            })
            await db.collection("users").updateOne({
                email: email
            }, {
                $push: {
                    listedNotes: id
                }
            })
            return res.send({ status: "ok" })
        } else if (req.query.action === "edit") {
            if (!user.listedNotes.find((e) => e === req.query.id)) return res.send({ status: "error", message: "You don't have permission to do that!" })


            const data = await new Promise((resolve, reject) => {
                const form = new Formidable({
                    maxFileSize: 30 * 1024 * 1024
                })

                form.parse(req, (err, fields, files) => {
                    if (err) reject({ err })
                    resolve({ err, fields, files })
                })
            })

            var name = data.fields.name
            var tags = JSON.parse(data.fields.tags)
            var tagline = data.fields.tagline
            var description = data.fields.description

            if (!name || name === "undefined") return res.send({ status: "error", message: "You must provide a name for your note!" })
            if (!tags || tags.length === 0) return res.send({ status: "error", message: "You must provide at least one tag for your note!" })
            if (!tagline || tagline === "undefined") return res.send({ status: "error", message: "You must provide a tagline for your note!" })
            if (!description || description === "undefined") return res.send({ status: "error", message: "You must provide a description for your note!" })

            var id = req.query.id

            await db.collection("notes").updateOne({ id: req.query.id }, {
                $set: {
                    name: name,
                    tags: tags,
                    tagline: tagline,
                    description: description
                }
            })
            return res.send({ status: "ok" })
        } else if (req.query.action === "delete") {
            if (!user.listedNotes.find((e) => e === req.query.id)) return res.send({ status: "error", message: "You don't have permission to do that!" })
            let noteDocument = await db.collection("notes").findOne({
                id: req.query.id
            })
            await removeFile(noteDocument.downloadLink)
            await db.collection("notes").deleteOne({
                id: req.query.id
            });

            var newListedNotes = user.listedNotes.filter(item => item !== req.query.id)
            await db.collection("users").updateOne({
                email: email
            }, {
                $set: {
                    listedNotes: newListedNotes
                }
            })
        }
    } catch (e) {
        console.log(e)
        return res.send({ status: "error", message: "You probably need to upload a PDF first! If you already did, then something went really really wrong on the server!" })
    }


    res.status(200).json({ status: "ok", data: user })
}


function uploadFile(filePath, uploadName) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath)

        const params = {
            Bucket: "notation-images",
            Key: uploadName,
            Body: fileContent
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data.Location)
        })
    })
}
function removeFile(downloadLink) {
    return new Promise((resolve, reject) => {

        const params = {
            Bucket: "notation-images",
            Key: downloadLink.split("/")[downloadLink.split("/").length-1]
        }

        s3.deleteObject(params, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(true)
        })
    })
}