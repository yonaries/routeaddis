import { BotContext, ConverstaionContext } from '@/types';
import { logger } from '@/lib/logger';
import { Keyboard, InlineKeyboard } from "grammy";
import { createUser, getUserById } from "@/lib/db";

const contactKeyboard = new Keyboard()
  .requestContact('Share my contact').resized().oneTime();

const nameConfirmation = new InlineKeyboard()
  .text("Yes", "yes").text("No", "no");

const signupConversation = async (
    conversation: ConverstaionContext,
    ctx: BotContext
) => {
    
    let user_first_name;
    let user_phone_number;

    const { user } = await ctx.getAuthor();  
    if (!user.username) {
        logger.info(
            `[find route][user does not have a username configured]`,
            { metadata: '' }
        );
        await ctx.reply('Please define an username for your account first', {
            reply_to_message_id: ctx?.msg?.message_id,
        });

        await ctx.conversation.exit();
        return;
    }
    
    const userExists = await getUserById(user.id);
    console.log(userExists);

    if (userExists) {
        await ctx.reply("You already have an account!");
        await ctx.conversation.exit();
        return;
    }

    await ctx.reply("Account Creation");
    await ctx.reply(`Is your name ${user.first_name}?`, {
        reply_markup: nameConfirmation,
    });

    const response = await conversation.waitForCallbackQuery(["yes", "no"], {
        otherwise: (ctx) => ctx.reply("Use the buttons!", { reply_markup: nameConfirmation }),
    });

    if (response.match === "yes") {
        user_first_name = user.first_name
    } else {
        await ctx.reply("May I know your name, Please.");
        const nameCtx = await conversation.waitFor(":text");
        user_first_name = nameCtx?.msg?.text     
    }

    await ctx.reply(`Awesome ${ user_first_name }, Now share your contact.`, {
        reply_markup: contactKeyboard,
    });

    const contactCtx = await conversation.waitFor(":contact");
    user_phone_number = contactCtx.message.contact.phone_number;
    
    await ctx.reply("Registering you..... ⏳");

    await createUser({
        id: user.id,
        is_bot: user.is_bot,
        first_name: user_first_name,
        username: user.username,
        phone_number: user_phone_number,
        language_code: user.language_code,
    })
    await ctx.reply("Thank you for signing up! You can now use all the features.")
};

export { signupConversation };