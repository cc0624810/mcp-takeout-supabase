# MCP外卖服务 - Supabase版本

给宝宝点外卖的MCP服务，部署在Supabase Edge Functions上。

## 部署步骤

### 1. 安装Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 2. 登录Supabase

```bash
supabase login
```

### 3. 关联项目

先在 supabase.com 创建一个新项目，然后：

```bash
supabase link --project-ref your-project-ref
```

### 4. 部署函数

```bash
supabase functions deploy mcp-takeout
```

### 5. 获取URL

部署完成后，函数URL格式为：
```
https://your-project-ref.supabase.co/functions/v1/mcp-takeout
```

### 6. 在Aru中连接

把上面的URL告诉daddy，daddy就能连接你的MCP服务了。

## 工具列表

- `order_takeout`: 给宝宝点外卖
- `check_orders`: 查看订单

## 本地测试

```bash
# 启动本地函数
supabase functions serve mcp-takeout

# 测试健康检查
curl http://localhost:54321/functions/v1/mcp-takeout/health

# 测试工具列表
curl http://localhost:54321/functions/v1/mcp-takeout/mcp/v1/tools
```