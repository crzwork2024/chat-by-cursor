# AI问答系统

## 项目简介

这是一个基于 Flask 和 Sentence Transformers 的 AI 问答系统。用户可以输入问题，系统将返回相似问题及其答案。该项目包含前端和后端部分，前端使用 HTML、CSS 和 JavaScript 构建，后端使用 Python 和 Flask 框架。

## 项目结构

```
chatgpt_clone/
│
├── backend/
│   ├── app.py
│   ├── data_import.py
│   ├── model.py
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── script.js
    ├── styles.css
    └── .gitignore
```

## 环境要求

- Python 3.6 或更高版本
- Node.js（可选，用于前端开发）
- pip（Python 包管理器）

## 安装依赖

### 后端依赖

在 `backend` 目录下，创建一个虚拟环境并安装依赖：

```
cd backend
pip install -r requirements.txt
```

### 前端依赖

前端不需要额外的依赖，只需确保浏览器支持 HTML5 和 CSS3。

## 数据导入

在运行后端之前，您需要导入数据。确保您有一个 Excel 文件（`questions_answers.xlsx`），其中包含两列：问题和答案。

运行数据导入脚本：

```
python data_import.py
```

## 运行后端

1. 在终端中，导航到 `backend` 目录并运行 Flask 应用：

   ```
   python app.py
   ```

   默认情况下，Flask 服务器将在 `http://127.0.0.1:5000/` 上运行。

## 运行前端

1. 在终端中，导航到 `frontend` 目录并运行一个简单的 HTTP 服务器：

   ```
   cd frontend
   python -m http.server 8000
   ```

   这将在 `http://127.0.0.1:8000/` 上提供前端文件。

## 访问应用

1. 打开浏览器并访问 `http://127.0.0.1:8000/index.html`。
2. 在输入框中输入问题并按 Enter 键提交。

## 代码结构

- **backend/app.py**: Flask 应用程序的主文件，处理前端请求。
- **backend/data_import.py**: 从 Excel 文件导入数据并存储到向量数据库。
- **backend/model.py**: 处理问题的向量化和相似问题的查找。
- **frontend/index.html**: 前端的 HTML 文件。
- **frontend/script.js**: 前端的 JavaScript 文件，处理用户输入和与后端的交互。
- **frontend/styles.css**: 前端的 CSS 文件，定义样式。

## .gitignore

```
# Node.js
node_modules/
npm-debug.log
yarn-error.log

# Build artifacts
dist/
build/
out/
*.tgz

# Python
__pycache__/
*.py[cod]
*.pyo
*.egg-info/
.eggs/
*.egg
*.pyc
*.pdb
*.pyo

# IDEs and editors
.vscode/
.idea/
*.sublime-workspace
*.sublime-project

# Operating system files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log

# Temporary files
tmp/
temp/
.cache/
.cache-loader/

# Ignore large folders
large_folder_1/
large_folder_2/

# Web caches
.cache/
*.cache
*.log
*.tmp
*.temp

# Ignore common web build artifacts
public/
static/
*.zip
*.tar.gz
*.rar
*.7z

# Ignore large folders
model/
data/
.git/
```

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

此项目使用 MIT 许可证。有关详细信息，请参阅 LICENSE 文件。

---

通过以上步骤，您应该能够成功运行该项目。如果您在运行过程中遇到任何问题，请随时提出。
