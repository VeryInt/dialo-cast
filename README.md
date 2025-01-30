# DialoCast 人工智能播客生成器

DialoCast 是一个基于 Electron 的桌面应用，利用人工智能技术帮助用户快速生成和制作双人播客内容。通过 MINIMAX AI 的强大模型支持，可以轻松创建高质量的播客脚本并将其转换为语音音频。

## 功能概述

### 核心功能

1. **主题输入**：

    - 用户输入播客主题后，AI 自动生成结构化的双人播客脚本。
    - 支持中文/英文两种语言选择。

2. **语音合成**：

    - 将生成的脚本转换为真人语音，支持两种不同音色和情绪调节。
    - 提供音调、语速、情感表达等参数调整选项。

3. **可定制化输出**：

    - 根据需求调整人声、音调、语速和情感表达。
    - 支持多种音频格式输出（如 MP3、WAV）。// TODO: WAV

4. **价格控制**：
    - 单次使用成本人民币0.5元左右。

### 附加功能

- **历史记录管理**：保存生成的音频文件。
- **导出功能**：支持将生成的内容导出为多种格式。// TODO
- **模板库**：提供多种播客主题模板，方便用户快速上手。// TODO

## 技术架构

### 主要技术栈

- **前端**：
    - Electron 框架，提供跨平台桌面应用体验。
    - React / shadcn 库用于构建用户界面。
- **AI 集成**：
    - MINIMAX 文本生成模型进行播客脚本创作。
    - MINIMAX 语音合成 API 将文本转换为语音。

### 架构图

```
dialo-cast/
├── src/                 # 源代码目录
│   ├── main/           # 主进程代码（管理应用生命周期）
│   ├── renderer/       # 渲染进程代码（UI 组件和逻辑）
│   └── services/       # 服务层（API 调用和业务逻辑）
├── package.json        # 项目依赖和脚本配置
├── tsconfig.json       # TypeScript 配置文件
└── webpack.*.ts        # Webpack 打包配置
```

## 使用说明

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run start
```

### 构建项目

```bash
npm run build
```

## 配置指南

### 环境变量

在启动应用之前，确保设置以下环境变量：

- `MIN_MAX_API_KEY`：MINIMAX 提供的 API 访问密钥。
- `MIN_MAX_GROUND_ID`：注册 MINIMAX 后的用户Group ID。

### 示例配置文件

在项目根目录创建 `.env` 文件：

```env
MIN_MAX_API_KEY=your_api_key_here
MIN_MAX_GROUND_ID=your_minimax_groupid
```
