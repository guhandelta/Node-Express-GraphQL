const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const PORT = 4000;

app.use('/graphql', graphqlHTTP({
   schema, // schema: schema
   graphiql: true // graphiql is a development tool that allows to query against the server, only to be used-
   //- in dev env
   
}));

app.listen(PORT, () => {
    console.log(`Server Listening on port: ${PORT}`)
});
 