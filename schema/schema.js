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
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema // Takes in a RootQuery and return a GraphQL Scehma Instance
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields:() => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        product: { type: GraphQLString },
        users: {
            // Company -to-> User => will give the list of users associated with that company,GraphQLList will-
            //- Instruct the GraphQL server to expect a list of users 
            type: new GraphQLList(UserType),
            // There are no further searches expected, after Company -to-> User, so no args are required here
            resolve(parentValue, args) {
                // parentValue => has teh current that was fetched and currently working with
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data);
            }
            
        }
    })
});

// GraphQLObjectType instructs GraphQL that how an user obj looks like 
const UserType = new GraphQLObjectType({
    name: 'User', // Obj name, usually starts with an upperCasef
    fields: () => ({ // Most important prop here, which tells GraphQL about all the diff props that a user/userObj has
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            // resolve helps to resolve the data differences, what is held as companyId in the user model, is-
            //- held as company is the UserType, resolve helps to resolve this differnce adn populate the data-
            //- appropriately 
            resolve(parentValue, args){
               return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`) 
                .then(res => res.data)
            }
        }
        
    })
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
        },
        // Creating an endpoint in the RootQuery to access the company, without going through the users
        company:{
            type: CompanyType,
            args: {
                    id:{ type: GraphQLString },
            },
            resolve(parentValue, args){ 
                return axios.get(`http://localhost:3000/companies/${args.id}`) 
                            .then(res => res.data) 
            }
        }
    }
});

// -----------> resolve() ******** 
// When a req arrives to the RootQuery with a user id, the RootQuery's resolve() will take teh request to the-
//- user part of the entire graph. To know about the company, the User's resolve() gets called, with the 1st-
//- param(parentValue) as the name of the node on the graph from where the req is made from. THen this resolve()-
//- returns a promise that eventually gives the company data. This entire data structure is sent back to client.

// The Schema can also be stated as a bunch of functions that return references to other objects in the graph,-
//- like each edgef as a resolve() in the graph 

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addUser:{
            type: UserType, // It is not always necessary that resolve() always returns the same data type that is worked on/processed
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, { firstName, age}){ // args => { firstName, age}
                return axios.post('http://localhost:3000/users', { firstName, age })
                        .then(res => res.data);
            }
        }
    }
});

// Returns a GraphQL Schema, to be used in the app
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation // mutation: mutation => Associating GraphQL Object with the GraphQL Schema 
});