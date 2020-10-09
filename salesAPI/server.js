/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Xiao Xiao Student ID: 101115190 Date: Sept 25/2020
* Heroku Link: https://web422-a1-xiao.herokuapp.com/
*
********************************************************************************/ 



const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");


const myData = dataService("mongodb+srv://xxiao22:XMM4ever!@cluster0.njebx.mongodb.net/sample_supplies?retryWrites=true&w=majority");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes


// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req,res)=>{
    myData.addNewSale(req.body)
    .then((rval)=>{
        res.status(201).json({message: rval}); 
    })
    .catch((error)=>{
        res.status(404).json({message: `Request failed due to ${error}`});
    })
});


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )

app.get("/api/sales", (req,res)=>{
    myData.getAllSales(req.query.page, req.query.perPage)
    .then((rval)=>{
        res.status(201).json(rval);
    })
    .catch((error)=>{
        res.status(404).json({"message": `Page can't be accessed due to ${error}`});
    })
})

// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)

app.get("/api/sales/:id",(req,res)=>{

    myData.getSaleById(req.params.id)
    .then((rval)=>{
        
        res.status(201).json(rval);//: res.status(404).json({"message": `Item not found due to: ${rval}`});
    })
    .catch((err)=>{
        res.status(404).json({"message": `Item not found due to: ${err}`});
    })
})

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)

app.put("/api/sales/:id", (req,res)=>{
    myData.getSaleById(req.params.id)
    .then((found)=>{
        myData.updateSaleById(req.body, req.params.id)
        .then((rval)=>{
            res.status(201).json({message: `Updated: ${rval}`});
        })
        .catch((err)=>{
            res.status(404).json({message: `Failure: ${err}`});
        })

    })
    .catch((error)=>{
        res.status(404).json({message: `Item not found due to: ${error}`});
    })

})

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req,res)=>{
    myData.getSaleById(req.params.id)
    .then((found)=>{
        myData.deleteSaleById(req.params.id)
        .then((rval)=>{
            res.status(201).json({message: `No Content: ${rval}`});
        })
        .catch((err)=>{
            res.status(404).json({message: `Failed to delete: ${err}`});
        })
    })
    .catch((error)=>{
        console.log("Item cannot deleted");
        res.status(404).json({message: `Item not found due to: ${error}`});
    })
})

// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

