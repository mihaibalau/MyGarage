const request = require('supertest');
const app = require('./app');

describe('Car API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/cars', () => {
    it('should return all cars', async () => {
      const res = await request(app).get('/api/cars');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return only cars with valid insurance', async () => {
      const res = await request(app).get('/api/cars?isValidInsurance=true');
      expect(res.statusCode).toBe(200);
      res.body.forEach(car => {
        const [d, m, y] = car.insuranceValidity.split('/').map(Number);
        expect(new Date(y, m - 1, d) > new Date()).toBe(true);
      });
    });

    it('should sort cars by year descending', async () => {
      const res = await request(app).get('/api/cars?sortBy=year&order=desc');
      expect(res.statusCode).toBe(200);
      for (let i = 0; i < res.body.length - 1; i++) {
        expect(res.body[i].year).toBeGreaterThanOrEqual(res.body[i + 1].year);
      }
    });
  });

  describe('GET /api/cars/:id', () => {
    it('should return car by ID', async () => {
      const res = await request(app).get('/api/cars/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('carID', 1);
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app).get('/api/cars/9999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/cars', () => {
    it('should add a new valid car', async () => {
      const newCar = {
        carBrand: "TestBrand",
        carModel: "TestModel",
        year: 2022,
        insuranceValidity: "10/12/2026",
        roadTaxValidity: "11/11/2026",
        technicalInspectionValidity: "15/8/2027"
      };

      const res = await request(app).post('/api/cars').send(newCar);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('carBrand', "TestBrand");
    });

    it('should return 400 if car is invalid', async () => {
      const invalidCar = {
        carBrand: "AB",
        carModel: "X",
        year: 1899
      };

      const res = await request(app).post('/api/cars').send(invalidCar);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/cars/:id', () => {
    it('should update a car with valid data', async () => {
      const res = await request(app).put('/api/cars/1').send({
        carBrand: "UpdatedBrand",
        carModel: "UpdatedModel",
        year: 2019,
        insuranceValidity: "12/12/2026",
        roadTaxValidity: "10/10/2026",
        technicalInspectionValidity: "9/9/2026"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.carBrand).toBe("UpdatedBrand");
    });

    it('should return 404 if car not found', async () => {
      const res = await request(app).put('/api/cars/9999').send({
        carBrand: "Brand",
        carModel: "Model",
        year: 2020,
        insuranceValidity: "1/1/2027",
        roadTaxValidity: "2/2/2027",
        technicalInspectionValidity: "3/3/2027"
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/cars/:id', () => {
    it('should partially update a car', async () => {
      const res = await request(app).patch('/api/cars/2').send({
        carBrand: "PartiallyUpdatedBrand"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.carBrand).toBe("PartiallyUpdatedBrand");
    });

    it('should return 404 if car not found', async () => {
      const res = await request(app).patch('/api/cars/9999').send({
        carBrand: "Anything"
      });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 if update is invalid', async () => {
      const res = await request(app).patch('/api/cars/3').send({
        carBrand: "X", // invalid: prea scurt
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    it('should delete car by ID and return deleted object', async () => {
      const res = await request(app).delete('/api/cars/3');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', "Car deleted successfully");
      expect(res.body).toHaveProperty('deletedCar');
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app).delete('/api/cars/9999');
      expect(res.statusCode).toBe(404);
    });
  });
});
