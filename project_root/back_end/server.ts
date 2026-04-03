import connectDB from '../front_end/config/mongooseConfig.js'

const Server = async () => {

    await connectDB();

} 

Server()