import {
  Conversation,
  ConversationFlavor,
} from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

export interface SessionData {
  count: number;
}

export type BotContext = Context & SessionFlavor<SessionData> & ConversationFlavor;
export type ConversationContext = Context & ConversationFlavor;
export type BotConversation = Conversation<ConversationContext>;