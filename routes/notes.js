const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes using /fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  console.log(notes);
  res.json(notes);
});

// ROUTE 2:Add note
router.post(
  "/addnote",
  [
    body("title", "Please enter valid title atleast 3 character"),
    body(
      "description",
      "Please enter valid description atleast 5 character"
    ).isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const { title, description, tag } = req.body;

    const error = validationResult(req);

    // check wheater error occured or not
    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
    }

    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });

    const savedNote = await note.save();
    res.json(savedNote);
  }
);

// ROUTE 3 update note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  let newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  let note = await Notes.findById(req.params.id);

  if (!note) {
    return res.status(404).send("Not allowed");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  let note = await Notes.findById(req.params.id);

  if (!note) {
    return res.status(404).send("Not allowed");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }

  //   note = await Notes.findByIdAndUpdate(
  //     req.params.id,
  //     { $set: newNote },
  //     { new: true }
  //   );

  note = await Notes.findByIdAndDelete(req.params.id);

  res.json({ note });
});

module.exports = router;
