/* eslint-disable @typescript-eslint/consistent-type-definitions */
import Ajv from 'ajv'

type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null'

export interface JsonSchemaPropertyBase {
  type?: PropertyType | PropertyType[]
}

export interface JsonSchemaString extends JsonSchemaPropertyBase {
  type: 'string'
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: string[]
  format?:
    | 'date-time'
    | 'time'
    | 'date'
    | 'email'
    | 'hostname'
    | 'ipv4'
    | 'ipv6'
    | 'uri'
    | 'iri'
    | 'regex'
}

export interface JsonSchemaNumber extends JsonSchemaPropertyBase {
  type: 'number'
  multipleOf?: number
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
}

export interface JsonSchemaObject extends JsonSchemaPropertyBase {
  type: 'object'
  additionalProperties?: JsonSchemaProperty
  required?: string[]
  propertyNames?: {
    pattern: string
  }
  minProperties?: number
  maxProperties?: number
  properties?: {
    [key: string]: JsonSchemaProperty | undefined
  }
  dependencies?: {
    [key: string]: string[] | undefined
  }
}

export interface JsonSchemaArray extends JsonSchemaPropertyBase {
  type: 'array'
  minItems?: number
  maxItems?: number
  uniqueItems?: true
  required?: string[]
  additionalItems?: false | JsonSchemaProperty
  items?: JsonSchemaProperty | JsonSchemaProperty[]
}

export type JsonSchemaProperty =
  | true
  | false
  | JsonSchemaString
  | JsonSchemaNumber
  | JsonSchemaObject
  | JsonSchemaArray
  | { type: 'boolean' }
  | { type: 'null' }

export interface CustomValidator<D extends {}> extends Ajv.ValidateFunction {
  (
    data: any,
    dataPath?: string,
    parentData?: object | any[],
    parentDataProperty?: string | number,
    rootData?: object | any[],
  ): data is D
}
