ARG NODE_VERSION=lts
ARG IMAGE_VARIANT=slim

FROM node:${NODE_VERSION}-${IMAGE_VARIANT} AS builder
ENV NODE_ENV=production
ENV NEXTJS_IGNORE_ESLINT=1
ENV NEXTJS_IGNORE_TYPECHECK=0

RUN apt-get update && apt-get install -y rsync make rsync python3 build-essential curl bash git && ln -sf /usr/bin/python3 /usr/bin/python
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN pnpm install -g @graphql-codegen/cli

RUN mkdir -p $HOME/.foundry/bin
RUN curl -# -L https://raw.githubusercontent.com/foundry-rs/foundry/master/foundryup/foundryup -o $HOME/.foundry/foundryup
RUN chmod +x $HOME/.foundry/foundryup
RUN bash $HOME/.foundry/foundryup
ENV PATH="/root/.foundry/bin:${PATH}"
RUN forge --version

WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod=false
RUN pnpm install -g @graphql-codegen/cli

COPY . .
# COPY --from=deps /workspace-install ./
RUN pnpm install --frozen-lockfile --prod=false

RUN cd apps/pool-metadata/contracts && make patch && forge build
RUN pnpm run -C=packages/gql graphql:update-types
RUN pnpm run --filter "{apps/balancer-tools}..." build:prepare:wagmi
RUN pnpm run --filter "{apps/balancer-tools}..." build

FROM node:${NODE_VERSION}-${IMAGE_VARIANT} AS runner

WORKDIR /app

ENV NODE_ENV production

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 nextjs

COPY --from=builder /app/apps/balancer-tools/next.config.js \
                    /app/apps/balancer-tools/package.json \
                    ./apps/balancer-tools/
COPY --from=builder /app/apps/balancer-tools/public ./apps/balancer-tools/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/balancer-tools/.next ./apps/balancer-tools/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/balancer-tools/node_modules ./apps/balancer-tools/node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app/apps/balancer-tools

CMD ["node_modules/.bin/next", "start"]
