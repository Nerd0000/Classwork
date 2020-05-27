exports.up = function(knex) {
    return knex.schema.createTable('actions', function(table){
        table.increments('id');
        table.string('id_auth').notNullable();
        table.string('id_rep').notNullable();
        table.json('action').notNullable();
        table.json('files');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('actions');
};
