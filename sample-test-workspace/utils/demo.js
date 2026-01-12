/**
 * 安全下载文件
 * @param {*} fileUrl 文件地址
 * @param {*} fileName 文件名
 * @param {*} open 是否打开文件
 * @param {*} blank 是否在新窗口打开
 * @returns
 */
export default function safeDownload(
  fileUrl,
  fileName,
  open = false,
  blank = false
) {
  if (!fileUrl) {
    console.log("文件地址不可为空");
  }
  /**
   * common/file/getDownloadUrl 这个node接口返回的下载地址是http地址，需要转换为https地址
   */
  const processedUrl = fileUrl.replace(/^http:\/\//i, "https://");

  if (open) {
    window.open(processedUrl, blank ? "_blank" : "_self");
    return;
  }

  const link = document.createElement("a");
  link.href = processedUrl;
  if (fileName) {
    link.download = fileName;
  }
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
