<img src="assets/moebot.svg" width="80" height="80" alt="猫猫机器人（MoeBot）Logo">

# 猫猫机器人（MoeBot）— 每日人品与图片插件

每日人品与图片：.jrrp、!jrrp、。jrrp、！jrrp、/rejrrp、今日/随机小马图、今日/随机冰雪图。人品按用户每天固定，今日图按作品每天固定，日期按 UTC+8。

需要 猫猫机器人（MoeBot） v0.5.0+，插件 API v1。

## 用户安装

1. 在 [Releases](https://github.com/AnnaofArendelle/qq-bot-plugin-daily/releases) 下载 `daily-1.0.1.zip`。不要使用 GitHub 的 Source code ZIP。
2. WebUI → 插件管理 → 上传 ZIP。
3. 检查权限和设置，启用插件，选择群聊/私聊范围。
4. 点击全局「保存并部署」，等待面板显示新配置已生效。

设置、更新、卸载也在同一面板完成。卸载默认保留数据；重新安装相同 ID 会复用数据。只安装你信任的 JavaScript：插件与核心共享 CPU 和运行环境。

## 开发

```sh
npm ci
npm run typecheck
npm test
```

输出 `dist/daily-1.0.1.zip`。SDK 独立维护于 [qq-bot-plugin-sdk](https://github.com/AnnaofArendelle/qq-bot-plugin-sdk)。配置表单由 config.schema.json 自动生成；完整接口、资源限制和 AI 开发提示见 SDK 仓库。

官方后端首次升级会将旧 jrrp / daily_pic 记录导入 daily 的命名空间，旧表保留供回滚。后续运行只访问插件存储，不写入聊天消息表。

## 1.0.1：MoeBot 品牌更新

项目正式名称为**猫猫机器人（MoeBot）**，统一使用猫猫 SVG Logo。仓库地址、npm 包名、CLI、插件 ID、发布产物文件名和插件 API v1 保持兼容。
