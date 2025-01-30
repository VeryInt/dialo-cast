import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import type {
    TypedArray,
    DocumentInitParameters,
    PDFDocumentProxy,
    PDFPageProxy,
    TextContent,
} from 'pdfjs-dist/types/src/display/api'
import _ from 'lodash'

// reference: https://github.com/mozilla/pdf.js/blob/master/examples/node/getinfo.mjs

// import pdfjs from 'pdfjs-dist'
const pdfworker = require('./lib/pdf.worker.mjs')

pdfjs.GlobalWorkerOptions.workerSrc = `./lib/pdf.worker.mjs`

const readPDF = async (src?: string | URL | TypedArray | ArrayBuffer | DocumentInitParameters) => {
    const loadingTask = getDocument(src)
    const doc = await (new Promise((resolve, reject) => {
        loadingTask.promise.then(doc => {
            resolve(doc)
        })
    }) as Promise<PDFDocumentProxy>)
    const numPages = doc.numPages
    const pages = []
    for (let i = 1; i <= numPages; i++) {
        const pageContent = await loadPage(i, doc)
        pages.push(`Page ${i} \n${pageContent}`)
    }
    console.log('# End of Document')

    console.log(`pages`, pages.join('\n'))
    return pages.join('\n')
}

export default readPDF

const loadPage = async (pageNum: number, doc: PDFDocumentProxy) => {
    const pdfPage = await (new Promise((resolve, reject) => {
        doc.getPage(pageNum).then(page => {
            resolve(page)
        })
    }) as Promise<PDFPageProxy>)

    console.log('# Page ' + pageNum)
    const viewport = pdfPage.getViewport({ scale: 1.0 })
    console.log('Size: ' + viewport.width + 'x' + viewport.height)
    console.log()
    const content = await (new Promise((resolve, reject) => {
        pdfPage.getTextContent().then(content => {
            resolve(content)
        })
    }) as Promise<TextContent>)

    // Content contains lots of information about the text layout and
    // styles, but we need only strings at the moment
    const lines: string[] = []
    let lastLineTrans = '',
        thisLineContent = '',
        lastLinePos = 0,
        thisLineContentList: { xPos: number; str: string }[] = []
    _.each(content?.items, (item: Record<string, any>) => {
        const { transform, str } = item || {}
        const thisLineTrans = transform
            .slice(0, 4)
            .concat([transform[transform.length - 1]])
            .join(',')
        const theYPos = transform[5]
        const theXPos = transform[4]

        // if(lastLineTrans != thisLineTrans){
        //     lastLineTrans = thisLineTrans
        //     lines.push(thisLineContent)
        //     thisLineContent = str;
        // }else{
        //     thisLineContent += str;
        // }

        if (lastLinePos == theYPos) {
            thisLineContentList.push({
                str,
                xPos: theXPos,
            })
        } else {
            lines.push(_.map(_.sortBy(thisLineContentList, 'xPos'), 'str').join(''))
            thisLineContentList = []
            lastLinePos = theYPos
        }

        return item.str
    })
    pdfPage.cleanup()
    const pageContent = lines.join('\n\n\n')

    return pageContent
}
