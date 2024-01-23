import { Menu } from "@grammyjs/menu";
import { getUserById, getUserSavedRoutesByUserId } from '@/lib/db'
import { logger } from "@/lib/logger";

const accountMenu = new Menu("accountMenu")
  .text("My account", async (ctx) => {
    const [ user ] = await isUserRegistered(ctx);
    if (!user) {
      return;
    }

    ctx.reply(`Name: ${user.first_name}\nPhone: ${user.phone_number}\nUsername: ${user.username}`);
  }).row()
  .text("My saved routes", async (ctx) => {
    const isRegistered = await isUserRegistered(ctx);
    if (!isRegistered) {
      return;
    }

    const [ routes ] = await getUserSavedRoutesByUserId(ctx.from?.id.toString());
    if (!routes) {
      ctx.reply("You have not saved any routes yet.");
      return;
    }
    ctx.reply(routes);
  }).row()
  .back("Go Back");

export const onStartMenu = new Menu("onStartMenu")
  .text("Find route", async (ctx) => {
    await ctx.conversation.enter("find-route");
  }).row()
  .text("Nearby stations", async (ctx) => {
    await ctx.reply("This feature is not available yet.");
  }).row()
  .submenu("My account", "accountMenu").row()
  .text("Signup", async (ctx) => {
    await ctx.conversation.enter("signup");
  }).row()
  .text("About", async (ctx) => {
    await ctx.reply("Route Addis is a bot designed to help you find taxi routes in Addis Ababa. It is built by @yonathandejene");
  }).row();

onStartMenu.register(accountMenu);

async function isUserRegistered(ctx: BotContext) {
  const user = await getUserById(ctx.from?.id.toString());
  if (!user) {
    await ctx.reply("You are not registered yet. Please signup first.");
    return false;
  }
  return user;
}