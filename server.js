const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT=process.env.PORT || 5000

// Initialize Prisma Client
const prisma = new PrismaClient();

// CORS configuration (allowing frontend on Vercel)
const corsOptions = {
    origin: 'https://fsd-task.vercel.app', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Endpoint for adding employees
app.post('/api/employees', async (req, res) => {
    const {
        name,
        employeeID,
        email,
        phoneNumber,
        age,
        address,
        gender,
        department,
        dateOfJoining,
        role,
    } = req.body;

    try {
        // Insert employee into the database using Prisma
        const newEmployee = await prisma.employee.create({
            data: {
                name,
                employeeID,
                email,
                phoneNumber,
                age,
                address,
                gender,
                department,
                dateOfJoining: new Date(dateOfJoining), // Ensure proper date format
                role,
            },
        });

        res.status(200).json({ message: 'Employee added successfully', data: newEmployee });
    } catch (error) {
        if (error.code === 'P2002') {
            // Unique constraint violation (similar to MySQL's 'ER_DUP_ENTRY')
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log('Server running on port 5000');
});
