const { ImagePool } = require('@squoosh/lib');
const { cpus } = require('os');
const { readFileSync, mkdirSync, existsSync, writeFileSync, readdirSync } = require('fs');
const { join, extname } = require('path');
require("dotenv").config({ path: '.env' });

const imagePool = new ImagePool(cpus().length);

const preprocessOptions = {
    //When both width and height are specified, the image resized to specified size.
    // resize: {
    //     width: 100,
    //     height: 50,
    // },
};

let inputDir = join(__dirname, process.env.INPUTPATH);
let outPutDir = join(__dirname, process.env.OUTPUTPATH);

let fileList = readdirSync(inputDir);

let total = fileList.length;
let done = 0;

if (fileList.length > 0) {
    fileList.forEach(item => {
        imgHandle(item);
    })
    // imagePool.close();
} else {
    imagePool.close();
}

async function imgHandle(fileName) {
    let file = readFileSync(join(inputDir, fileName));
    let image = imagePool.ingestImage(file);

    let encodeOptions = {};
    let extName = extname(fileName);
    // console.log(extName);
    switch (extName) {
        case '.jpg':
            encodeOptions['mozjpeg'] = { quality: 79 };
            break;
        case '.jpeg':
            encodeOptions['mozjpeg'] = { quality: 79 };
            break;
        case '.png':
            encodeOptions['oxipng'] = { quality: 79 };
            break;
        default:
            break;
    }
    await image.encode(encodeOptions);
    await image.preprocess(preprocessOptions);

    saveFile(fileName, image);
}

function saveFile(fileName, image) {
    done++;
    console.log(`压缩${fileName},进度${((done / total) * 100).toFixed(0)}%`);

    Object.values(image.encodedWith).forEach((fileItem) => {
        // console.log(fileItem);
        fileItem.then(res => {
            writeFileSync(join(outPutDir, fileName), res.binary);
        })
    })

    if (total <= done) {
        console.log(`压缩完成...即将退出`);
        setTimeout(() => {
            imagePool.close();
        }, 2000);
    }
}
