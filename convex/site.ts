import { query } from "./_generated/server";
import { isPublicCatalogRecord } from "./catalogPolicy";
export const summary = query({ args: {}, handler: async ctx => {
  const books = (await ctx.db.query("content").collect()).filter(b => b.kind === "book" && isPublicCatalogRecord(b.status,b.visibility,false));
  const series = (await ctx.db.query("series").collect()).filter(s => isPublicCatalogRecord(s.status,s.visibility,false));
  return { books: books.length, series: series.length, featured: books.sort((a,b)=>a.sortOrder-b.sortOrder).slice(0,6).map(b=>({ id:b._id,title:b.title,slug:b.slug,coverUrl:b.coverAsset?.path ?? b.coverUrl })) };
}});
