import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import instance from "@/app/AxiosApi/AxiosInstence";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await instance.post("/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.success && response.data.user) {
            return {
              id: response.data.user._id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log(account);
      
      // Only handle Google sign-ins
      if (account.provider === "google") {
        try {
          const checkResponse = await instance.get(`/userInfo`);
          const existingUser = checkResponse.data.find(
            (u) => u.email === user.email
          );

          if (!existingUser) {
            // Save new Google user to MongoDB
            const newUser = {
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              role: "user",
            };

            await instance.post("/userInfo", newUser);
            console.log("New Google user saved to MongoDB:", user.email);
          } else {
            console.log("Google user already exists:", user.email);
          }

          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return true;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "user";
        token.id = user.id;
      }

      if (account?.provider === "google" && token.email) {
        try {
          const response = await instance.get("/userInfo");
          const dbUser = response.data.find((u) => u.email === token.email);

          if (dbUser) {
            token.id = dbUser._id;
            token.role = dbUser.role || "user";
          }
        } catch (error) {
          console.error("Error fetching Google user data:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
