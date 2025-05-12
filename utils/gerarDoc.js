const { execSync } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gerarResumo() {
  const autor = execSync("git log -1 --pretty=format:'%an'").toString().trim();
  const data = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const diff = execSync("git diff HEAD").toString();

  const prompt = `
    Você é um Analista de Qualidade com 10 anos de experiência, que desenvolve automação de testes E2E no playwright e tem que escrever resumos de código, 
    a partir das alterações commitadas. Baseado nas mudanças abaixo (git diff), gere um resumo simples, mas detalhado do que foi alterado.

    Autor: ${autor}
    Data: ${data}
    Mudanças:
    ${diff}
  `;

  const completion = await openai.chat.completions.create({
    model: "OpenAI-Beta: assistentes=v2",
    messages: [{ role: "user", content: "Escreva um resumo para meu código." }],
  });

  const resposta = completion.choices[0].message.content;

  const markdown = `## [${data}] por ${autor}\n\n${resposta}\n\n---\n`;

  fs.appendFileSync("HISTORICO.md", markdown);
  console.log("✅ Histórico atualizado com IA");
}

gerarResumo();
