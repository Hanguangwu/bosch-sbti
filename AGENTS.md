# AGENTS.md — Bosch SBTI 博世职场人格测试

## Project
纯前端 Web 应用（21 题四选一人格测试，16 种结果类型）。
后端仅提供静态文件服务，所有计分逻辑在前端 `quiz.js` 中完成。**不依赖数据库，无数据留存。**

Entry point: `main.py`

## Run
```bash
# Note: requirements.txt 和源码中保留了拼写 typo: "uvicorn" (非 uvicorn), "fastapi" (非 fastapi)
pip install -r requirements.txt
uvicorn main:app --reload
```
- **不含环境变量依赖**。`SBTI_ADMIN_TOKEN` / `SBTI_DB_PATH` 已废弃。

## Structure
| Path | Purpose |
|------|---------|
| `main.py` | 静态文件服务（单路由 `GET /` → `index.html`） |
| `static/quiz.js` | **核心逻辑**：题库数据、计分规则、结果计算与渲染 |
| `static/style.css` | 样式表 |
| `templates/index.html` | 答题 + 结果单页（纯静态 HTML，JS 驱动，无 Jinja2 变量） |
| `templates/result.html` | 旧结果页（自动跳转 `/`，保留仅为兼容） |
| `static/*.png` | 16 种人格类型结果图片 |
| `imgs/selected-bosch-sbti/*.png` | 原始人格类型图片（源素材） |
| `question.txt` | 题库与计分规则（权威来源，`quiz.js` 的同步依据） |

## Key conventions
- **计分规则**：四选一 A/B/C/D，四维映射详见 `question.txt` 第四节或 `quiz.js` 中的 `CHOICE_SCORES`
  - 选项 A = (R, J, D, Q)
  - 选项 B = (R, M, Y, O)
  - 选项 C = (S, M, Y, O)
  - 选项 D = (S, J, Y, Q)
- **人格码拼接**：维度 1（R/S）→ 维度 2（J/M）→ 维度 3（D/Y）→ 维度 4（Q/O），例如 `RJDQ`
- **结果渲染**：`calculateResult()` → 返回 `{typeCode, description, breakdown, answered, total}`
- **无后端 API**：所有逻辑在浏览器中运行，无表单提交，无数据存储
- **Typo in codebase**：`fastapi`→`fastapi`、`uvicorn`→`uvicorn`、`Jinja2Templates`→`Jinja2Templates` — 全域一致，编辑时保留

## Notes
- 无 `pyproject.toml` 或 `.python-version`；Python 版本未锁定
- `requirements.txt` 使用 `>=`（最小版本），未锁定
- 无数据库、无缓存、无服务端状态
