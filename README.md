# CKEditor 阿里云上传适配器插件

1. 您需要创建[CKEditor](https://ckeditor.com/docs/ckeditor5/latest/index.html)的自定义版本。
2. 将此插件注册到您的自定义版本中

## 1.创建自己的CKEditor

有关更多详细信息，请查看此[官方教程](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html)。

```bash
git clone -b stable https://github.com/ckeditor/ckeditor5-build-classic.git
cd ckeditor5-build-classic
yarn install
```

或者使用[官方在线定制](https://ckeditor.com/ckeditor-5/online-builder/)

在安装此插件之前，您可以使用默认设置测试自己的版本。

```bash
yarn build
```

构建完成后，您将在`build`文件夹中获得一个自定义CKEditor 。

打开`sample/index.html`查看效果

## 2.安装此插件

在您的自定义`CKEditor`构建中，将此插件安装在程序包管理器中。

```bash
yarn add ali-ckeditor-upload
or
npm install ali-ckeditor-upload
```

修改`node_modules\ali-ckeditor-upload\index.js`,输入阿里云`OSS`的相关信息,参考[文档](https://help.aliyun.com/document_detail/64047.html?spm=a2c4g.11186623.6.1306.155479f889gf86)

```js
const config = {
	// region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
    region: '<Your region>',
    accessKeyId: '<Your AccessKeyId>',
    accessKeySecret: '<Your AccessKeySecret>',
 	bucket: 'Your bucket name'
    // 您保存的在OSS的文件路径
	savePath: "images/",
};
```

转到`src/ckeditor.js`，进行以下更改以加载此插件。

```diff
+import AliUploadAdapter from "ali-ckeditor-upload";

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	...,
+	AliUploadAdapter
];

// Editor configuration.
ClassicEditor.defaultConfig = {...};
```

如果您在中进行任何更改`src/ckeditor.js`，则必须重新构建。

```bash
yarn build
```

## 故障排除

### ckeditor复制模块

1. 请确保您的自定义CKEditor 5构建依赖项版本 `>= 19.0.0`

2. 更新/检查依赖关系后，尝试为您创建一个干净的CKEditor 5

   ```
   	rm -rf node_modules && yarn install 
   	yarn build
   ```

   

3. 使用`npm ls`，搜索`@ckeditor`以查看是否存在重复的模块

4. 如果问题仍然存在，请阅读[官方文档](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/error-codes.html#error-ckeditor-duplicated-modules)

