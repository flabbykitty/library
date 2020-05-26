/**
 * User model
 */

const bcrypt = require('bcrypt')

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		books() {
			return this.belongsToMany('Book');
		},
	}, {
        hashSaltRounds: 10,
        
        fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},

        async login(username, password) {
        
            // find user with the username(bail if no such user exists)
            const user = await new this({username}).fetch({require: false})
            if (!user) {
                return false
            }

            const hash = user.get('password')

            return(await bcrypt.compare(password, hash))
                ? user
                : false
        },
	});
};
