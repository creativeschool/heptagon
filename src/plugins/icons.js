const iconMap = new Map()

/**
 * @param {string[]} exts
 * @param {string} icon
 */
const add = (exts, icon) => {
  exts.forEach(ext => iconMap.set(ext, icon))
}

[
  [['xlsx', 'xls', 'csv', 'tsv'], 'mdi-file-excel'],
  [['pptx', 'ppt', 'pptm', 'potx', 'potm', 'ppsx', 'ppsm', 'pps', 'ppam', 'ppa'], 'mdi-file-powerpoint'],
  [['doc', 'docx', 'rtf'], 'mdi-file-word'],
  [['png', 'jpeg', 'jpg', 'gif', 'ico', 'tif', 'tiff', 'psd', 'psb', 'ami', 'apx', 'bmp', 'bpg', 'brk', 'cur', 'dds', 'dng', 'exr', 'fpx', 'gbr', 'img', 'jbig2', 'jb2', 'jng', 'jxr', 'pbm', 'pgf', 'pic', 'raw', 'webp', 'eps'], 'mdi-image'],
  [['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'gifv', 'avi', 'mov', 'qt', 'wmv', 'yuv', 'rm', 'rmvb', 'mp4', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm2v'], 'mdi-video']
].forEach(a => add(...a))

/**
 * @param {string} type
 * @returns {string}
 */
export const fileIcon = type => {
  return iconMap.get(type) || 'mdi-pound'
}
