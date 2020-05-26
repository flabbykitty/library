/**
 * Book model
 */


module.exports = (bookshelf) => {
    return bookshelf.model('Book', {
        tableName: 'books',
        author() {
            return this.belongsTo('Author')
        },
        users() {
            return this.belongsToMany('User')
        }
    },
    {
        fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},
    })
}