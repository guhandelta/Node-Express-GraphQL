// This file holds all the knowledge to tell the GraphQL server how the data is structured or looks like
// Has the data about what properties does each object have and how the objects are realted to each other
// The schema file also communicates all the different types of data in the app to GraphQL
const graphql = require('graphql');
const axios = require('axios'); // A helpful library to walk through and perform any operations on data

// GraphQLObjectType is used to instruct GraphQL that an entity/obj exists with it's set of props 
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema // Takes in a RootQuery and return a GraphQL Scehma Instance
} = graphql;

// GraphQLObjectType instructs GraphQL that how an user obj looks like 
const UserType = new GraphQLObjectType({
    name: 'User', // Obj name, usually starts with an upperCase
    fields: { // Most important prop here, which tells GraphQL about all the diff props that a user/userObj has
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

// RootQuery -> represents all the entrypoints of the GraphQL API | It's quite like the entry point for App Data
// RootQuery allows GraphQL to jump and land on a specidif node, in the graph of the entire data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // This tells GraphQL as any request for a user, corresponds to the UserType(defined ⇧)
        // Instructing GraphQL as -> user is an obj of type UserType and has args id of type GraphQLString
        user:{
            // The below defn means, if any request for a user provides a userId, the RootQuery will return a-
            //- UserType  
            type: UserType,
            args: {
                    id:{
                        type: GraphQLString
                    }
            },
            // resolve() is very **, as it is what that dives into the db to fetch the data
            // resolve makes it possible to fetch any data from anywhere in any way 
            resolve(parentValue, args){ //args represents the arguments that were passed into the query, which-
               //- in this case is id | args will have the args passed into the original query => id in this case

                // Go through all the users and find the user with the id === id provided as args
                // args.id, be provided to the query when the query is made
                return axios.get(`http://localhost:3000/users/${args.id}`) 
                //  .then(res => console.log(res)) => will print {data: {"id": "23",...}}, as a nested object
                // GraphQL doesn't know that the data is nested in res.data prop | Just to make axios and-
                //- GraphQL work together, just extract the data from res and send it in response
                 .then(res => res.data) 

                // resolve() can also work async by returning a promise | The GraphQL server will sense this,-
                //- wait for the promise to resolve and send the resolved data to the client/app
            }
        }
    }
});

// Returns a GraphQL Schema, to be used in the app
module.exports = new GraphQLSchema({
    query: RootQuery
});