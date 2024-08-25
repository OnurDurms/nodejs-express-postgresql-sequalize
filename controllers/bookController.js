const { Book } = require("../models/books");
const { User } = require("../models/users");

const getBookWithId = async (id) => {
    try{
        const book = await Book.findOne({ where: { id: id , status: 1},attributes: ['id', 'name','score']});
        return {result: "success",status: 200,book: book};
    }catch(e){
        return {result: "error occurred",status: 500,error_message: e};
    }
}

const getAllBooks = async () => {
    try{
        const books = await Book.findAll({ where: {status: 1 },attributes: ['id', 'name']});
        return {result: "success",status: 200,books: books};
    }catch(e){
        return {result: "error occurred",status: 500,error_message: e};
    }
}

const saveBook = async (body) => {
    try{
        const newBook = new Book({ name: body.name, status: 1},{raw: true});
        await newBook.save();
        return {result: "success",status: 200};
    }catch(e){
        return {result: "book could not be saved",status: 500,error_message: e};
    }
}

const updateBook = async (id, body) => {
    try{
        await Book.update( { name: body.name,updated_at: Date.now()},{ where: {id: id }});
        return {result: "success",status: 200};
    }catch(e){
        return {result: "book could not be updated",status: 500,error_message: e};
    }
}

const deleteBookWithId = async (body) => {
    try{
        await Book.update({ status: 2 },{ where: {id: body.id } });
        return {result: "success",status: 200};
    }catch(e){
        return {result: "book could not be deleted",status: 500,error_message: e};
    }
}

const borrowBook = async (bookId, userId) => {
    try{
        const user = await User.findOne({ where: {id: parseInt(userId),status: 1}});
        const book = await Book.findOne({ where: {id: parseInt(bookId),status: 1}});
        if(book.borrower_user_id == 0){
            const presents = user.books["present"];
            const pasts = user.books["past"];
            presents.push({name: book.name});
            await User.update({ books: {"past": pasts, "present": presents},updated_at: Date.now()}, { where: {id: userId }});
            await Book.update({ borrower_user_id: userId,updated_at: Date.now()}, { where: {id: bookId }});
            return {result: "success",status: 200};
        }else{
            return {result: "already taken book",status: 500};
        }
    }catch(e){
        return {result: "failed",status: 500,error_message: e};
    }
}

const returnBook = async (bookId,userId,body) => {
    try{
        const user = await User.findOne({ where: { id: parseInt(userId), status: 1}});
        const book = await Book.findOne({ where: { id: parseInt(bookId), status: 1}});
        if(book.borrower_user_id == userId){
            const presents = user.books.present;
            const pasts = user.books.past;
            const newPresents = [];
            for(let item of presents){
                if(item.name !== book.name){
                    newPresents.push(item);
                }
            }
            pasts.push({name: book.name,userScore: body.score});
            await User.update({ books: {"past": pasts, "present": newPresents},updated_at: Date.now()}, { where: {id: userId }});
            const newScore = ((book.score * book.score_count) + body.score) / (book.score_count + 1);
            const scores = book.user_scores;
            scores.push({userId: userId,score: body.score});
            const scoreCount = scores.length;
            await Book.update({ score: newScore, score_count: scoreCount,user_scores: scores,borrower_user_id: 0, updated_at: Date.now()},{ where: {id: bookId }});
            return {result: "success",status: 200};
        }else{
            return {result: "doesn't match user_id",status: 500};
        }
    }catch(e){
        return {result: "failed",status: 500,error_message: e};
    }
}

module.exports = {
    getBookWithId,
    getAllBooks,
    saveBook,
    updateBook,
    deleteBookWithId,
    borrowBook,
    returnBook
}