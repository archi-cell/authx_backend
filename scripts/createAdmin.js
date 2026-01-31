import bcrypt from "bcrypt";
import prisma from "../src/config/db.js"; // MUST include .js

async function createAdmin() {
    const email = "archi@gmail.com";
    const password = "mine";

    const existingAdmin = await prisma.user.findUnique({
        where: { email },
    });

    if (existingAdmin) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "ADMIN",
            isActive: true,
        },
    });

    console.log("✅ Admin user created");
}

createAdmin()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
