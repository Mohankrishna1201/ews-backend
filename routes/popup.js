const express = require('express');

const app = express();
app.use(express.json())
const PORT = 3000;


app.get('/hi', (req, res) => {
    res.json({
        name: ` mohan`,
        rollno: 37
    })
})

app.post('/post', (req, res) => {
    const { date, name, join } = req.body;

    res.json({
        d: date,
        n: name,
        j: join
    })
})
app.listen(PORT, console.log(`app is listening on ${PORT}`))