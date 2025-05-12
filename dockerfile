
FROM mcr.microsoft.com/playwright:v1.49.1-noble


ARG SHARD
ARG PROJETO
ARG CURRENTS_KEY
ARG CURRENTS_BUILD
ARG GREP
ARG INFO_BRANCH
ARG INFO_MESSAGE
ARG INFO_AUTHOR
ARG INFO_SHA
ARG INFO_REMOTE

ENV CURRENTS_PROJECT_ID Cmeggq
ENV CURRENTS_RECORD_KEY ${CURRENTS_KEY}
ENV CURRENTS_CI_BUILD_ID ${CURRENTS_BUILD}
ENV ENV_SHARD ${SHARD}
ENV ENV_PROJETO ${PROJETO}
ENV ENV_GREP ${GREP}
ENV COMMIT_INFO_BRANCH ${INFO_BRANCH}
ENV COMMIT_INFO_MESSAGE ${INFO_MESSAGE}
ENV COMMIT_INFO_AUTHOR ${INFO_AUTHOR}
ENV COMMIT_INFO_SHA ${INFO_SHA}
ENV COMMIT_INFO_REMOTE ${INFO_REMOTE}


# Definir diretório de trabalho
WORKDIR /app

# Copiar o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Instalar o navegador Chromium com dependências
RUN npx playwright install chromium --with-deps

# Copiar o código-fonte do projeto para dentro do contêiner
COPY . .


CMD npx playwright test --shard $ENV_SHARD --config ./playwright.config.reporter.ts --project $ENV_PROJETO $ENV_GREP