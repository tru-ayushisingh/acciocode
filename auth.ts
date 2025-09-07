import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./modules/auth/actions";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks:{
    async signIn({user, account}){
        if (!user || !account) return false;

        const existingUser = await db.user.findUnique({
          where:{email: user.email!},
        });

        if (!existingUser) {
            const newUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image!,

              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refreshToken: account.refreshToken,
                  accessToken: account.accessToken,
                  expiresAt: account.expiresAt,
                  tokenType: account.tokenType,
                  scope: account.scope,
                  idToken: account.idToken,
                  sessionState: account.sessionState,
                }
              },
            },
          });

          if (!newUser) return false;
      } else {
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              }
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refreshToken: account.refreshToken,
                accessToken: account.accessToken,
                expiresAt: account.expiresAt,
                tokenType: account.tokenType,
                scope: account.scope,
                idToken: account.idToken,
                sessionState: account.sessionState,
              },
            });
          }
      }
      return true;
  },

  async jwt({token}){
    if(!token.sub) return token;

    const existingUser = await getUserById(token.sub);
    if(!existingUser) return token;
    
    token.name = existingUser.name;
    token.email = existingUser.email;
    token.role = existingUser.role;

  return token
  },

  async session({session , token}){
    if(token.sub && session.user){
      session.user.id = token.sub
    }

    if(token.sub && session.user){
      
      session.user.role = token.role
    }
     return session;
  }
  },
  secret:process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  ...authConfig
});