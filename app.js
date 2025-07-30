const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const path = require('path')
const fileUpload = require('express-fileupload');
const { errors } = require('celebrate');
const apiRoutes = require('./routes/apiRoutes')


const app = express()


app.use(express.json())
app.use(fileUpload());
app.use('/api/pcMgnt',apiRoutes)

// GraphQL route (non-blocking to existing routes)
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true // enables browser-based playground
}))

app.use(errors())
app.use('/uploads/checklist', express.static(path.join(__dirname, '/uploads/checklist')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const port = process.env.PORT || 8000;

app.listen(port, (req, res) => {
    console.log(`-------------------------- My project is running on : ${port} -------------------------`);
})