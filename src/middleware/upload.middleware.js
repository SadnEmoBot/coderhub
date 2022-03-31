const multer = require('koa-multer');
const path = require('path');
const Jimp = require('jimp');


const avatarUpload = multer({
    dest: './upload/avatar'
})
const avatarHandler = avatarUpload.single('avatar')


const picArrUpload = multer({
    dest: './upload/pic'
})
const picArrHandler = picArrUpload.array('picture', 9)


const picResize = async (ctx, next) => {
    try {
        // 1. 获取所有的图像信息
        const files = ctx.req.files;
        // 2. 对图像进行处理(sharp -> 太大了, jimp)
        for (let file of files) {
            const destPath = path.join(file.destination, file.filename);
            Jimp.read(file.path).then(image => {
                image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
                image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
                image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
            })
        }

        await next();
    } catch (error) {
        console.log(error);
   }
}


module.exports = {
    avatarHandler, picArrHandler, picResize
}