import { BotContext, ConverstaionContext } from '@/types';
import { logger } from '@/lib/logger';
import { searchLocation } from "@/lib/db";
import { onStartMenu } from "@/handlers/onstart";
import { Keyboard } from "grammy";

const cancelKeyboard = new Keyboard().text("Cancel").resized();

const findRouteConversation = async (
    conversation: ConverstaionContext,
    ctx: BotContext
) => {
    let locations;

    await ctx.reply("Let's find you a route, where do want to go?", {
        reply_markup: cancelKeyboard,
    });
    const destCtx = await conversation.waitFor(':text');
    const destination = destCtx.message?.text;

    await ctx.reply("Looking for your destination...");
    locations = await searchLocation(destination)

    while(!locations | !locations.length > 0) {
        await ctx.reply("Sorry, The place you are looking for is not in our database yet. Maybe try a close by place.", {
            reply_markup: cancelKeyboard,
        });
        const _locationCtx = await conversation.waitFor(':text');
        const _location = _locationCtx.message?.text;

        if (_location === 'Cancel') {
            await ctx.conversation.exit();
            await ctx.reply('', {
                reply_markup: onStartMenu,
            })
            return;
        }
        await ctx.reply("Looking for your destination...");
        locations = await searchLocation(_location);
    }

    await ctx.reply("Where are you now?");
    const startCtx = await conversation.waitFor(':text');
    const startLocation = startCtx.message?.text;

    await ctx.reply("Looking for your location...");
    locations = await searchLocation(startLocation)

    while(!locations | !locations.length > 0) {
        await ctx.reply("Sorry, The place you are looking for is not in our database yet. Maybe try a close by place.", {
            reply_markup: cancelKeyboard,
        });
        const _locationCtx = await conversation.waitFor(':text');
        const _location = _locationCtx.message?.text;

        if (_location === 'Cancel') {
            await ctx.conversation.exit();
            await ctx.reply('', {
                reply_markup: onStartMenu,
            })
            return;
        }

        await ctx.reply("Looking for your location...");
        locations = await searchLocation(_location)
    }

    await ctx.reply('Finding routes...');
    await ctx.reply('Sorry, where could not find you a route. Maybe as some people around you this time.');
};

export { findRouteConversation };
