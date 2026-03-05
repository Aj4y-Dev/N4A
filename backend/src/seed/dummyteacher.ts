import bcrypt from "bcrypt";

async function main() {
  const password = "password123"; // plain password

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);
}

main();
