
Search our content
SIGN UP
Community
Pricing
Admin Console
Guides
Concept
Reference
Languages & SDKs
October 11, 2018
Build a Simple Web App with Express, React and GraphQL
avatar-bkelley.jpg
Braden Kelley
GraphQL and React have both become quite popular in the last few years, and it’s safe to say they go together like avocado and toast. A GraphQL server can be written in Node and lets you easily create a flexible API using JavaScript classes and functions. When a frontend developer queries the server, only the information asked for gets processed. This means you can make the backend as robust as you want while keeping the frontend light by only requesting information needed for the page you’re viewing.

GraphQL is a relatively new standard for defining types and querying data, and there are quite a few different implementations of it, both server-side and client-side. Today I’ll show you how to use Express to create a GraphQL server, as well as how to create a single-page app in React that uses Apollo’s client to query the server.

Create the React App
The quickest way to get started with a React app is to use Create React App. If you don’t already have Node, Yarn, and Create React App installed, you can run the following commands:

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
npm install --global yarn create-react-app
Next, create and start a new app:

create-react-app graphql-express-react
cd graphql-express-react
yarn start
When you run create-react-app, you’ll get a new folder with everything you need to get started, and all the dependencies you need will be installed locally using yarn. When you type yarn start from within the folder, you’re starting the frontend development server that will automatically update whenever you edit any files.

create-react-app bootstrapped app

Create the GraphQL Server
Before we continue writing the frontend, you’ll need a server to connect to. Run the following commands to install the dependencies you’ll need to get up and running:

yarn add express@4.16.3 cors@2.8.4 graphql@14.0.2 express-graphql@0.6.12 graphql-tag@2.9.2
Create a new directory in your project’s src folder, named server:

mkdir src/server
In there, create a new file named index.js, with the following code:

const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID
    author: String
    body: String
  }
`);

const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
