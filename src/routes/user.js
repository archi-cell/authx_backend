router.get(
    "/profile",
    authenticate,
    authorizeRoles("USER", "ADMIN"),
    (req, res) => {
        res.json({ message: "User profile access" });
    }
);
