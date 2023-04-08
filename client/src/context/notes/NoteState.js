import NoteContext from "./NoteContext";
import React, { useState } from 'react';
import axios from "axios";
const NoteState = (props) => {

    // const host = "http://localhost:5000"

    const [notes, setNotes] = useState([]);
    const [alert, setAlert] = useState(null);
    const [user, setUser] = useState("");
    const [noOfNotes, setNoOfNotes] = useState(0);
    const [timestamp, setTimestamp] = useState("");

    // Get Notes
    const getNote = async () => {
        // To do api call
        getUserdata();


        const response = await axios.get(`/api/notes/fetchallnotes`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("token")

            }
        })

        setNoOfNotes(response.data.length);
        setNotes(response.data);
    }

    // Add note
    const addNote = async (title, description, tag) => {
        // To do api call

        const response = await axios.post(`/api/notes/addnote`,
            JSON.stringify({ title, description, tag }),
            {
                headers: {
                    'Content-Type': "application/json",
                    'auth-token': localStorage.getItem('token')
                }
            }
        )

        setNoOfNotes(noOfNotes + 1);
        setNotes(notes.concat(response.data));
    }

    // Delete Note
    const deleteNote = async (id) => {
        // TODO API Call

        await axios.delete(`/api/notes/deletenote/${id}`,

            {
                headers: {
                    'Content-Type': "application/json",
                    'auth-token': localStorage.getItem("token")
                }
            })

        // const json = await response.json();
        const newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNoOfNotes(noOfNotes - 1);
        setNotes(newNotes);
    }


    // update note
    const editNote = async (id, title, description, tag) => {
        // API Call

        await axios.put(`/api/notes/updatenote/${id}`,
            JSON.stringify({ title, description, tag }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token")
                }
            }
        )

        // const json = await response.json();

        let newNotes = JSON.parse(JSON.stringify(notes));


        for (let index = 0; index < newNotes.length; index++) {
            const element = notes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }

        }
        setNotes(newNotes);
    }


    const capatalize = (word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    // get User data

    const getUserdata = async () => {
        // To do api call

        const response = await axios.post(`/api/auth/getuser`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token")
                }
            })

        const userFetch = capatalize(response.data.name);

        const date = new Date(response.data.date);
        
        const strTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        setTimestamp(strTime);
        setUser(userFetch)
    }


    // Show Alert
    const showAlert = (message, type) => {
        setAlert({
            message: message,
            type: type
        })

        setTimeout(() => {
            setAlert(null)
        }, 3000);
    }

    return (
        <>
            <NoteContext.Provider value={{ notes, user, noOfNotes, timestamp, getNote, setNotes, addNote, deleteNote, editNote, getUserdata, alert, showAlert }} >
                {props.children}
            </NoteContext.Provider>
        </>
    )
}
export default NoteState;
