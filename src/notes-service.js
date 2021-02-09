const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('note')
    },
    insertNote(knex, newNote) {
        let newId = knex.from('folder').select('id').where('uuid', newNote.folder_uuid).first()//.then(rows => {return rows[0]});
        newNote.folder_id = newId;
        console.log(newId);
        return knex
            .insert(newNote)
            .into('note')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            
    },
    getById(knex, id) {
        return knex.from('note').select('*').where('id', id).first()
    },
    deleteNote(knex, id) {
        return knex.from('note').select('*').where('id', id).delete()
        /*
        return knex('note')
            .where({ id })
            .delete()
            */
    },
    updateNote(knex, id, newNoteFields) {
        return knex.from('note').select('*').where('id', id).first().update(newNoteFields)
        /*
        return knex('note')
            .where({ id })
            .update(newNoteFields)
            */
    },
};

module.exports = NotesService;