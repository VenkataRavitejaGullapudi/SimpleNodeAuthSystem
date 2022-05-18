const app = require("./app");

const API_PORT = process.env.PORT || 4000
app.listen(API_PORT, () => {
    console.log(`Server is Running at ${API_PORT}`)
})
