# 我的导航页

一个轻量、现代化的个人导航首页模板。

## 功能

- 分组展示常用网站链接
- 自动提取站点图标（favicon）
- 图标加载失败时自动回退为首字母头像
- 支持实时搜索（按站点名和域名）
- 响应式布局，适配桌面和手机

## 如何使用

1. 直接在浏览器打开 `index.html`。
2. 修改页面中的 `linkGroups` 数据来添加/删除链接。

## 配置链接

在 `index.html` 里找到：

```js
const linkGroups = [
  {
    title: "开发",
    links: [
      { name: "GitHub", url: "https://github.com" }
    ]
  }
];
```

- `title`：分组名称
- `name`：站点显示名
- `url`：站点地址

## 个性化配置

在 `index.html` 中，你可以优先修改这几个对象：

```js
const profile = {
  title: "Yuki's Hub",
  avatar: "Y",
  subtitle: "代码、效率、灵感都在这里",
  signature: "我喜欢把常用工具放在一页里，打开浏览器就能开始工作。",
  tags: ["效率优先", "轻量主义", "持续构建", "写点好东西"]
};
```

- `title`：页面主标题
- `avatar`：头像字符（可用字母或 emoji）
- `subtitle`：副标题
- `signature`：个性签名
- `tags`：你的关键词标签

主题按钮由 `themes` 控制，你可以改名字或减少/增加主题。

## 图标来源说明

默认通过 `https://icons.duckduckgo.com/ip3/{domain}.ico` 自动获取图标。  
如果某个站点没有图标或加载失败，会自动显示站点名首字母，不影响使用。

## 油猴脚本发布（访问 `nav.me` 自动跳转）

仓库已提供脚本文件：`nav-home-redirect.user.js`。

### 作用

- 当你在地址栏输入 `nav.me`（或 `www.nav.me`）时，自动跳转到你的导航页。

### 使用前先改 1 个配置

打开 `nav-home-redirect.user.js`，修改：

```js
const TARGET_URL = "https://your-name.github.io/nav/";
```

改成你的真实公开地址（建议用 GitHub Pages、Vercel 或 Netlify 部署后的 URL）。

### 本地安装测试

1. 打开 Tampermonkey 控制台 -> 新建脚本
2. 粘贴 `nav-home-redirect.user.js` 内容并保存
3. 浏览器访问 `https://nav.me`，应自动跳转到你的导航页

### 公开发布到 GreasyFork

1. 注册并登录 `https://greasyfork.org/`
2. 点击“发布脚本 / Post a script”
3. 粘贴 `nav-home-redirect.user.js` 内容
4. 填写脚本说明并提交
5. 发布后将得到公开安装链接，任何人都可一键安装

### 后续更新

- 修改脚本后，在 GreasyFork 更新版本号（`@version`）并重新发布。
