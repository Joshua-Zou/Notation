import * as notes from "../pages/api/notes"

export async function note(noteid) {
    console.log(notes)
    let data = await notes.directApi([noteid]);
    return data[0]
}