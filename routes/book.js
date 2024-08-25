const { bookController } = require("../controllers");
const { check, validationResult } = require("express-validator");

module.exports = (router, auth) => {
    router.get("/books/:id", [
        check("id")
          .isInt({ min: 1 })
          .withMessage("the id must have minimum 1")
          .trim()],async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { id } = req.params;
                let book = await bookController.getBookWithId(id);
                return res.status(book.status).json(book);
            }
    });

    router.get("/books", auth, async (req, res) => {
        let allBooks = await bookController.getAllBooks();
        return res.status(allBooks.status).json(allBooks);
    });

    router.post("/books", auth, async (req, res) => {
        let insertedBook = await bookController.saveBook(req.body);
        return res.status(insertedBook.status).json(insertedBook);
    });

    router.put("/books/:id", auth, [
        check("id")
          .isInt({ min: 1 })
          .withMessage("the id must have minimum 1")
          .trim()],async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { id } = req.params;
                let book = await bookController.updateBook(id, req.body);
                return res.status(book.status).json(book);
            }
    });

    router.delete("/books/:id", auth,[
        check("id")
          .isInt({ min: 1 })
          .withMessage("the id must have minimum 1")
          .trim()], async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { id } = req.params;
                req.body.id = id;
                const deletedBook = await bookController.deleteBookWithId(req.body);
                return res.status(deletedBook.status).json(deletedBook);
            }
    });

    router.post("/users/:userId/borrow/:bookId", auth, [
        check("userId")
          .isInt({ min: 1 })
          .withMessage("the userId must have minimum 1")
          .trim()],async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { userId, bookId } = req.params;
                let book = await bookController.borrowBook(bookId, userId);
                return res.status(book.status).json(book);
            }
    });

    router.post("/users/:userId/return/:bookId", auth, [
        check("userId")
          .isInt({ min: 1 })
          .withMessage("the userId must have minimum 1")
          .trim()],async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { userId, bookId } = req.params;
                let book = await bookController.returnBook(bookId,userId,req.body);
                return res.status(book.status).json(book);
            }
    });
    return router;
}