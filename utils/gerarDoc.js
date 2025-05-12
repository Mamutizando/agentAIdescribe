const { execSync } = require("child_process");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// Configurar chave da OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function getGitDiff() {
  return execSync("git diff HEAD~1 HEAD").toString();
}

function getCommitAuthor() {
  return execSync("git log -1 --pretty=format:%an").toString();
}

function getCommitDate() {
  return execSync("git log -1 --date=iso --pretty=format:%cd").toString();
}

async function gerarResumo(diff) {
  const prompt = `
Explique em linguagem simples e técnica o que foi alterado no código abaixo.
Explique o que foi feito, como foi feito e por quê, em formato de tópicos.

\`\`\`diff
${diff}
\`\`\`
`;

  const resposta = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return resposta.data.choices[0].message.content;
}

function adicionarNoHistorico(resumo, autor, data) {
  const formatada = new Date(data).toLocaleString("pt-BR");
  const entrada = `\n## [${formatada}] por ${autor}\n\n**Resumo das alterações:**\n${resumo}\n\n---\n`;

  fs.appendFileSync("HISTORICO.md", entrada, "utf-8");
}

async function main() {
  const diff = getGitDiff();
  const autor = getCommitAuthor();
  const data = getCommitDate();
  const resumo = await gerarResumo(diff);

  adicionarNoHistorico(resumo, autor, data);
}

main().catch(console.error);
