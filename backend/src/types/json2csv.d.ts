// Declaración de tipos para json2csv
declare module 'json2csv' {
  export interface ParserOptions {
    fields?: string[] | FieldInfo[]
    delimiter?: string
    quote?: string
    escapedQuote?: string
    eol?: string
    header?: boolean
    includeEmptyRows?: boolean
    withBOM?: boolean
  }

  export interface FieldInfo {
    label?: string
    value: string | ((row: any) => any)
    default?: string
  }

  export class Parser {
    constructor(opts?: ParserOptions)
    parse(data: any[]): string
  }
}

