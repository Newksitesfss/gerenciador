# Gerenciador de OS - Deploy no Render

Instruções rápidas:
1. Crie um novo Web Service no Render (Environment: Python 3).
2. Faça upload deste repositório (zip) ou conecte ao GitHub.
3. Configure a variável de ambiente SECRET_KEY com uma string forte.
4. Start command: `gunicorn app:app`

O app usa SQLite (data.db) e inicializa o schema automaticamente.
