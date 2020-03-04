const router = require('express').Router();
const Note = require('../models/Note.js');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('notes/new-note.hbs');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  const { title, description }= req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Por favor introduce un título'});
  }
  if (!description) {
    errors.push({text: 'Por favor introduce una descripción'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note.hbs', {
      errors,
      title,
      description
    });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Has añadido una nota!');
    res.redirect('/notes');
  }
});

router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({date : 'desc'});
  res.render('./notes/old-notes.hbs', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit-note.hbs', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
  const {title, description}= req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description});
  req.flash('success_msg', 'Nota actualizada!');
  res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Nota eliminada!');
  res.redirect('/notes');
})

module.exports = router; 