/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEAD_WEBHOOK_URL?: string;
  readonly VITE_BOOKING_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
