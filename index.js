import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/", async (req, res) => {
    const word = req.body.submittedWord;
    try {
        const result = await axios.get(`https://v2.jokeapi.dev/joke/Any?contains=${word}`);
        console.log(result.data);
        if (result.data.error) {
            res.render("index.ejs", { content: JSON.stringify(result.data.message) });
        } else { 
            if (result.data.type === "twopart") {
                res.render("index.ejs", {
                    content: result.data.setup + " " + result.data.delivery
                });
            } else {
                res.render("index.ejs", {
                    content: result.data.joke
                });
            }
        }
    } catch (error) {
        console.log(error.message)
        res.render("index.ejs", { content: JSON.stringify(error.message) });
    }
})

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})

