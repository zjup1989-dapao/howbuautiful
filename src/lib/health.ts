export type HealthEnvironment = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  openAiKey: string;
};

export type HealthReport = {
  app: "ok";
  environment: {
    supabaseUrl: boolean;
    supabaseAnonKey: boolean;
    supabaseServiceRoleKey: boolean;
    openAiKey: boolean;
  };
  supabase: {
    configured: boolean;
    databaseReachable: boolean;
    error?: string;
  };
};

type DatabaseCheck = () => Promise<{ reachable: boolean; error?: string }>;

export async function buildHealthReport(env: HealthEnvironment, checkDatabase: DatabaseCheck): Promise<HealthReport> {
  const environment = {
    supabaseUrl: Boolean(env.supabaseUrl),
    supabaseAnonKey: Boolean(env.supabaseAnonKey),
    supabaseServiceRoleKey: Boolean(env.supabaseServiceRoleKey),
    openAiKey: Boolean(env.openAiKey),
  };
  const configured = environment.supabaseUrl && environment.supabaseAnonKey && environment.supabaseServiceRoleKey;

  if (!configured) {
    return {
      app: "ok",
      environment,
      supabase: {
        configured: false,
        databaseReachable: false,
      },
    };
  }

  const database = await checkDatabase();

  return {
    app: "ok",
    environment,
    supabase: {
      configured: true,
      databaseReachable: database.reachable,
      ...(database.error ? { error: database.error } : {}),
    },
  };
}
