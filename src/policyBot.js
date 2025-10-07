import { ActivityHandler, CardFactory } from "botbuilder";
import { searchKB } from "./search.js";

export class PolicyBot extends ActivityHandler {
  constructor() {
    super();
    this.onMessage(async (ctx, next) => {
      const q = (ctx.activity.text || "").trim();
      if (!q) { await ctx.sendActivity("Ask me: WFO 12 days, lost laptop, VPN not working..."); return next(); }
      const hits = searchKB(q).slice(0,3);
      if (!hits.length) { await ctx.sendActivity("I couldn't find that. Try another keyword."); return next(); }
      await ctx.sendActivity({
        attachments: hits.map(r => CardFactory.heroCard(
          `${r.title}${r.page ? ` (p.${r.page})` : ""}`,
          r.snippet,
          null,
          [{ type: "openUrl", title: "Open source", value: r.url }]
        ))
      });
      return next();
    });
  }
}
