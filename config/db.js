const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Connected to MongoDB at ${mongoose.connection.host}`.bgCyan.white);

        // Drop the conflicting index after connection
        try {
            const db = mongoose.connection.db;
            const collection = db.collection('users');

            // Check if the problematic index exists and drop it
            const indexes = await collection.listIndexes().toArray();
            const hasPhoneNumberIndex = indexes.some(idx => idx.name === 'phone_number_1');

            if (hasPhoneNumberIndex) {
                await collection.dropIndex('phone_number_1');
                console.log('Dropped conflicting phone_number_1 index'.bgYellow.black);
            }

        } catch (indexError) {
            if (indexError.codeName !== 'IndexNotFound') {
                console.log(`Index management warning: ${indexError.message}`.bgYellow.black);
            }
        }

    } catch (err) {
        console.log(`MongoDB connection error: ${err.message}`.bgRed.white);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;