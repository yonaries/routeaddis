import { Menu } from "@grammyjs/menu";

const accountMenu = new Menu("accountMenu")
  .text("My account", (ctx) => {}).row()
  .text("My saved routes", (ctx) => {}).row()
  .text("My saved locations", (ctx) => {}).row()
  .back("Go Back");

export const onStartMenu = new Menu("onStartMenu")
  .text("Find route", async (ctx) => {
    await ctx.conversation.enter("find-route");
  }).row()
  .text("Nearby stations", (ctx) => {

  }).row()
  .submenu("My account", "accountMenu").row()
  .text("Signup", async (ctx) => {
    await ctx.conversation.enter("signup");
  }).row()
  .text("About", async (ctx) => {
    await ctx.reply("Route Addis is a bot designed to help you find taxi routes in Addis Ababa. It is built by @yonathandejene");
  }).row();

  onStartMenu.register(accountMenu);