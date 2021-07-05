require('dotenv').config();
//Imorting
const express = require("express");
const mongoose = require("mongoose");
//Database
const database = require("./database/index");

const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
//Initialize express
const advent =express();
//Configure
advent.use(express.json());

//Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>console.log("connection is done"));

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          get
*/


advent.get("/" , async (req,res) => {
    const sepBook= await BookModel.find();
return res.json({"books":sepBook});
});


/*
Route           /is/
Description     get the books on isbn
Access          PUBLIC
Parameters      isbn
Method          get
*/

advent.get("/is/:isbn",async (req,res)=>{
    const distinctbook = await BookModel.findOne({ISBN:req.params.isbn});
        if(!distinctbook){
            return res.json({"error":"no book found deepak"});
        }
        return res.json({"books":distinctbook});
});

/*
Route           /c/
Description     get the books on category
Access          PUBLIC
Parameters      category
Method          get
*/

advent.get("/c/:category",async(req,res)=>{
    const distinctbook = await BookModel.find({category:req.params.category});
        if(!distinctbook){
            return res.json({"error":"no book found"});
        }
        return res.json({"books":distinctbook});
});

/*
Route           /a/
Description     get the books on authors
Access          PUBLIC
Parameters      author
Method          get
*/

advent.get("/a/:author",async (req,res)=>{
    
   
    const distinctbook =await BookModel.find({authors:parseInt(req.params.author)})
               
        if(!distinctbook){
            return res.json({"error":"no book found"});      
        }
        return res.json({books:distinctbook});
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      none
Method          get
*/

advent.get("/author",async (req,res)=>{
    const allauthors=await AuthorModel.find();
    return res.json({"authors":allauthors})
});


/*
Route           /author/get
Description     get specific authors
Access          PUBLIC
Parameters      :id
Method          get
*/

advent.get("/author/get/:id", async (req,res)=>{
    const specificBook = await AuthorModel.findOne({id:parseInt(req.params.id)})
    
    if(!specificBook){
        return res.json({"error":"no author found"})
    }
    return res.json({"author":specificBook});

});
/*
Route           /author/
Description     get specific authors based on isbn
Access          PUBLIC
Parameters      isbn
Method          get
*/
advent.get("/author/:isbn",async (req,res)=>{
    const specificBook= await AuthorModel.find({books:req.params.isbn})
    if(!specificBook){
        return res.json({"error":"no author found here"})
    }
    return res.json({"author":specificBook});

});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      none
Method          get
*/

advent.get("/publications", async (req,res)=>{
    const allpublications= await PublicationModel.find();
    return res.json({"publication" : allpublications})
});

/*
Route           /publications
Description     get specific publications
Access          PUBLIC
Parameters      id
Method          get
*/

advent.get("/publications/get/:id", async (req,res)=>{
    const pub= await PublicationModel.findOne({id: parseInt(req.params.id)}
    )
    if(!pub){
        return res.json({"error":"no publication"})
    }
    return res.json({"publication":pub})
});

/*
Route           /publications
Description     get  publications on specific books
Access          PUBLIC
Parameters      isbn
Method          get
*/

advent.get("/publications/:isbn",async (req,res)=>{
    const pub=await PublicationModel.find({books:req.params.isbn})
    if(!pub){
            return res.json({"error":"no publications"})
        }
        return res.json({"publications":pub})
});

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      none
Method          post
*/

advent.post("/book/new", async (req,res)=>{
    const {newBook} =req.body;
     await BookModel.create(newBook);
    return res.json({message:"new book added"})
})
/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      none
Method          post
*/
advent.post("/author/new",async (req,res)=>{
    const {newAuthor} =req.body;
    await AuthorModel.create(newAuthor) ;
    return res.json({message:"new author added"})

})

/*
Route           /publication/new
Description     add new publications
Access          PUBLIC
Parameters      none
Method          post
*/

advent.post("/publication/new", async (req,res)=>{
    const {newPublication}=req.body;
   await PublicationModel.create(newPublication);
    return res.json({message:"new pub added"})
})

/*
Route           /book/update
Description     update book details
Access          PUBLIC
Parameters      isbn
Method          put
*/

advent.put("/book/update/:isbn", async(req,res)=>{
    const updatedBook= await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn        },
        {
           title:req.body.bookTitle
        },
        {
            new : true 
        }
    );
    return res.json({book:updatedBook,message:"title Updated"})
    })

 /*
Route           /book/update/author
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          put
*/   

advent.put("/book/update/author/:isbn", async(req,res)=>{
    const updatedBook= await BookModel.findOneAndUpdate({ISBN:req.params.isbn},
        {$addToSet:{
            authors:req.body.newAuthor
        },
            
    },
    {
        new : true
    });
    const updatedAuthor=await AuthorModel.findOneAndUpdate({
        id:req.body.newAuthor
    },{
        $addToSet:{
            books:req.params.isbn
        },
    },{
        new:true
    })
    
 
    return res.json({books:updatedBook,authors:updatedAuthor,message:"author updated"})
    
});


 /*
Route           /author/update/
Description     update Author name using id
Access          PUBLIC
Parameters      id
Method          put
*/  

advent.put("/author/update/:id",async (req,res)=>{
        const updatedAuthor=await AuthorModel.findOneAndUpdate({
            id:parseInt(req.params.id)
        },{
            name:req.body.newName
        },{
            new:true
        })
   
    return res.json({author:updatedAuthor,message:"name is updated"})
})

 /*
Route           /publication/update/
Description     update publication name using id
Access          PUBLIC
Parameters      id
Method          put
*/  

advent.put("/publication/update/:id",async (req,res)=>{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id:parseInt(req.params.id)
        },{
            name:req.body.newPublication
        },{
            new:true
        })

    return res.json({pub:updatedPublication,message:'Name in pub updated'})
})

 /*
Route           /publication/update/book/
Description     update/add new book to a publication 
Access          PUBLIC
Parameters      id
Method          put
*/

advent.put("/publication/update/book/:id", async(req,res)=>{
    const updatedPublication= await PublicationModel.findOneAndUpdate({
        id:parseInt(req.params.id)
    },{
        $addToSet:{
            books:req.body.newBook
        },
    },{
        new:true
    })
   

    const updatedBook= await BookModel.findOneAndUpdate({
        ISBN : req.body.newBook
    },{
        publication:req.params.id
    },{
        new:true
    })
   
    return res.json({pub:updatedPublication,books:updatedBook,message:"updated"})
})

 /*
Route           /delete/book/
Description     delete new book
Access          PUBLIC
Parameters      isbn
Method          delete
*/

advent.delete("/delete/book/:isbn",async (req,res)=>{
    const specificBook= await BookModel.findOneAndDelete({ISBN:req.params.isbn})
    
    return res.json({book:specificBook,message:"deleted"})
})

 /*
Route           /delete/book/
Description     delete a author from book
Access          PUBLIC
Parameters      isbn,id
Method          delete
*/

advent.delete("/delete/book/:isbn/:id",async (req,res)=>{
    const updatedBook= await BookModel.findOneAndUpdate(
        {ISBN:req.params.isbn
        },{
            $pull:{authors:parseInt(req.params.id)}
        },{
            new :true
        })
   
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id:parseInt(req.params.id)
    },{
        $pull :{
        books :req.params.isbn}
    },{
        new :true
    })
       
    return res.json({book:updatedBook,author:updatedAuthor,message:"deleted"})
})
  
 /*
Route           /delete/author/
Description     delete author
Access          PUBLIC
Parameters      id
Method          delete
*/

advent.delete("/delete/author/:id",async(req,res)=>{
    const updatedAuthor= await AuthorModel.findOneAndDelete({
        id:parseInt(req.params.id)
    })
    
return res.json({authors:updatedAuthor,message:"deleted"})
})

 /*
Route           /delete/publication/
Description     delete a publication 
Access          PUBLIC
Parameters      id
Method          delete
*/

advent.delete("/delete/publication/:id",async (req,res)=>{
    const updatedPublication= await PublicationModel.findOneAndDelete({
        id:parseInt(req.params.id)
    })
   
    return res.json({pub:updatedPublication,message:"pub is deleted"})
})

 /*
Route           /delete/publication/
Description     delete book from a publication 
Access          PUBLIC
Parameters      isbn,id
Method          delete
*/

advent.delete("/delete/publication/:isbn/:id", async(req,res)=>{
    const updatedPublication= await PublicationModel.findOneAndUpdate({
        id:parseInt(req.params.id)
    },{
        books:req.params.isbn
    },{
        new : true
    })
    const updatedBook= await BookModel.findOneAndUpdate({
        ISBN:req.params.isbn
    },{
        publication:0
    },{
        new:true
    })
  
    return res.json({book:updatedBook,pub:updatedPublication,message:"book is deleted"})
})

advent.listen(3200,()=>console.log("server is fine"));