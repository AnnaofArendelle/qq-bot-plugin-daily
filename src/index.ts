import { definePlugin, type PluginContext } from '@qq-bot/plugin-sdk';
type Config = { fortuneEnabled:boolean; picturesEnabled:boolean; batchSize:number; timeoutMs:number; retries:number };
const day = () => new Date(Date.now()+8*3600000).toISOString().slice(0,10);
const works:Record<string,string> = { '小马':'my_little_pony', '冰雪':'frozen_(disney)' };
async function picture(ctx:PluginContext<Config>, keyword:string) {
  for(let attempt=0;;attempt++) {
    try {
      const rows = await ctx.http.json<{sample_url?:string}[]>(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=${ctx.config.batchSize}&tags=${keyword}+rating:safe`,{timeoutMs:ctx.config.timeoutMs});
      const urls = Array.isArray(rows) ? rows.map(r=>r.sample_url).filter((u):u is string=>typeof u==='string' && /^https:\/\//.test(u)) : [];
      return urls.length ? urls[Math.floor(Math.random()*urls.length)] : null;
    } catch(e) { if(attempt>=ctx.config.retries) throw e; }
  }
}
export default definePlugin<Config>({
  async onCommand(ctx) {
    const {message:m,command,config:c} = ctx;
    if(command.id==='fortune' || command.id==='reset') {
      if(!c.fortuneEnabled) { await ctx.reply.text('该功能已关闭。');return; }
      const key='fortune:'+m.sender;
      if(command.id==='reset') {
        try { await ctx.storage.delete(key);await ctx.reply.text('人品已重置,再摇一次就是新的了。'); }
        catch { await ctx.reply.text('重置失败了,稍后再试。'); } return;
      }
      let value=Math.floor(Math.random()*100)+1;
      try { const row=await ctx.storage.get<{day:string;value:number}>(key); value=row?.day===day()?row.value:(await ctx.storage.putIfDay(key,{day:day(),value})).value; }
      catch { ctx.log.error('人品存储暂时不可用，本次返回随机值。'); }
      const prefix=m.channelType==='c2c'?'你':!m.autoAtOnReply && m.senderName?`@${m.senderName} `:'';
      await ctx.reply.text(`${prefix}今天的人品值是:${value}`);return;
    }
    if(command.id==='picture') {
      if(!c.picturesEnabled) { await ctx.reply.text('该功能已关闭。');return; }
      const keyword=works[m.text.slice(2,-1)];
      const today=m.text.startsWith('今日');const key='picture:'+keyword;
      let url:string|null=null;
      try {
        if(today) { try { const row=await ctx.storage.get<{day:string;url:string}>(key);if(row?.day===day())url=row.url; } catch {} }
        if(!url) { url=await picture(ctx,keyword);if(today && url) {try { url=(await ctx.storage.putIfDay(key,{day:day(),url})).url; } catch {} } }
      } catch { await ctx.reply.text('图没搜着,稍后再试。');return; }
      if(!url) {await ctx.reply.text('这作品没搜到图。');return;}
      await ctx.reply.image(url);
    }
  }
});
