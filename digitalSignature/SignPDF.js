const { PDFDocument } = require("pdf-lib");
const { writeFileSync } = require("fs");
const pdf2img = require("pdf-img-convert");

exports.signPDF = async (file, inputData) => {
  const pdfDoc = await PDFDocument.load(file.Body);
  const pages = pdfDoc.getPages();

  for (const input of inputData) {
    if (!input.x || !input.content) continue;

    const page = pages[input.pageNumber];
    const buffer = Buffer.from(input.content.split(",")[1], "base64");
    const pngImage = await pdfDoc.embedPng(buffer);

    const { width, height } = page.getSize();

    const clientWidth = input.imageWidth;
    const clientHeight = input.imageHeight;
    const widthRatio = width / clientWidth;
    const heightRatio = height / clientHeight;

    const offsetXRatio = width / height;
    const offsetYRatio = height / width;

    page.drawImage(pngImage, {
      x: input.x * offsetXRatio,
      y: height - input.y * offsetYRatio,
      width: input.width * widthRatio,
      height: input.height * heightRatio,
    });
  }

  for (const [index] of pages.entries()) {
    const tempDoc = await PDFDocument.create();
    const [copiedPage] = await tempDoc.copyPages(pdfDoc, [index]);

    tempDoc.addPage(copiedPage);
    writeFileSync(`signed-page-${index + 1}.pdf`, await tempDoc.save());
  }

  writeFileSync("signed.pdf", await pdfDoc.save());
  const base64Pages = await pdf2img.convert("signed.pdf", { base64: true });

  return base64Pages;
};
