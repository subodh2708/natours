const fs = require('fs');
const express = require('express');

const app = express();

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

const getAllTour = (req, res) => {
  console.log(req.requestedTime);
  res
    .status(200)
    .json({
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

// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', createNewTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTour).post(createNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
