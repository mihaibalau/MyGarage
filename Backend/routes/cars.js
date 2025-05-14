const Joi = require('joi');
const express = require('express');
const router = express.Router();

let database = [
    { carID: 1, carBrand: "BMW", carModel: "Seria 1", year: 2010, insuranceValidity: "2025-08-10", roadTaxValidity: "2025-12-31", technicalInspectionValidity: "2026-05-03"},
    { carID: 2, carBrand: "Mercedes", carModel: "GLS", year: 2015, insuranceValidity: "2026-01-15", roadTaxValidity: "2026-04-25", technicalInspectionValidity: "2026-08-08"},
    { carID: 3, carBrand: "Volkswagen", carModel: "Caddy", year: 2018, insuranceValidity: "2025-06-08", roadTaxValidity: "2025-07-13", technicalInspectionValidity: "2027-03-04"},
    { carID: 4, carBrand: "Seat", carModel: "Ibiza", year: 2008, insuranceValidity: "2020-03-17", roadTaxValidity: "2021-11-18", technicalInspectionValidity: "2019-11-02"},
    { carID: 5, carBrand: "Volvo", carModel: "XC60", year: 2020, insuranceValidity: "2027-01-01", roadTaxValidity: "2026-03-27", technicalInspectionValidity: "2027-05-21"},
    { carID: 6, carBrand: "Skoda", carModel: "Octavia", year: 2001, insuranceValidity: "2016-06-24", roadTaxValidity: "2016-10-03", technicalInspectionValidity: "2016-01-16"}
]

function validateCar(car) {

  const schema = Joi.object({
    carBrand: Joi.string().min(3).required(),
    carModel: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2030),
    insuranceValidity: Joi.date().iso().required(),
    roadTaxValidity: Joi.date().iso().required(),
    technicalInspectionValidity: Joi.date().iso().required()
  }).unknown(true);

  return schema.validate(car);
}


router.get('/', (req, res) => {
    let cars = [...database];
    const today = new Date();

    if (req.query.sortBy) {
        const sortField = req.query.sortBy; // 'brand', 'model', 'year'
        const order = req.query.order || 'asc'; // 'asc' or 'desc'

        const validFields = ['brand', 'model', 'year', 'insurance', 'roadTax', 'inspection'];
        if (!validFields.includes(sortField)) {
            return res.status(400).json({ message: "Invalid sort field. Allowed: brand, model, year, insurance, roadTax, inspection"});
        }

        const keyMap = {
            brand: 'carBrand',
            model: 'carModel',
            year: 'year',
            insurance: 'insuranceValidity',
            roadTax: 'roadTaxValidity',
            inspection: 'technicalInspectionValidity'
        };
        const key = keyMap[sortField];

        cars.sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];

            if (key.includes('Validity')) {
                const [yearA, monthA, dayA] = valueA.split('-').map(Number);
                const [yearB, monthB, dayB] = valueB.split('-').map(Number);
                valueA = new Date(yearA, monthA - 1, dayA);
                valueB = new Date(yearB, monthB - 1, dayB);
            }

            let comparison;
            if (typeof valueA === 'string' && !(valueA instanceof Date)) {
                comparison = valueA.localeCompare(valueB); 
            } else if (valueA instanceof Date) {
                comparison = valueA - valueB;
            } else {
                comparison = valueA - valueB;
            }

            return order === 'asc' ? comparison : -comparison;
        });
    }

    if (req.query.isValidInsurance === 'true') {
        cars = cars.filter(car => {
            const [year, month, day] = car.insuranceValidity.split('-').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    if (req.query.isValidRoadTax === 'true') {
        cars = cars.filter(car => {
            const [year, month, day] = car.roadTaxValidity.split('-').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    if (req.query.isValidInspection === 'true') {
        cars = cars.filter(car => {
            const [year, month, day] = car.technicalInspectionValidity.split('-').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || cars.length;

    const paginatedCars = cars.slice(offset, offset + limit);

    res.send(paginatedCars);
});

router.get('/:id', (req, res) => {
    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });
    res.send(car);
})

router.post('/', (req, res) => {

    validateResult = validateCar(req.body)
    if(validateResult.error) return res.status(400).json({ message: validateResult.error.details[0].message });
    
    const car = {
        carID: database.length+1,
        carBrand: req.body.carBrand,
        carModel: req.body.carModel,
        year: req.body.year,
        insuranceValidity: req.body.insuranceValidity,
        roadTaxValidity: req.body.roadTaxValidity,
        technicalInspectionValidity: req.body.technicalInspectionValidity
    };

    database.push(car);
    res.status(201).send(car);

});

router.put('/:id', (req, res) => {

    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });

    validateResult = validateCar(req.body)
    if(validateResult.error) return res.status(400).json({ message: validateResult.error.details[0].message });

    car.carBrand = req.body.carBrand;
    car.carModel = req.body.carModel;
    car.year = req.body.year;
    car.insuranceValidity = req.body.insuranceValidity;
    car.roadTaxValidity = req.body.roadTaxValidity;
    car.technicalInspectionValidity = req.body.technicalInspectionValidity;

    res.send(car);
});

router.patch('/:id', (req, res) => {
    const car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });

    const updatedCar = {
        carBrand: req.body.carBrand ?? car.carBrand,
        carModel: req.body.carModel ?? car.carModel,
        year: req.body.year ?? car.year,
        insuranceValidity: req.body.insuranceValidity ?? car.insuranceValidity,
        roadTaxValidity: req.body.roadTaxValidity ?? car.roadTaxValidity,
        technicalInspectionValidity: req.body.technicalInspectionValidity ?? car.technicalInspectionValidity
    };

    const validateResult = validateCar(updatedCar);
    if (validateResult.error) return res.status(400).send(validateResult.error.details[0].message);

    car.carBrand = updatedCar.carBrand;
    car.carModel = updatedCar.carModel;
    car.year = updatedCar.year;
    car.insuranceValidity = updatedCar.insuranceValidity;
    car.roadTaxValidity = updatedCar.roadTaxValidity;
    car.technicalInspectionValidity = updatedCar.technicalInspectionValidity;

    res.send(car);
});


router.delete('/:id', (req, res) => {

    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });

    const index = database.indexOf(car);
    database.splice(index, 1);

    database.forEach((car, idx) => {
        car.carID = idx + 1;
    });

    res.send({ message: "Car deleted successfully", deletedCar: car });

});

router.get('/:brand/:model', (req, res) => {
    res.send(req.query);
});

module.exports = router;