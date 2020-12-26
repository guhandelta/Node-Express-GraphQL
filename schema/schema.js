// This file holds all the knowledge to tell the GraphQL server how the data is structured or looks like
// Has the data about what properties does each object have and how the objects are realted to each other
// The schema file also communicates all the different types of data in the app to GraphQL
const graphql = require('graphql');
// GraphQLObjectType is used to instruct GraphQL that an entity/obj exists with it's set of props 
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
} = graphql;

// GraphQLObjectType instructs GraphQL that how an user obj looks like 
const UserType = new GraphQLObjectType({
    name: 'User', 
    fields: { // Most important prop here, which tells GraphQL about all the diff props that a user/userObj has
        id: {type: GraphQLString },
        firstName: {type: GraphQLString },
        age: {type: GraphQLInt }
    }
});