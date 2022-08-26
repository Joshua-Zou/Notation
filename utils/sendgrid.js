const secrets = JSON.parse(process.env.secrets)


const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(secrets.sendgrid)

export function send(msg) {
    return new Promise((resolve, reject) => {

        sgMail
            .send(msg)
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                reject(error)
            })
    })
}