const Joi = require('joi');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors());

let database = [
    { carID: 1, carBrand: "BMW", carModel: "Seria 1", year: 2010, insuranceValidity: "10/8/2025", roadTaxValidity: "31/12/2025", technicalInspectionValidity: "3/5/2026"},
    { carID: 2, carBrand: "Mercedes", carModel: "GLS", year: 2015, insuranceValidity: "15/1/2026", roadTaxValidity: "25/4/2026", technicalInspectionValidity: "8/8/2026"},
    { carID: 3, carBrand: "Volkswagen", carModel: "Caddy", year: 2018, insuranceValidity: "8/6/2025", roadTaxValidity: "13/7/2025", technicalInspectionValidity: "4/3/2027"},
    { carID: 4, carBrand: "Seat", carModel: "Ibiza", year: 2008, insuranceValidity: "17/3/2020", roadTaxValidity: "18/11/2021", technicalInspectionValidity: "2/11/2019"},
    { carID: 5, carBrand: "Volvo", carModel: "XC60", year: 2020, insuranceValidity: "1/1/2027", roadTaxValidity: "27/3/2026", technicalInspectionValidity: "21/5/2027"},
    { carID: 6, carBrand: "Skoda", carModel: "Octavia", year: 2001, insuranceValidity: "24/06/2016", roadTaxValidity: "3/10/2016", technicalInspectionValidity: "16/1/2016"}
]

function validateCar(car){

    const schema = Joi.object({
        carBrand: Joi.string().min(3).required(),
        carModel: Joi.string().min(3).required(),
        year: Joi.number().integer().min(1900).max(2025).required(),
        insuranceValidity: Joi.string().pattern(/^([0]?[1-9]|[12][0-9]|3[01])\/([0]?[1-9]|1[0-2])\/\d{4}$/),
        roadTaxValidity: Joi.string().pattern(/^([0]?[1-9]|[12][0-9]|3[01])\/([0]?[1-9]|1[0-2])\/\d{4}$/),
        technicalInspectionValidity: Joi.string().pattern(/^([0]?[1-9]|[12][0-9]|3[01])\/([0]?[1-9]|1[0-2])\/\d{4}$/)
      });

      return schema.validate(car);
}

app.get('/api/cars', (req, res) => {
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
                const [dayA, monthA, yearA] = valueA.split('/').map(Number);
                const [dayB, monthB, yearB] = valueB.split('/').map(Number);
                valueA = new Date(yearA, monthA - 1, dayA);
                valueB = new Date(yearB, monthB - 1, dayB);
            }

            let comparison;
            if (typeof valueA === 'string') {
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
            const [day, month, year] = car.insuranceValidity.split('/').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    if (req.query.isValidRoadTax === 'true') {
        cars = cars.filter(car => {
            const [day, month, year] = car.roadTaxValidity.split('/').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    if (req.query.isValidInspection === 'true') {
        cars = cars.filter(car => {
            const [day, month, year] = car.technicalInspectionValidity.split('/').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            return expiryDate > today;
        });
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || cars.length;

    const paginatedCars = cars.slice(offset, offset + limit);

    res.send(paginatedCars);
});

app.get('/api/cars/:id', (req, res) => {
    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });
    res.send(car);
})

app.post('/api/cars', (req, res) => {

    validateResult = validateCar(req.body)
    if(validateResult.error) return res.status(400).json({ error: validateResult.error.details[0].message });
    
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

app.put('/api/cars/:id', (req, res) => {

    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });

    // console.log(req.body)
    // validateResult = validateCar(req.body)
    // if(validateResult.error) return res.status(400).json({ message: "VALIDAREA CRAPA" });

    car.carBrand = req.body.carBrand;
    car.carModel = req.body.carModel;
    car.year = req.body.year;
    car.insuranceValidity = req.body.insuranceValidity;
    car.roadTaxValidity = req.body.roadTaxValidity;
    car.technicalInspectionValidity = req.body.technicalInspectionValidity;

    res.send(car);
});

app.patch('/api/cars/:id', (req, res) => {
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


app.delete('/api/cars/:id', (req, res) => {

    var car = database.find(c => c.carID === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: "The car id wasn't found inside the database" });

    const index = database.indexOf(car);
    database.splice(index, 1);

    database.forEach((car, idx) => {
        car.carID = idx + 1;
    });

    res.send({ message: "Car deleted successfully", deletedCar: car });

});

app.get('/api/cars/:brand/:model', (req, res) => {
    res.send(req.query);
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
});

// DATA GENERATION FOR CHARTS

// setInterval(() => {
//     const newCar = {
//         carID: database.length + 1,
//         carBrand: "LiveBrand_" + Math.floor(Math.random() * 100),
//         carModel: "ModelX",
//         year: 2000 + Math.floor(Math.random() * 25),
//         insuranceValidity: "1/1/2027",
//         roadTaxValidity: "1/1/2027",
//         technicalInspectionValidity: "1/1/2027"
//     };
//     database.push(newCar);
//     io.emit('newCar', newCar); // trimite mașina nouă către toți clienții conectați
// }, 10000); // la fiecare 10 secunde


// LARGE DATA UPLOADING

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/files/${req.file.filename}`
    });
});

app.get('/files/:filename', (req, res) => {
    const filepath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found.');
    }
});

// END

const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Server + WebSocket listening on port ${port}...`));

module.exports = app;
