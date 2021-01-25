const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 7777;
const VideoRequestData = require('./data/video-requests.data');
const UserData = require('./data/user.data');
const cors = require('cors');
const mongoose = require('./models/mongo.config');
const videoRequestsData = require('./data/video-requests.data');


if (!Object.keys(mongoose).length) return;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); //important for using json format

app.get('/', (req, res) =>
  res.send('Welcome to semicolon academy APIs, use /video-request to get data')
);

app.post('/video-request', async (req, res, next) => {
  console.log(req.body)
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  next();
});

app.get('/video-request', async (req, res, next) => {
  const { sortBy, searchTerm } = req.query
  let data
  if ( sortBy === 'topVoted') { 
    data = data.sort((prev, next) => {
      if (
        prev.votes.ups - prev.votes.downs >
        next.votes.ups - next.votes.downs
      ) {
        return -1;
      } else {
        return 1;
      }
    })
  }
  if (searchTerm){
    data = await videoRequestsData.searchRequests(searchTerm)
  }
  else {
    data = await VideoRequestData.getAllVideoRequests()
  }
  res.send(data);
  next();
});

app.get('/users', async (req, res, next) => {
  const response = await UserData.getAllUsers(req.body);
  res.send(response);
  next();
});

app.post('/users/login', async (req, res, next) => {
  const response = await UserData.createUser(req.body);
  res.redirect(`http://localhost:5500?id=${response._id}`);
  next();
});



app.put('/video-request/vote', async (req, res, next) => {
  const { id, vote_type } = req.body;
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type);
  res.send(response);
  next();
});

app.put('/video-request', async (req, res, next) => {
  const { id, status, resVideo } = req.body;

  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
});

app.delete('/video-request', async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
