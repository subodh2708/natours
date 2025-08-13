const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//Middleware
app.use(morgan('dev'));

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.use((req, res, next) => {
  console.log('Hello from the middleware👋');
  next();
});

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

//Route Handling

//Tours
const getAllTour = (req, res) => {
  console.log(req.requestedTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    result: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'invalid ID' });
  }
  res.status(200).json({ status: 'success', data: tour });
};

const createNewTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newtour = Object.assign({ id: newId }, req.body);
  tours.push(newtour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tours: newtour } });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(200).json({ status: 'success', data: '<updated tour..>' });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(204).json({ status: 'success', data: null });
};

//////////////////////////////////////////////////////////

//Users

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined' });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined' });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined' });
};

//Routes

const tourRouter = express.Router();
const usersRouter = express.Router();

tourRouter.route('/').get(getAllTour).post(createNewTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

usersRouter.route('/').get(getAllUsers).post(createUser);

usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

//start server

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
