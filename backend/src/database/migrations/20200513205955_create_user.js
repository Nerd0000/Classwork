exports.up = function(knex) {
    return knex.schema.createTable('users', function(table){
        table.increments('id');
        table.integer('git_id');
        table.string('id_auth').notNullable();
        table.string('email').notNullable();
        table.string('type').notNullable();
        table.string('real_name').notNullable();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.string('password').notNullable();
        table.json('classes');
        table.json('teams');
        table.json('repos');
        table.json('urls');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
