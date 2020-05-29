exports.up = function(knex) {
    return knex.schema.createTable('teams', function(table){
        table.increments('id');
        table.integer('class_id').notNullable();
        table.json('members');
        table.json('goals');
        table.string('repos').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('teams');
};
