exports.up = function(knex) {
    return knex.schema.createTable('teams', function(table){
        table.increments('id');
        table.json('members');
        table.json('goals');
        table.string('repos').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('teams');
};
