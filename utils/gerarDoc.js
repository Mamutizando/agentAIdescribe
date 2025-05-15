const { execSync } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ A chave da API OpenAI não foi encontrada. Verifique o arquivo .env.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gerarResumo() {
  try {
    const autor = execSync("git log -1 --pretty=format:'%an'").toString().trim();
    const data = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    const diff = execSync("git diff HEAD").toString();

    // Limitar o tamanho do diff para reduzir custos
    const diffLimitado = diff.split("\n").slice(0, 50).join("\n");

    const prompt = `
      Você é um Analista de Qualidade com 10 anos de experiência, que desenvolve automação de testes E2E no playwright e tem que escrever resumos de código, 
      a partir das alterações commitadas. Baseado nas mudanças abaixo (git diff), gere um resumo simples, mas detalhado do que foi alterado.

      Autor: ${autor}
      Data: ${data}
      Mudanças:
      ${diffLimitado}
    `;

    const completion = await openai.chat.completions.create({
      model: "dall-e-3",
      messages: [{ role: "user", content: prompt }],
    });

    const resposta = completion.choices[0].message.content;

    const markdown = `## [${data}] por ${autor}\n\n${resposta}\n\n---\n`;

    fs.appendFileSync("HISTORICO.md", markdown);
    console.log("✅ Histórico atualizado com IA");
  } catch (error) {
    console.error("❌ Ocorreu um erro ao gerar o resumo:", error.message);
  }
}

gerarResumo();