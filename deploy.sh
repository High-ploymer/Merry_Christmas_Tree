#!/bin/bash
echo "🚀 部署圣诞树项目到Vercel..."
echo "📦 重新构建项目..."
npm run build
echo "📝 提交代码更改..."
git add .
git commit -m "Update: $(date)" || echo "没有更改需要提交"
echo "⬆️  部署到Vercel..."
vercel --prod
echo "✅ 部署完成！"