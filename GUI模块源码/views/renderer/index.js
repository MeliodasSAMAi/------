window.electronAPI.emptyDir('./uploads');

const uppy = new Uppy.Core({
    debug: true,
    locale: Uppy.locales.zh_CN,
    restrictions: {
        maxFileSize: 1024 * 1024 * 1024,
        maxNumberOfFiles: 50,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/jpg', 'image/png','image/jpeg']
    },
})
    .use(Uppy.Dashboard, {
        inline: true,
        target: '#drag-drop-area',
        width:800,
        height:560
    })

uppy.on('complete', (result) => {
    // console.log('Upload complete! We’ve uploaded these files:', result.successful);
    result.successful.forEach((item, i) => {
        console.log(item, i);
        window.electronAPI.upload(JSON.stringify({
            name: item.name,
            size: item.size,
            type: item.type,
            source: item.source,
            id: item.id,
            extension: item.extension,
            path: item.data.path,
            lastModified: item.data.lastModified,
            lastModifiedDate: item.data.lastModifiedDate
        }));
    })
    uppy.reset();
    window.electronAPI.pageResult();
    window.electronAPI.compress_start();
})
