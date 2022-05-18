const mongoose = require("mongoose")

exports.connect = () => {
    console.log("Trying to connect Database...")
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(conn => console.log("DB Connected Successfully.."))
        .catch(error => {
            console.log("DB not connected..")
            console.log(error)
            process.exit(1)
        })
}