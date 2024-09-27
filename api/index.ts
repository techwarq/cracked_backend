import express from "express";

import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import dashboardRoutes from './routes/dashboardRoutes'; 
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

app.use('/api', dashboardRoutes);

app.get("/", (req, res) => res.send("Express on Vercel"));

testDatabaseConnection().then(()=>{
    app.listen(3003, () => console.log("Server ready on port 3000."));
})

module.exports = app;