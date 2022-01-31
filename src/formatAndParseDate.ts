import { format, parse } from 'date-fns'

export const dateFormatter = (dt: Date): string => format(dt, 'dd-MM-yyyy')

export const parseDate = (dtstr: string): Date =>
  parse(dtstr, 'dd-MM-yyyy', new Date())
