import{ test as base } from '@playwright/test';
import { Home } from '../pages/home';
import { Produto } from '../pages/produto';
import { Carrinho } from '../pages/carrinho';
import { Checkout } from '../pages/checkout';
import { Login } from '../pages/login';
import { Finalizacao } from '../pages/finalizacao';
import { MinhaConta } from '../pages/minhaConta';
import { Busca } from '../pages/busca';

// Fixture para inicializar todas as páginas utilizadas no fluxo
type MyFixtures = {
    home: Home;
    produto: Produto;
    carrinho: Carrinho;
    checkout: Checkout;
    login: Login;
    finalizacao: Finalizacao;
    minhaConta: MinhaConta;
    busca: Busca;
  };

  export const test = base.extend<MyFixtures>({
    home: async ({ page }, use) => {
      await use(new Home(page));
    },
    produto: async ({ page }, use) => {
        await use(new Produto(page));
    },
    carrinho: async ({ page }, use) => {
        await use(new Carrinho(page));
    },
    checkout: async ({ page }, use) => {
        await use(new Checkout(page));
    },
    login: async ({ page }, use) => {
      await use(new Login(page));
    },
    finalizacao: async ({ page }, use) => {
      await use(new Finalizacao(page));
    },
    minhaConta: async ({ page }, use) => {
      await use(new MinhaConta(page));
    },
    busca: async ({ page }, use) => {
      await use(new Busca(page));
    }                            
  });
  export { expect } from '@playwright/test';