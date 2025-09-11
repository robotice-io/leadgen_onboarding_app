export type OAuthTokens = {
  accessToken?: string;
  refreshToken?: string;
  expiryDateMs?: number;
};

export type IntegrationRecord = {
  integrationId: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  fromEmail: string;
  createdAtMs: number;
  tokens?: OAuthTokens;
};

type InMemoryDbShape = {
  integrationsById: Map<string, IntegrationRecord>;
};

declare global {
  // eslint-disable-next-line no-var
  var __roboticeOnboardingDb: InMemoryDbShape | undefined;
}

function initDb(): InMemoryDbShape {
  return {
    integrationsById: new Map<string, IntegrationRecord>(),
  };
}

export function getDb(): InMemoryDbShape {
  if (!globalThis.__roboticeOnboardingDb) {
    globalThis.__roboticeOnboardingDb = initDb();
  }
  return globalThis.__roboticeOnboardingDb;
}

export function upsertIntegration(record: IntegrationRecord): void {
  const db = getDb();
  db.integrationsById.set(record.integrationId, record);
}

export function getIntegrationById(integrationId: string): IntegrationRecord | undefined {
  const db = getDb();
  return db.integrationsById.get(integrationId);
}

export function updateIntegrationTokens(integrationId: string, tokens: OAuthTokens): void {
  const db = getDb();
  const existing = db.integrationsById.get(integrationId);
  if (!existing) return;
  db.integrationsById.set(integrationId, { ...existing, tokens: { ...existing.tokens, ...tokens } });
}


