import { PrismaClient } from '@prisma/client'

export type ModelNames = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$extends'
  | 'types'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
>

export type PrismaModelDelegate<T extends ModelNames> =
  T extends keyof PrismaClient ? PrismaClient[T] : never
