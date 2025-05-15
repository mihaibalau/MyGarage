const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

router.get('/', async (req, res) => {
    const today = new Date();

    const sortField = req.query.sortBy;
    const order = req.query.order === 'desc' ? 'desc' : 'asc';
    const validFields = ['brand', 'model', 'year', 'insurance', 'roadTax', 'inspection'];
    const keyMap = {
        brand: 'carBrand',
        model: 'carModel',
        year: 'year',
        insurance: 'insuranceValidity',
        roadTax: 'roadTaxValidity',
        inspection: 'technicalInspectionValidity'
    };

    let orderBy = undefined;
    if (sortField) {
        if (!validFields.includes(sortField)) {
            return res.status(400).json({ message: "Invalid sort field. Allowed: brand, model, year, insurance, roadTax, inspection" });
        }
        orderBy = {};
        orderBy[keyMap[sortField]] = order;
    }

    const filters = {};
    if (req.query.isValidInsurance === 'true') {
        filters.insuranceValidity = { gt: today };
    }

    if (req.query.isValidRoadTax === 'true') {
        filters.roadTaxValidity = { gt: today };
    }

    if (req.query.isValidInspection === 'true') {
        filters.technicalInspectionValidity = { gt: today };
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || undefined;

    try {
        const cars = await prisma.car.findMany({
            where: filters,
            orderBy: orderBy,
            skip: offset,
            take: limit,
            select: {
                carID: true,
                carBrand: true,
                carModel: true,
                year: true,
                insuranceValidity: true,
                roadTaxValidity: true,
                technicalInspectionValidity: true,
                userId: true
            }
        });

        const formattedCars = cars.map(car => ({
            ...car,
            insuranceValidity: car.insuranceValidity.toISOString().split('T')[0],
            roadTaxValidity: car.roadTaxValidity.toISOString().split('T')[0],
            technicalInspectionValidity: car.technicalInspectionValidity.toISOString().split('T')[0]
        }));

        res.json(formattedCars);
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const carId = parseInt(req.params.id)
    if (isNaN(carId)) {
        return res.status(400).json({ message: "Invalid car ID format" })
    }

    try {
        const car = await prisma.car.findUnique({
            where: { carID: carId }
        });
        if (!car) {
            return res.status(404).json({ message: "The car id wasn't found inside the database" })
        }

        const formattedCar = {
            ...car,
            insuranceValidity: car.insuranceValidity.toISOString().split('T')[0],
            roadTaxValidity: car.roadTaxValidity.toISOString().split('T')[0],
            technicalInspectionValidity: car.technicalInspectionValidity.toISOString().split('T')[0]
        };

        res.json(formattedCar);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving car", error: error.message })
    }
});

router.post('/', async (req, res) => {
    const validateResult = validateCar(req.body);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }

    const carData = {
        carBrand: req.body.carBrand,
        carModel: req.body.carModel,
        year: req.body.year,
        insuranceValidity: new Date(req.body.insuranceValidity),
        roadTaxValidity: new Date(req.body.roadTaxValidity),
        technicalInspectionValidity: new Date(req.body.technicalInspectionValidity),
        userId: req.body.userId || 1
    };

    try {
        const car = await prisma.car.create({ 
            data: carData 
        });
        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const carId = parseInt(req.params.id)
        if (isNaN(carId)) {
            return res.status(400).json({ message: "Invalid car ID format" })
        }

        const validateResult = validateCar(req.body)
        if (validateResult.error) {
            return res.status(400).json({ message: validateResult.error.details[0].message })
        }

        const existingCar = await prisma.car.findUnique({
            where: { carID: carId }
        })
        if (!existingCar) {
            return res.status(404).json({ message: "The car id wasn't found inside the database" })
        }

        const updateData = {
            carBrand: req.body.carBrand,
            carModel: req.body.carModel,
            year: req.body.year,
            insuranceValidity: new Date(req.body.insuranceValidity),
            roadTaxValidity: new Date(req.body.roadTaxValidity),
            technicalInspectionValidity: new Date(req.body.technicalInspectionValidity)
        }

        const updatedCar = await prisma.car.update({
            where: { carID: carId },
            data: updateData
        })

        res.status(200).json(updatedCar)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const carId = parseInt(req.params.id)
        if (isNaN(carId)) {
            return res.status(400).json({ message: "Invalid car ID format" })
        }

        const existingCar = await prisma.car.findUnique({
            where: { carID: carId }
        })

        if (!existingCar) {
            return res.status(404).json({ message: "Car not found in database" })
        }

        const updateData = {
            carBrand: req.body.carBrand ?? existingCar.carBrand,
            carModel: req.body.carModel ?? existingCar.carModel,
            year: req.body.year ?? existingCar.year,
            insuranceValidity: req.body.insuranceValidity ? new Date(req.body.insuranceValidity) : existingCar.insuranceValidity,
            roadTaxValidity: req.body.roadTaxValidity ? new Date(req.body.roadTaxValidity) : existingCar.roadTaxValidity,
            technicalInspectionValidity: req.body.technicalInspectionValidity ? new Date(req.body.technicalInspectionValidity) : existingCar.technicalInspectionValidity
        }

        const validateResult = validateCar(updateData)
        if (validateResult.error) {
            return res.status(400).json({ message: validateResult.error.details[0].message })
        }

        const updatedCar = await prisma.car.update({
            where: { carID: carId },
            data: updateData
        })

        res.status(200).json(updatedCar)

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Car not found" })
        }
        res.status(500).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const carId = parseInt(req.params.id)
        
        const deletedCar = await prisma.car.delete({
            where: { carID: carId }
        })

        res.status(200).json({
            message: "Car deleted successfully",
            deletedCar: deletedCar
        })
        
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "The car id wasn't found inside the database" })
        }
        res.status(500).json({message: error.message})
    }
})

module.exports = router;