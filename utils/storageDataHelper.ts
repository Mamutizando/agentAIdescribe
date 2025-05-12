//Função responsavel por guardar e resgatar qualquer
//tipo de dado durante a execução do teste

const storage: { [key: string]: any } = {};

export function saveData(key: string, value: any): void {
  storage[key] = value;
  console.log(`Dado salvo: ${key} =`, value);
}

export function getData(key: string): any {
  const value = storage[key];
  if (value !== undefined) {
    console.log(`Dado recuperado: ${key} =`, value);
    return value;
  } else {
    console.log(`Nenhum dado encontrado para a chave: ${key}`);
    return undefined;
  }
}
