# Sofia’s Closet
## Correr localmente
1. `npm install`
2. Supabase: cria projeto, corre `supabase/schema.sql` no SQL Editor. Em Authentication podes desligar "Confirm email" para testar.
3. `cp .env.example .env.local` e preenche (URL, anon key, ANTHROPIC_API_KEY).
4. `npm run dev`

## Publicar (Vercel)
Importa o repositório na Vercel e define as mesmas variáveis de ambiente. Em Supabase > Authentication > URL Configuration, adiciona o URL da Vercel.

## iPhone
Abre o URL no Safari > Partilhar > "Adicionar ao ecrã principal".

## Estado
Pronto: login/registo, closet (CRUD, fotos privadas, categorias, pesquisa, análise por IA), outfits (gerar/guardar/apagar), chat Stylist, PWA.
Também: Style Studio, Wishlist, Insights, Calendar, Try-On (UI). Try-On só gera resultados quando TRYON_PROVIDER_URL/KEY existirem e o contrato em src/lib/ai/provider.ts for adaptado; até lá mostra aviso de demonstração.
Nota: código escrito sem poder instalar/compilar; espera pequenos ajustes no primeiro `npm run dev`.

## Checklist antes de expor
- [ ] `npm run build` sem erros
- [ ] schema.sql executado; bucket `closet` privado
- [ ] Variáveis na Vercel; chave ANTHROPIC só no servidor
- [ ] URL da Vercel em Supabase > Auth > URL Configuration
- [ ] Testar registo, upload, Stylist e Adicionar ao ecrã principal no iPhone
