import {
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { limit } from "@grammyjs/ratelimiter";
import { Bot, session, GrammyError, HttpError } from "grammy";
import { logger } from "@/lib/logger";
import { onStartMenu } from "@/handlers/onstart";
import { findRouteConversation } from "@/handlers/find_route";
import { signupConversation } from "@/handlers/signup";
import { type BotContext } from "@/types";
import 'dotenv/config'; 

export const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

// Session
bot.use(
    session({
        initial() {
            // return empty object for now
            return {};
        },
    })
);

// Rate Limiter - Allow only 3 messages to be handled every 2 seconds.
bot.use(
    limit({
        timeFrame: 2000,
        limit: 3,

        onLimitExceeded: async (ctx) => {
            await ctx.reply('Please refrain from sending too many requests!');
        },

        keyGenerator: (ctx) => {
            return ctx.from?.id.toString();
        },
    })
);

bot.use(conversations());
bot.use(createConversation(findRouteConversation, 'find-route'));
bot.use(createConversation(signupConversation, 'signup'));

bot.start({
  onStart(botInfo) {
    logger.info(`Bot @${botInfo.username} started!`);
  },
});


bot.use(onStartMenu)

// Commands
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hello, I'm a bot that can help you to find taxi routes in Addis Ababa.",
    {
      reply_markup: onStartMenu,
    }
  );
});

bot.command("find_route", async (ctx) => {
  await ctx.conversation.enter("find-route");
});

bot.command("signup", async (ctx) => {
  await ctx.conversation.enter("signup");
});

bot.hears("Find route", async (ctx) => {
  await ctx.conversation.enter("find-route");
});

bot.hears("Signup", async (ctx) => {
  await ctx.conversation.enter("signup");
});

bot.hears("Cancel", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.reply('', {
    reply_markup: onStartMenu,
  })
});

// Error handling
bot.catch( async(err) => {
    await ctx.reply("Something were wrong! Don't worry it's not your fault. Maybe try again.");
    const ctx = err.ctx;
    logger.error(
        `[bot-catch][Error while handling update ${ctx.update.update_id}]`,
        { metadata: err.error }
    );
    const e = err.error;

    if (e instanceof GrammyError) {
        logger.error(`[bot-catch][Error in request ${ctx.update.update_id}]`, {
            metadata: e.message,
            stack: e.stack,
        });
    } else if (e instanceof HttpError) {
        logger.error(`[bot-catch][Error in request ${ctx.update.update_id}]`, {
            metadata: e.error,
            stack: e.stack,
        });
    } else {
        logger.error(`[bot-catch][Error in request ${ctx.update.update_id}]`, {
            metadata: e,
        });
    }
    console.error(err);
});