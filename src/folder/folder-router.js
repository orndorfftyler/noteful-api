const express = require('express')
const folderRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')


const FoldersService = require('../folders-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')

function processFolders(arrObj) {
  
  let outArr = [];
  for (let i = 0; i < arrObj.length; i++ ){
    let temp = {};
    temp.id = arrObj[i]['uuid'];
    temp.name = arrObj[i]['folder_name'];
    outArr.push(temp);
  }
  return outArr;
}

folderRouter
  .route('/folders')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        let newf = processFolders(folders);
        res.json(newf);
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    let { id, name } = req.body
    let newFolder = { id, name }
    newFolder.uuid = newFolder.id;
    newFolder.folder_name = newFolder.name;
    delete newFolder.id;
    delete newFolder.name;
    
    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
    .then(folder => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .json(folder)
    })
  .catch(next)
  })

  folderRouter
  .route('/folders/:id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `folder doesn't exist` }
          })
        }
        res.folder = folder 
        next() 
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.folder.id,
      name: xss(res.folder.folder_name)
    })

  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)  
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, name } = req.body
    const folderToUpdate = { id, name }
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain id, name`
        }
      })
    }
    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = folderRouter