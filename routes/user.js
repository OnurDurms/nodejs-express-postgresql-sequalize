const { userController } = require("../controllers");
const { check, validationResult } = require("express-validator");

module.exports = (router, auth) => {
    router.post("/user/register",  [
        check("name")
          .isLength({ min: 3 })
          .withMessage("the name must have minimum length of 3")
          .trim(),
    
        check("email")
          .isEmail()
          .withMessage("invalid email address")
          .normalizeEmail(),
    
        check("password")
          .isLength({ min: 8, max: 15 })
          .withMessage("your password should have min and max length between 8-15")
          .matches(/\d/)
          .withMessage("your password should have at least one number")
          .matches(/[!@#$%^&*(),.?":{}|<>]/)
          .withMessage("your password should have at least one sepcial character"),
      ],async (req, res) => {
        const error = validationResult(req).formatWith(({ msg }) => msg);

        const hasError = !error.isEmpty();

        if (hasError) {
            res.status(422).json({ error: error.array() });
        } else {
            const { name, email, password } = req.body;
            const user = await userController.registerUser(name, email, password);
            return res.status(user.status).json(user);
        }
    });

    router.post("/user/login", [
    check("email")
        .isEmail()
        .withMessage("invalid email address")
        .normalizeEmail(),

    check("password")
        .isLength({ min: 8, max: 15 })
        .withMessage("your password should have min and max length between 8-15")
        .matches(/\d/)
        .withMessage("your password should have at least one number"),
    ],async (req, res) => {
        const error = validationResult(req).formatWith(({ msg }) => msg);

        const hasError = !error.isEmpty();

        if (hasError) {
            res.status(422).json({ error: error.array() });
        } else {
            const { email, password } = req.body;
            const user = await userController.loginUser(email, password);
            return res.status(user.status).json(user);
        }
    });

    router.get("/users/:id", auth,[
        check("id")
          .isInt({ min: 1})
          .withMessage("the id must have minimum 1")
          .trim()], async (req, res) => {
            const error = validationResult(req).formatWith(({ msg }) => msg);

            const hasError = !error.isEmpty();

            if (hasError) {
                res.status(422).json({ error: error.array() });
            } else {
                const { id } = req.params;
                let user = await userController.getUserWithId(id);
                return res.status(user.status).json(user);
            }
    });

    router.get("/user", auth, async (req, res) => {
        let allUsers = await userController.getAllUsers();
        return res.status(allUsers.status).json(allUsers);
    });

    router.post("/users", auth, async (req, res) => {
        let insertedUser = await userController.saveUser(req.body);
        return res.status(insertedUser.status).json(insertedUser);
    });

    router.put("/users/:id", auth,[
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
                let user = await userController.updateUser(id, req.body);
                return res.status(user.status).json(user);
            }
    });

    router.delete("/users/:id", auth,[
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
                const deletedUser = await userController.deleteUserWithId(id);
                return res.status(deletedUser.status).json(deletedUser);
            }
    });

    return router;
}