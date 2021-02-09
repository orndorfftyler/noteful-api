const express = require('express')
const noteRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')


const NotesService = require('../notes-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')

function processNotes(arrObj) {
  
  let outArr = [];
  for (let i = 0; i < arrObj.length; i++ ){
    let temp = {};
    temp.id = arrObj[i]['uuid'];
    temp.name = arrObj[i]['note_name'];
    temp.modified = arrObj[i]['modified'];
    temp.folderId = arrObj[i]['folder_uuid'];
    temp.content = arrObj[i]['content'];
    outArr.push(temp);
  }
  return outArr;
}


noteRouter
  .route('/notes')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        let newn = processNotes(notes);
        res.json(newn)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    let { id, name, modified, folderId, content } = req.body
    let newNote = { id, name, modified, folderId, content }
    newNote.uuid = newNote.id;
    newNote.note_name = newNote.name;
    newNote.folder_uuid = newNote.folderId;
    delete newNote.id;
    delete newNote.name;
    delete newNote.folderId;
    
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
    .then(note => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.id}`))
        .json(note)
    })
  .catch(next)
  })

  noteRouter
  .route('/notes/:id')
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          })
        }
        res.note = note 
        next() 
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.note.id,
      name: xss(res.note.note_name), 
      modified: res.note.modified,
      folderId: res.note.folder_uuid,
      content: xss(res.note.content) 
    })

  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)  
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, name, modified, folderId, content } = req.body
    const noteToUpdate = { id, name, modified, folderId, content }
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain id, name, modified, folderId, content`
        }
      })
    }
    NotesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = noteRouter