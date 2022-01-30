import fs from 'fs'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { format, addDays, differenceInCalendarDays } from 'date-fns'
import { fetchOptions, endpoints, indices } from './constants.js'

const today = new Date()
const oldest = new Date(1992, 0, 1)

// const years = Math.ceil((today - oldest) / oneYear)

// console.log(years)
const ourDateFormatter = dt => format(dt, 'dd-MM-yyyy')

const dateArray = []

let dateCurrent = oldest
while (differenceInCalendarDays(today, dateCurrent) > 0) {
  dateArray.push([
    ourDateFormatter(dateCurrent),
    ourDateFormatter(addDays(dateCurrent, 364)),
  ])
  dateCurrent = addDays(dateCurrent, 364)
}

console.log(dateArray)

const allFetchPromises = dateArray.map(([startDate, endDate]) =>
  fetch(
    encodeURI(
      `${endpoints.totalReturnsIndexURL}?indexType=${indices.nifty100LowVolatility30}&fromDate=${startDate}&toDate=${endDate}`,
    ),
    fetchOptions,
  ),
)
let allText = ''

Promise.all(allFetchPromises).then(responses => {
  const allResPromises = responses.map(res => res.text())

  Promise.all(allResPromises)
    .then(bodies => {
      console.log(bodies.length)
      bodies.forEach(body => {
        const dom = new JSDOM(`<!DOCTYPE html>${body}`)
        const dataText =
          dom.window.document.getElementById('csvContentDiv')?.textContent
        if (dataText) {
          const cleaned = dataText.replaceAll(':', '\n')
          console.log('then body')
          allText = allText + '\n' + cleaned
        }
      })
    })
    .then(() => {
      fs.writeFileSync('all.txt', allText)
    })
})
