//Função responsavel por ajustar a url base de acordo
//com o ambiente

var _globals = require("../node_modules/playwright/lib/common/globals");

export async function buildUrl(store: string): Promise<string> {

  const urlFinal = async ()  => {
    const baseUrl = await getCurrentTestInfo();

    if (!baseUrl) {
      throw new Error('baseURL não está configurada no contexto do projeto.');
    }

    // Cria um objeto URL com a base configurada
    const url = new URL(baseUrl);

    const environment = process.env.VERSION;

    // Verifica se o ambiente começa com "dev" e, em caso afirmativo, define a versão
    const version = environment && environment.startsWith("dev") ? environment : undefined;

    // Se uma versão for definida, adiciona ao caminho da URL
    if (version) {
      url.pathname = `${url.pathname}/.version/${version}`;
    }

    // Substitui o hostname com o nome da loja
    //url.hostname = `${store}.${url.hostname}`;
    url.hostname = `${store}${url.hostname}`;

    return url.toString(); // Retorna a URL final construída  
  }

  return await urlFinal();

}

  // Obtém o baseURL configurado no contexto do Playwrigh
async function getCurrentTestInfo(): Promise<string> {
  const curTestInfo = await (0, _globals.currentTestInfo)();
  return await curTestInfo.project.use.baseURL;
}
