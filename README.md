# 六爻卜卦 🪙

一个基于周易六爻、铜钱起卦、AI解读的网页应用。

---

## 🚀 部署步骤（全程约10分钟）

### 第一步：获取 Anthropic API Key

1. 打开 https://console.anthropic.com
2. 注册账号（可用 Google 登录）
3. 点击左侧 **API Keys** → **Create Key**
4. 复制这个 Key（形如 `sk-ant-api03-...`），妥善保存

> ⚠️ API Key 只显示一次，请立即复制保存

---

### 第二步：把代码上传到 GitHub

**方法A：网页操作（无需安装任何软件）**

1. 打开 https://github.com，登录你的账号
2. 点击右上角 **+** → **New repository**
3. 填写名称，比如 `liuyao-app`，选 **Public**，点击 **Create repository**
4. 在新建的仓库页面，点击 **uploading an existing file**（上传文件链接）
5. 把这个文件夹里的所有文件**按目录结构**拖入上传：
   ```
   liuyao-app/
   ├── api/
   │   └── chat.js        ← 必须在 api 子文件夹里
   ├── src/
   │   ├── main.jsx
   │   └── App.jsx
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── vercel.json
   └── .gitignore
   ```
   > 注意：GitHub 网页上传不支持子文件夹，推荐用方法B

**方法B：用 GitHub Desktop（推荐，简单直观）**

1. 下载安装 https://desktop.github.com
2. 登录你的 GitHub 账号
3. 点击 **File → Add Local Repository**，选择 `liuyao-app` 文件夹
4. 如果提示"不是Git仓库"，点击 **create a repository here**
5. 填写名称，点击 **Create Repository**
6. 点击 **Publish repository** → 取消勾选 **Keep this code private** → 点击 **Publish**

---

### 第三步：部署到 Vercel

1. 打开 https://vercel.com，点击 **Sign Up**，选择 **Continue with GitHub** 登录
2. 点击 **Add New Project**
3. 找到你刚才上传的 `liuyao-app` 仓库，点击 **Import**
4. 框架会自动识别为 Vite，直接点击 **Deploy**
5. 等待约1分钟，部署完成！

---

### 第四步：添加 API Key（最关键）

部署完成后，还需要告诉 Vercel 你的 API Key：

1. 在 Vercel 项目页面，点击顶部 **Settings**
2. 左侧点击 **Environment Variables**
3. 填写：
   - **Key（名称）**：`ANTHROPIC_API_KEY`
   - **Value（值）**：粘贴你的 `sk-ant-...` Key
4. 点击 **Save**
5. 回到 **Deployments** 页面，点击最新部署右侧的 **⋯** → **Redeploy**

---

### 第五步：访问你的网站 🎉

重新部署完成后，Vercel 会给你一个链接，形如：

```
https://liuyao-app-xxx.vercel.app
```

把这个链接发给朋友，即可使用！

---

## 💰 费用说明

| 服务 | 费用 |
|------|------|
| GitHub | 完全免费 |
| Vercel | 免费套餐足够个人使用 |
| Anthropic API | 按用量计费，每次解卦约 $0.003（不到2分钱人民币） |

> Anthropic 新账号赠送 $5 免费额度，可以用几百次

---

## 🔧 本地开发（可选）

如果你想在本地修改代码后再部署：

```bash
# 安装依赖
npm install

# 创建本地环境变量文件
echo "ANTHROPIC_API_KEY=你的key" > .env.local

# 启动开发服务器
npm run dev
```

---

## ❓ 常见问题

**Q: 点击"请AI大师解卦"没有反应？**
A: 检查 Vercel 环境变量是否正确设置，且设置后是否重新部署了。

**Q: 朋友用的时候会消耗我的 API 额度吗？**
A: 是的，每次解卦都会消耗你账号里的额度。如果担心，可以在 Anthropic Console 里设置每月消费上限。

**Q: 如何设置消费限额？**
A: 登录 console.anthropic.com → Settings → Limits → 设置 Monthly spend limit。
