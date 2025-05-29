MyGarage 🚗 - Vehicle Management System
MyGarage is a full-stack platform for tracking automotive documentation deadlines (insurance, road tax, inspections) with expiration alerts and real-time updates. Built with Next.js 14, Node.js, and Prisma ORM, it combines robust backend validation with a sleek dashboard interface using Tailwind CSS.

🔥 Core Functionality: Track expiration dates - Color-coded status alerts - CRUD operations - Mock data generation - Docker deployment

Key Features ⚙️
Expiration Tracking System
Monitors insurance validity, road tax deadlines, and technical inspection dates with automatic status indicators. The CarBadge component uses dynamic Tailwind classes to show:

🔴 Red: Expired

🟠 Orange: Expiring within 3 months

🟢 Green: Valid

typescript
// Frontend logic for status colors
function getBadgeColor(dateStr: string) {
  const expDate = new Date(dateStr);
  const threeMonths = 1000 * 60 * 60 * 24 * 90;
  return expDate < new Date() ? 'bg-red-100' 
    : (expDate.getTime() - Date.now()) <= threeMonths ? 'bg-orange-100' 
    : 'bg-green-100';
}
Real-Time Updates
Socket.io synchronizes changes across devices instantly. Edit a vehicle's details on one browser, and the update appears everywhere simultaneously.

Data Validation Layers
Backend: Joi schemas validate dates/numeric ranges

Frontend: React Hook Form + Zod ensure correct inputs before submission

Database: Prisma enforces type safety with DateTime fields

text
// Prisma schema
model Car {
  carID            Int      @id @default(autoincrement())
  insuranceValidity DateTime
  roadTaxValidity   DateTime
  technicalInspectionValidity DateTime
  // ... other fields
}
Tech Stack 🧰
Backend Services
Node.js/Express: REST API endpoints

Prisma: MySQL database management

Socket.io: Live updates

Faker.js: Generate mock vehicles (npm run generate-mock-data)

Frontend Interface
Next.js 14: App Router + Server Components

Tailwind CSS: Responsive UI with status badges

React Hook Form: Optimized form handling

DevOps
Docker: Containerized services

GitHub Actions: CI/CD pipeline

Quick Start 🚀
bash
git clone https://github.com/mihaibalau/MyGarage
docker-compose up --build
Access:

Frontend: http://localhost:3000

API: http://localhost:5000/api/cars

Document Management Logic
Expiration Workflow
Add vehicles with document dates via form

System calculates daily if documents expire within 90 days

Badges update colors based on real-time calculations

Users receive toast notifications for expired items

Database Operations
javascript
// Sample Express endpoint
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = {
    insuranceValidity: new Date(req.body.insuranceValidity),
    // ... other fields
  };
  
  const updatedCar = await prisma.car.update({
    where: { carID: Number(id) },
    data: updates
  });
  io.emit('car_updated', updatedCar); // Broadcast changes
});
Customization Guide 🔧
Modify Alert Thresholds
Edit the threeMonths constant in CarBadge.tsx to change warning periods:

typescript
const threeMonths = 1000 * 60 * 60 * 24 * 45; // 45-day warning
Add New Document Types
Extend Prisma schema with new DateTime field

Create matching Joi/Zod validation rules

Add UI components using existing badge pattern

Why MyGarage?
This isn't just another CRUD app - it's a deadline management system specifically designed for automotive documentation. The color-coded status system and real-time sync prevent missed renewals, while the Docker setup ensures easy deployment for personal or commercial use.
