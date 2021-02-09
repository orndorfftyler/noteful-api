const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('folder')
    },
    insertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('folder')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('folder').select('*').where('id', id).first()
    },
    deleteFolder(knex, id) {
        return knex.from('folder').select('*').where('id', id).delete()
        /*
        return knex('note')
            .where({ id })
            .delete()
            */
    },
    updateFolder(knex, id, newFolderFields) {
        return knex.from('folder').select('*').where('id', id).first().update(newFolderFields)
        /*
        return knex('note')
            .where({ id })
            .update(newNoteFields)
            */
    },
};

module.exports = FoldersService;