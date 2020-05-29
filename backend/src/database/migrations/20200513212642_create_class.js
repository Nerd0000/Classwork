exports.up = function(knex) {
    return knex.schema.createTable('classes', function(table){
        table.increments('id');
        table.string('key').notNullable();
        table.string('invite').notNullable();
        table.string('name').notNullable();
        table.string('description');
        table.string('teacher_id').notNullable();
        table.json('members');
        table.json('teams');
        table.json('warnings');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('classes');
};
