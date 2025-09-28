import express from "express";
import dotenv from "dotenv";
 
dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Server is doing something");
});
app.get("/api/restaurants", (req, res) => {
  const restaurants = [
    {
      id: 1,
      name: "Spice Villa",
      cuisine: "Indian",
      location: "Connaught Place, New Delhi",
      rating: 4.5,
      isOpen: true,
    },
    {
      id: 2,
      name: "Pasta Palace",
      cuisine: "Italian",
      location: "Koramangala, Bangalore",
      rating: 4.2,
      isOpen: false,
    },
    {
      id: 3,
      name: "Sushi World",
      cuisine: "Japanese",
      location: "Bandra, Mumbai",
      rating: 4.8,
      isOpen: true,
    },
    {
      id: 4,
      name: "Burger Hub",
      cuisine: "American",
      location: "Hi-Tech City, Hyderabad",
      rating: 4.0,
      isOpen: true,
    },
    {
      id: 5,
      name: "Green Bowl",
      cuisine: "Vegan",
      location: "Park Street, Kolkata",
      rating: 4.3,
      isOpen: false,
    },
  ];

  res.send(restaurants);
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
