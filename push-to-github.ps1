# Script para fazer push para o GitHub
# Este script tenta diferentes métodos de autenticação

Write-Host "🚀 Preparando push para GitHub..." -ForegroundColor Cyan

# Verificar se há commits locais
$commits = git log origin/main..HEAD 2>$null
if (-not $commits) {
    Write-Host "⚠️  Nenhum commit local para enviar" -ForegroundColor Yellow
    exit 0
}

Write-Host "✅ Commits locais encontrados" -ForegroundColor Green

# Tentar push normal primeiro
Write-Host "`n📤 Tentando push normal..." -ForegroundColor Cyan
$result = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    exit 0
}

# Se falhou, verificar se é erro de autenticação
if ($result -match "403" -or $result -match "Permission denied" -or $result -match "Authentication failed") {
    Write-Host "`n⚠️  Erro de autenticação detectado" -ForegroundColor Yellow
    Write-Host "`nPor favor, configure a autenticação do GitHub:" -ForegroundColor Yellow
    Write-Host "1. Crie um Personal Access Token em: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Selecione o escopo 'repo'" -ForegroundColor White
    Write-Host "3. Execute: git push -u origin main" -ForegroundColor White
    Write-Host "4. Quando solicitado:" -ForegroundColor White
    Write-Host "   - Username: seu usuário do GitHub" -ForegroundColor White
    Write-Host "   - Password: cole o token (não sua senha)" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro no push:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
}

Write-Host "`nAlternativa: Use o GitHub Desktop ou configure SSH" -ForegroundColor Cyan

