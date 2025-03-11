import { serve } from "@hono/node-server";
import { Hono } from "hono";
const reminders: string[]=[];

const app = new Hono();
let storedNumbers=[];
app.get("/health", (context) => {
  const req=context.req;
    return context.json({message:"Hello World"},200);
  });

app.get("/reminders", (context) => {
     return context.json(reminders,200);
    });

app.post("/reminders" ,async (context)=>{
  const body = await context.req.json();
  const reminder= body.reminder;
  reminders.push(reminder);

  return context.json(reminders,201);
});
app.get("/generate", (context) => {
  const randomNumber = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
  return context.json({ randomNumber }, 200);
});
app.get("/current-time", (context) => {
  const currentTime = new Date().toLocaleString(); // Get system's current time
  return context.json({ currentTime }, 200);
});
app.get("/environment", (context) => {
  return context.json({
    nodeVersion: process.version,
    platform: process.platform,
  }, 200);
});
app.get("/puppet", (context) => {
  const queryParams = context.req.query();
  return context.json(queryParams, 200);
});
const numbers: number[] = [];

app.post("/store-numbers", async (context) => {
  const body = await context.req.json();

  if (typeof body.store === "number") {
    numbers.push(body.store);
  } else if (Array.isArray(body.numbers)) {
    numbers.push(...body.numbers);
  } else {
    return context.json({ error: "Please send a number or an array of numbers" }, 400);
  }

  return context.json({ message: "Numbers stored successfully", numbers }, 201);
});

app.get("/store-numbers", (context) => {
  return context.json({ storedNumbers: numbers }, 200);
});
let lastNumber = null; 

  app.post("/store", async (c) => {
    const { number } = await c.req.json(); 
    if (typeof number !== "number") return c.json({ error: "Invalid input" }, 400);
    
    lastNumber = number; 
    storedNumbers.push(lastNumber);
    return c.json({  number: lastNumber }, 201);
    
  });

  
  app.get("/store", (c) => {
    return c.json({ stored_numbers: storedNumbers }, 200);
  });
serve(app);
console.log("Server is running on http://localhost:3000");