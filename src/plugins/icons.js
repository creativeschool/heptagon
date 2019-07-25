export const fileIcon = type => {
  switch (type) {
    case 'xls':
    case 'xlsx':
      return 'mdi-file-excel'
    case 'ppt':
    case 'pptx':
      return 'mdi-file-powerpoint'
    case 'doc':
    case 'docx':
      return 'mdi-file-word'
    default:
      return 'mdi-pound'
  }
}
