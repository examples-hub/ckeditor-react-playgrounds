export function createUploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        // const body = new FormData();
        loader.file.then((file) => {
          console.log('uploadAdapter上传前就可以获取文件信息, ', file);

          // body.append('files', file);
          // let headers = new Headers();
          // headers.append("Origin", "http://localhost:3000");

          // fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
          //   method: 'post',
          //   body: body,
          //   credentials: 'include',
          //   mode: 'cors',
          // })
          //   .then((res) => res.json())
          //   .then((res) => {
          //     resolve({
          //       default: `${API_URL}/${res.filename}`,
          //     });
          //   })
          //   .catch((err) => {
          //     reject(err);
          //   });

          const fileReader = new FileReader();

          // fileReader.addEventListener('load', function () {
          //   // localStorage.setItem("img1", reader.result);
          //   // document.getElementById('imgViewer').src = localStorage.getItem('img1')
          //   resolve({
          //     default: `${fileReader.result}`,
          //   });
          // });

          fileReader.onload = function () {
            resolve({
              default: `${fileReader.result}`,
            });
          };

          fileReader.readAsDataURL(file);
        });
      });
    },
  };
}

export function ImgUploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return createUploadAdapter(loader);
  };
}
