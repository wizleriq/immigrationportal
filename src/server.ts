import app from "./app";
import {AppDataSource} from "./data-source";
import dotenv from "dotenv";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("💥 DB connection failed:", err);
    process.exit(1);
  });

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Connected to DB");
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`Server is running on port ${process.env.PORT || 3000}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to DB", error);
//   });

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   app.listen(3000,() =>{
//     console.log("Server is running on port 3000");
//   })