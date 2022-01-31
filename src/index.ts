import { addDays, differenceInCalendarDays } from 'date-fns'
import { JSDOM } from 'jsdom'
import axios, { AxiosRequestConfig } from 'axios'
import { endpoints, fetchOptions } from './constants.js'
import { dateFormatter, parseDate } from './formatAndParseDate.js'
import { IndexName } from './indexList'

// get all data between provided dates
async function getTriData({
  indexName,
  startDate,
  endDate,
}: {
  indexName: IndexName
  startDate?: string
  endDate?: string
}) {
  const startDateFinal = startDate ? parseDate(startDate) : new Date(1992, 0, 1)
  const endDateFinal = endDate ? parseDate(endDate) : new Date()

  const allStageDates = allDatesBetween(startDateFinal, endDateFinal, 364)

  const allFetchPromises = allStageDates.map(([sDate, eDate]) =>
    makeTriFetch({ indexName, startDate: sDate, endDate: eDate }),
  )

  const responses = await Promise.all(allFetchPromises)

  const bodies = responses.map(res => res.data)
  let allText = ''
  bodies.forEach(body => {
    const dom = new JSDOM(`<!DOCTYPE html>${body}`)
    const dataText =
      dom.window.document.getElementById('csvContentDiv')?.textContent
    if (dataText) {
      const cleaned = dataText
        .replace(/:/g, '\n')
        .replace(/"/g, '')
        .split('\n')
        .slice(1)
        .join('\n')
      allText = allText + cleaned
    }
  })
  return allText
}

// get all dates between start and end if they are more than 364 days apart
function allDatesBetween(startDate: Date, endDate: Date, gap: number) {
  const diff = differenceInCalendarDays(endDate, startDate)

  const stages = Math.ceil(diff / gap)
  console.log({ diff, stages, startDate, endDate })
  const stageDates = []

  let dateCurrent = startDate
  for (let i = 0; i < stages; i++) {
    stageDates.push([
      dateFormatter(dateCurrent),
      dateFormatter(addDays(dateCurrent, gap)),
    ])
    // if start date of the next stage is the same as end date of the current stage
    // we will get repeated values from the server
    dateCurrent = addDays(dateCurrent, gap + 1)
  }
  return stageDates
}

interface TriFetchInput {
  indexName: IndexName
  startDate: string
  endDate: string
}

// gap between startDate and endDate must be <=364
function makeTriFetch({ indexName, startDate, endDate }: TriFetchInput) {
  return axios(
    encodeURI(
      `${endpoints.totalReturnsIndexURL}?indexType=${indexName}&fromDate=${startDate}&toDate=${endDate}`,
    ),
    fetchOptions,
  )
}
