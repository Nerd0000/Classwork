exports.up = function(knex) {
    return knex.schema.createTable('classes', function(table){
        table.increments('id');
        table.integer('teacher_id').notNullable();
        table.string('teacher_name').notNullable();
        table.json('members');
        table.json('teams');
        table.json('warnings');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('classes');
};
