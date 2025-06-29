if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// MongoDB connection with fallback for development
const DB_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    })

async function main() {
    await mongoose.connect(DB_URL);
}

const initDB = async () => {
    // Clear existing data
    await Listing.deleteMany({});
    await User.deleteMany({});
    
    // Create a test user
    const testUser = new User({
        email: "test@example.com",
        username: "testuser"
    });
    
    // Register the user with a password
    const registeredUser = await User.register(testUser, "testpass123");
    console.log("Test user created:", registeredUser._id);
    
    // Add the user ID to all listings
    initdata.data = initdata.data.map((obj) => ({...obj, owner: registeredUser._id}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

initDB();