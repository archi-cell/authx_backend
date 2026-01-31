import bcrypt from "bcryptjs";
import prisma from "../src/config/db.js"; // MUST include .js

async function createAdmin() {
    const email = "archidadwal@gmail.com";
    const password = "archi";

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
        },
    });

    console.log("✅ Admin user created");
}

createAdmin()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
