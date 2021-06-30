require('dotenv').config();
//Imorting
const express = require("express");
const mongoose = require("mongoose");
//Database
const database = require("./database/index");
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


advent.get("/" , (req,res) => {
return res.json({"books" : database.books});
});


/*
Route           /is/
Description     get the books on isbn
Access          PUBLIC
Parameters      isbn
Method          get
*/

advent.get("/is/:isbn",(req,res)=>{
    const distinctbook = database.books.filter(
        (book)=> book.ISBN===req.params.isbn);
        if(distinctbook.length===0){
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

advent.get("/c/:category",(req,res)=>{
    const distinctbook = database.books.filter(
        (book)=> book.category.includes(req.params.category));
        if(distinctbook.length===0){
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

advent.get("/a/:author",(req,res)=>{
    
   
    const distinctbook = database.books.filter(
         (book)=> book.authors.includes(Number(req.params.author)))
               
        if(distinctbook.length===0){
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

advent.get("/author",(req,res)=>{
    return res.json({"authors":database.authors})
});


/*
Route           /author/get
Description     get specific authors
Access          PUBLIC
Parameters      :id
Method          get
*/

advent.get("/author/get/:id",(req,res)=>{
    const specificBook = database.authors.filter(
        (author)=>author.id == Number(req.params.id)
        
    )
    if(specificBook.length===0){
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
advent.get("/author/:isbn",(req,res)=>{
    const specificBook= database.authors.filter(
        (author)=>author.books== req.params.isbn);
    if(specificBook.length===0){
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

advent.get("/publications",(req,res)=>{
    return res.json({"publication" : database.publications})
});

/*
Route           /publications
Description     get specific publications
Access          PUBLIC
Parameters      id
Method          get
*/

advent.get("/publications/get/:id",(req,res)=>{
    const pub=database.publications.filter(
        (publication)=>publication.id===parseInt(req.params.id)
    )
    if(pub.length===0){
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

advent.get("/publications/:isbn",(req,res)=>{
    const pub=database.publications.filter(
        (publication)=>publication.books==req.params.isbn)
        if(pub.length===0){
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

advent.post("/book/new",(req,res)=>{
    const {newBook} =req.body;
    database.books.push(newBook);
    return res.json({books:database.books,message:"new book added"})
})
/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      none
Method          post
*/
advent.post("/author/new",(req,res)=>{
    const {newAuthor} =req.body;
    database.authors.push(newAuthor);
    return res.json({authors:database.authors,message:"new author added"})

})

/*
Route           /publication/new
Description     add new publications
Access          PUBLIC
Parameters      none
Method          post
*/

advent.post("/publication/new",(req,res)=>{
    const {newPublication}=req.body;
    database.publications.push(newPublication)
    return res.json({pub:database.publications,message:"new pub added"})
})

/*
Route           /book/update
Description     update book details
Access          PUBLIC
Parameters      isbn
Method          put
*/

advent.put("/book/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.title=req.body.newTitleupdate;
            return;
        }
    }
    )
    return res.json({book:database.books,message:"title Updated"})
    })

 /*
Route           /book/update/author
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          put
*/   

advent.put("/book/update/author/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
           return book.authors.push(req.body.newAuthor)
         }
    });
    database.authors.forEach((author)=>{
        if(author.id===req.body.newAuthor){
            return author.books.push(req.params.isbn)
        }
    });
    return res.json({books:database.books,authors:database.authors,message:"author updated"})
    
});


 /*
Route           /author/update/
Description     update Author name using id
Access          PUBLIC
Parameters      id
Method          put
*/  

advent.put("/author/update/:id",(req,res)=>{
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.id)){
            author.name=req.body.newName
            return;
        }
    })
    return res.json({author:database.authors,message:"name is updated"})
})

 /*
Route           /publication/update/
Description     update publication name using id
Access          PUBLIC
Parameters      id
Method          put
*/  

advent.put("/publication/update/:id",(req,res)=>{
    database.publications.forEach((publication)=> {
        if(publication.id===parseInt(req.params.id)){
              publication.name=req.body.newPublication
              return;
        }
    })
    return res.json({pub:database.publications,message:'Name in pub updated'})
})

 /*
Route           /publication/update/book/
Description     update/add new book to a publication 
Access          PUBLIC
Parameters      id
Method          put
*/

advent.put("/publication/update/book/:id",(req,res)=>{
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            return publication.books.push(req.body.newBook)
        }

    })
    database.books.forEach((book)=>{
        if(book.ISBN===req.body.newBook){
             book.publication=req.params.id
             return;
        }
    })
    return res.json({pub:database.publications,books:database.books,message:"updated"})
})

 /*
Route           /delete/book/
Description     delete new book
Access          PUBLIC
Parameters      isbn
Method          delete
*/

advent.delete("/delete/book/:isbn",(req,res)=>{
const specificBook=database.books.filter(
    (book)=>book.ISBN!==req.params.isbn)
    database.books=specificBook
    return res.json({book:database.books,message:"deleted"})
})

 /*
Route           /delete/book/
Description     delete a author from book
Access          PUBLIC
Parameters      isbn,id
Method          delete
*/

advent.delete("/delete/book/:isbn/:id",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newAuthor=book.authors.filter(
                (author)=>author!==parseInt(req.params.id)
            );
            book.authors=newAuthor;
            return;
        }
    })
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.id)){
            const newBook=author.books.filter((book)=>book!==req.params.isbn)
            author.books=newBook
            return;
        }
    })
    return res.json({book:database.books,author:database.authors,message:"deleted"})
})
  
 /*
Route           /delete/author/
Description     delete author
Access          PUBLIC
Parameters      id
Method          delete
*/

advent.delete("/delete/author/:id",(req,res)=>{
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.id)){
            const authorsList=database.authors.filter(
                (author)=>author.id!==parseInt(req.params.id)
            )
            database.authors=authorsList
            return;
        }
    })
return res.json({authors:database.authors,message:"deleted"})
})

 /*
Route           /delete/publication/
Description     delete a publication 
Access          PUBLIC
Parameters      id
Method          delete
*/

advent.delete("/delete/publication/:id",(req,res)=>{
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            const newPublication=database.publications.filter(
                (publication)=>publication.id!== parseInt(req.params.id))
                database.publications=newPublication;
                return;
        }
    })
    return res.json({pub:database.publications,message:"pub is deleted"})
})

 /*
Route           /delete/publication/
Description     delete book from a publication 
Access          PUBLIC
Parameters      isbn,id
Method          delete
*/

advent.delete("/delete/publication/:isbn/:id",(req,res)=>{
    database.publications.forEach((publication)=>{
        if(publication.id===parseInt(req.params.id)){
            const newpub=publication.books.filter(
                (book)=>book!==req.params.isbn)
                publication.books=newpub;
                return;
        }
    })
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=0
            return;
        }
    })
    return res.json({book:database.books,pub:database.publications,message:"book is deleted"})
})

advent.listen(3200,()=>console.log("server is fine"));