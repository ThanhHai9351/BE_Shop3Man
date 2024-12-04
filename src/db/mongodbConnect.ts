import mongoose from "mongoose";

const mongodbConnect = async () => {
	try {
		await mongoose.connect(`${process.env.MONGO_DB}`);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB");
	}
};

export default mongodbConnect;
