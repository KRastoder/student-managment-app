import express from "express"

const app = express()
const PORT = 3000

app.use(express.json())

app.get("/",(req,res)=>{
    return res.send("Hello world")
})

app.listen(PORT,()=>{
    console.log(`Server running on PORT:${PORT}`)
})
