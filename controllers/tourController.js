const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  next();
};

//Route Handlers
exports.getAllTour = (req, res) => {
  console.log(req.requestedTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    result: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({ status: 'success', data: tour });
};

exports.createNewTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: '<updated tour..>' });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
