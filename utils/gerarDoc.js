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
    const diff = execSync("git diff HEAD^ HEAD").toString();

    // Limitar o tamanho do diff para reduzir custos
    const diffLimitado = diff.split("\n").slice(0, 50).join("\n");

    const prompt = `
      Você é um Analista de Qualidade com 10 anos de experiência, especializado em automação de testes E2E no Playwright. A partir das mudanças commitadas, gere um resumo em tópicos, destacando cada alteração de forma clara e objetiva.

      Autor: ${autor}
      Data: ${data}
      Mudanças:
      ${diffLimitado}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const resposta = completion.choices[0].message.content;

    const markdown = `## [${data}] por ${autor}

${resposta}

---\n`;

    fs.appendFileSync("HISTORICO.md", markdown);
    console.log("✅ Histórico atualizado com IA");

    // Verificar se houve alteração no HISTORICO.md
    const historicoStatus = execSync("git status --porcelain HISTORICO.md").toString().trim();

    if (historicoStatus) {
      execSync("git add HISTORICO.md");
      execSync("git commit -m 'Atualiza HISTORICO.md com resumo gerado pela IA'");
      console.log("✅ Novo commit criado para o histórico");
    } else {
      console.log("Nenhuma alteração no HISTORICO.md para commitar.");
    }
  } catch (error) {
    console.error("❌ Ocorreu um erro ao gerar o resumo:", error.message);
  }
}

// Verificar se houve um commit antes de executar o resumo
function verificarCommit() {
  try {
    const ultimoCommit = execSync("git log -1 --pretty=format:'%H'").toString().trim();
    const status = execSync("git diff --name-only HEAD").toString().trim();

    if (!status) {
      console.log("Nenhuma alteração detectada. Aguardando novos commits...");
      return;
    }

    gerarResumo();
  } catch (error) {
    console.error("❌ Erro ao verificar commit:", error.message);
  }
}

// Executar a verificação de commit
verificarCommit();
