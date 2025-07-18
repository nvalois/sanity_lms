// app/create-sanity-user/route.ts

import sanityClient from "@/lib/sanityClient";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, firstName, lastName, emailAddresses } = user;

  await sanityClient.createIfNotExists({
    _type: "user",
    isTeacher: false,
    _id: id,
    firstName,
    lastName,
    email: emailAddresses[0].emailAddress
  })

  return new NextResponse("User created", { status: 200 });
};