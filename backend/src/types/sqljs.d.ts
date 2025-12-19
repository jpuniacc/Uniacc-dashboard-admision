// Declaración de tipos para sql.js
declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): void
    exec(sql: string, params?: any[]): QueryExecResult[]
    export(): Uint8Array
    close(): void
  }

  export interface QueryExecResult {
    columns: string[]
    values: any[][]
  }

  export default function initSqlJs(options?: any): Promise<SqlJsStatic>

  export interface SqlJsStatic {
    Database: {
      new (data?: Uint8Array): Database
    }
  }
}

