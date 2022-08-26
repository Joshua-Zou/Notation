const secrets = JSON.parse(JSON.stringify(require("../secrets.json")) || process.env.secrets)



export async function user() {
    var data = await fetch(secrets.domain + "/api/user?token=" + (localStorage.token || sessionStorage.token))
    data = await data.json()
    if (data.status === "error") {
        return window.location.href = "/signin"
    }
    return data.data
}
export async function listedNotes(user) {
    var data = await fetch(secrets.domain + "/api/notes?token=" + (localStorage.token || sessionStorage.token) + "&ids=" + JSON.stringify(user.listedNotes))
    data = await data.json()
    if (data.status === "error") {
        return window.location.href = "/signin"
    }
    return data.data
}
export async function ownedNotes(user) {
    var data = await fetch(secrets.domain + "/api/notes?token=" + (localStorage.token || sessionStorage.token) + "&ids=" + JSON.stringify(user.ownedNotes))
    data = await data.json()
    if (data.status === "error") {
        return window.location.href = "/signin"
    }
    return data.data
}
export async function note(noteid, incognito) {
    if (incognito) {
        var data = await fetch(secrets.domain + "/api/notes?ids=" + JSON.stringify([noteid]))
    } else {
        var data = await fetch(secrets.domain + "/api/notes?token=" + (localStorage.token || sessionStorage.token) + "&ids=" + JSON.stringify([noteid]))
    }
    data = await data.json()
    return data.data[0]
}