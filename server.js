const { GraphQLServer } = require('graphql-yoga');

const messages = []; 

// Types or Schema for GraphQL server => GraphQL Server Defn
const typeDefs = `
    type Message{
        id: ID!
        user: String!
        content: String!
    }

    type Query{
        messages: [Message!] 
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }
`
// messages: [Message!]  => returns an array of messages
// postMessage( container,{args} )

// Resolvers help retrieve the data, as per the typeDefs, by matching the keys in the typeDef
const resolvers = {
    Query:{
        messages: () => messages,
    },
    Mutation:{
        postMessage: (parent, {user, content}) => {
            const id = messages.length;
            messages.push({
                id, 
                user,
                content
            });
            return id;
        },
    },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({port})=>{
    console.log(`Server running on port: ${port}`);
})