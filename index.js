import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";
import OSS from "ali-oss";

const config = {
  region: "<Your region>",
  accessKeyId: "<Your AccessKeyId>",
  accessKeySecret: "<Your AccessKeySecret>",
  bucket: "Your bucket name",
  savePath: "images/",
};

const client = new OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket,
});

const random_string = function (len) {
  len = len || 32;
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

const today = function () {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  return year + "-" + month + "-" + date;
};

const imgPath = function (img) {
  img = img || ".png";
  let path = config.savePath + today() + "/";
  let name = random_string() + img;
  return path + name;
};

export default class AliUploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return "ali-ckeditor-upload";
  }

  init() {
    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new Adapter(loader);
    };
  }
}

/**
 * Upload adapter.
 *
 * @private
 */

class Adapter {
  constructor(loader) {
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  async _initListeners(resolve, reject, file) {
    try {
      let name = imgPath(file.name);
      let url = `http://${config.bucket}.${config.region}.aliyuncs.com/` + name;
      let result = await client.multipartUpload(name, file, {
        progress: function (p) {
          // console.log(Math.round(p * 100));
        },
      });
      resolve({
        default: url,
      });
    } catch (e) {
      console.log(e);
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append("upload", file);
  }
}
