import { z } from "zod";
 
const envVariables = z.object({
  BOT_TOKEN: z.string().min(1),
});

export const env = envVariables.parse(process.env);
 
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}