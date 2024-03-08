import { parse } from "csv-parse";
import fs from "node:fs";

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// creating a readable stream
const planetsStream = fs.createReadStream("kepler_data.csv").pipe(
  parse({
    comment: "#",
    columns: true, // Parse headers as column names
  })
);

planetsStream
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (error) => {
    console.log(error);
  });

planetsStream.on("end", () => {
  console.log(
    habitablePlanets.map((planet) => {
      return planet["kepler_name"];
    })
  );
  console.log(`${habitablePlanets.length} habitable planets found!`);
});