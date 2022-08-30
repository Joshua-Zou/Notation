const crypto = require("crypto");
const secrets = JSON.parse(process.env.secrets)


var algorithm = "aes-192-cbc";
var password = secrets.encryption
const key = crypto.scryptSync(password, 'salt', 24);
const iv = secrets.iv

export function getToken(email) {
    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        var encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    } catch (e) {
        return null;
    }
}
export function getEmail(token) {
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        var decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch(e) {
        return null
    }
}
export function getUserHash(email) {
    try {
        return crypto.createHash('md5').update(email).digest('hex');
    } catch(e) {
        return null
    }
}