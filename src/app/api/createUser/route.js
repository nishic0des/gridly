import prisma from "../../../../lib/prisma";

export async function POST(request) {
  const { name, email } = await request.json();
  if (!name || !email) {
    return new Response(
      JSON.stringify({ error: "Name and Email are required" }),
      { status: 400 }
    );
  }
  try {
    const newUser = await prisma.User.create({
      data: {
        name,
        email,
      },
    });
    return new Response(JSON.stringify("User created successfully"), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}
