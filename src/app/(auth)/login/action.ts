"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/Validation";
import { verify } from "@node-rs/argon2";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

export async function login(
  credentials: LoginValues,
): Promise<{ error: String }> {
  try {
    const { password, username } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser || !existingUser.passwordHash)
      return { error: "username or password is Wrong" };
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) return { error: "username or password is Wrong" };

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Some thing went wrtong Please try again",
    };
  }
}
