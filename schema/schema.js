const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const lodash = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

/* const books = [
  { id: "1", name: "El principito", genre: "fantasy", authorId: "1" },
  { id: "2", name: "Narnia", genre: "fantasy", authorId: "2" },
  { id: "3", name: "Harry Potter", genre: "magic", authorId: "3" },
  { id: "4", name: "Apollo", genre: "fiction science", authorId: "2" },
  {
    id: "5",
    name: "Pirates of the Caribbean",
    genre: "history",
    authorId: "3"
  },
  { id: "6", name: "Pocajontas", genre: "fantasy", authorId: "3" }
];

const authors = [
  { id: "1", name: "Manchas", age: 6 },
  { id: "2", name: "Nachito", age: 1 },
  { id: "3", name: "Timmy", age: 3 }
]; */

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        //return lodash.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return lodash.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db / other source
        //return lodash.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return lodash.find(authors, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      args: { number: { type: GraphQLInt } },
      resolve(parent, args) {
        //return books;
        return Book.find({}).limit(args.number);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: { number: { type: GraphQLInt } },
      resolve(parent, args) {
        //return authors;
        return Author.find({}).limit(args.number);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorName: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let authorId = await Author.find({ name: args.authorName });
        console.log(authorId[0].id);
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: authorId[0].id //Mongo returns a list
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
