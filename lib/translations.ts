export type Language = "en" | "ckb" | "ar"

export interface Translations {
  title: string
  description: string
  uploadFiles: string
  configureComparison: string
  viewResults: string
  file1: string
  file2: string
  uploadFirst: string
  uploadSecond: string
  darkMode: string
  lightMode: string
  systemMode: string
  selectLanguage: string
  toggleTheme: string
  english: string
  kurdish: string
  arabic: string
  rows: string
  columns: string
  changeFile: string
  processing: string
  dropHere: string
  dragDrop: string
  supports: string
  browseFiles: string
  fileEmpty: string
  failedProcess: string
  selectComparisonColumns: string
  comparisonDescription: string
  comparisonDirection: string
  eachRecordFrom: string
  willBeSearched: string
  usingIntelligent: string
  searchColumnFrom: string
  source: string
  matchAgainstColumn: string
  target: string
  selectColumnPlaceholder: string
  additionalColumnsOutput: string
  additionalColumnsDescription: string
  additionalColumnsFrom: string
  readyToCompare: string
  readyDescription: string
  startComparison: string
  processingComparison: string
  complete: string
  percentComplete: string
  fuzzyMatchPreview: string
  previewDescription: string
  match: string
  processingBackground: string
  matchesFound: string
  notFoundIn: string
  neverMatched: string
  matchedRecords: string
  matchedDescription: string
  downloadMatches: string
  noMatchesFound: string
  recordsFrom: string
  notMatchedDescription: string
  downloadUnmatched: string
  unusedRecords: string
  unusedDescription: string
  downloadUnused: string
  noUniqueRecords: string
  initializingFuzzy: string
  preparingSearch: string
  settingUpFuse: string
  processingRecords: string
  processed: string
  finalizingResults: string
  wordCountComparison: string
  compareFirst: string
  words: string
  originalWordCount: string
  all: string
}

export const translations: Record<Language, Translations> = {
  en: {
    title: "Excel File Comparison Tool",
    description: "Upload two Excel files and compare data with intelligent fuzzy matching. Perfect for business users who need reliable data analysis.",
    uploadFiles: "Upload Files",
    configureComparison: "Configure Comparison",
    viewResults: "View Results",
    file1: "File 1",
    file2: "File 2",
    uploadFirst: "Upload your first Excel or CSV file",
    uploadSecond: "Upload your second Excel or CSV file",
    darkMode: "Dark",
    lightMode: "Light",
    systemMode: "System",
    selectLanguage: "Language",
    toggleTheme: "Toggle theme",
    english: "English",
    kurdish: "Kurdish (Sorani)",
    arabic: "Arabic",
    rows: "rows",
    columns: "columns",
    changeFile: "Change File",
    processing: "Processing file...",
    dropHere: "Drop the file here",
    dragDrop: "Drag & drop your file here",
    supports: "Supports Excel (.xlsx, .xls) and CSV files",
    browseFiles: "Browse Files",
    fileEmpty: "File appears to be empty",
    failedProcess: "Failed to process file",
    selectComparisonColumns: "Select Comparison Columns",
    comparisonDescription: "Choose which columns to compare between the two files. The comparison will use fuzzy matching to find similar data with intelligent scoring.",
    comparisonDirection: "Comparison Direction",
    eachRecordFrom: "Each record from",
    willBeSearched: "will be searched for matches in",
    usingIntelligent: "using intelligent fuzzy matching.",
    searchColumnFrom: "Search Column from",
    source: "Source",
    matchAgainstColumn: "Match Against Column from",
    target: "Target",
    selectColumnPlaceholder: "Select column to compare",
    additionalColumnsOutput: "Additional Columns for Output",
    additionalColumnsDescription: "Select additional columns to include in the comparison results and download files.",
    additionalColumnsFrom: "Additional columns from",
    readyToCompare: "Ready to Compare",
    readyDescription: "Click the button below to start the fuzzy matching comparison between your files.",
    startComparison: "Start Comparison",
    processingComparison: "Processing comparison...",
    complete: "Complete!",
    percentComplete: "complete",
    fuzzyMatchPreview: "Fuzzy Match Preview",
    previewDescription: "Here's a sample of what Fuse.js is finding while processing...",
    match: "match",
    processingBackground: "Processing continues in background...",
    matchesFound: "Matches Found",
    notFoundIn: "Not Found in",
    neverMatched: "Never Matched",
    matchedRecords: "Matched Records",
    matchedDescription: "Records found in both files using fuzzy matching",
    downloadMatches: "Download Matches",
    noMatchesFound: "No matches found",
    recordsFrom: "Records from",
    notMatchedDescription: "These records from your source file had no fuzzy matches in the target file",
    downloadUnmatched: "Download Unmatched from",
    unusedRecords: "Unused Records from",
    unusedDescription: "These records from your target file were never matched against any source records",
    downloadUnused: "Download Unused from",
    noUniqueRecords: "No unique records found",
    initializingFuzzy: "Initializing fuzzy search...",
    preparingSearch: "Preparing search data...",
    settingUpFuse: "Setting up Fuse.js fuzzy matcher...",
    processingRecords: "Processing records...",
    processed: "Processed",
    finalizingResults: "Finalizing results...",
    wordCountComparison: "Word Count Comparison",
    compareFirst: "Compare first",
    words: "words",
    originalWordCount: "Original Word Count",
    all: "All",
  },
  ckb: {
    title: "ئامرازی بەراوردکردنی فایلی ئێکسڵ",
    description: "دوو فایلی ئێکسڵ باربکە و داتاکان بەراورد بکە بە بەکارهێنانی هاوتای فەزی ژیر. گونجاوە بۆ بەکارهێنەرانی کار کە پێویستیان بە شیکردنەوەی داتای جێی متمانە هەیە.",
    uploadFiles: "بارکردنی فایلەکان",
    configureComparison: "ڕێکخستنی بەراوردکاری",
    viewResults: "بینینی ئەنجامەکان",
    file1: "فایلی ١",
    file2: "فایلی ٢",
    uploadFirst: "یەکەم فایلی ئێکسڵ یان CSV باربکە",
    uploadSecond: "دووەم فایلی ئێکسڵ یان CSV باربکە",
    darkMode: "تاریک",
    lightMode: "ڕووناک",
    systemMode: "سیستەم",
    selectLanguage: "زمان",
    toggleTheme: "گۆڕینی تێم",
    english: "ئینگلیزی",
    kurdish: "کوردی (سۆرانی)",
    arabic: "عەرەبی",
    rows: "ڕیزەکان",
    columns: "ستوونەکان",
    changeFile: "گۆڕینی فایل",
    processing: "فایلەکە پڕۆسێس دەکرێت...",
    dropHere: "فایلەکە لێرە دابنێ",
    dragDrop: "فایلەکەت ڕابکێشە و لێرە دایبنێ",
    supports: "پشتگیری فایلی ئێکسڵ (.xlsx, .xls) و CSV دەکات",
    browseFiles: "گەڕان لە فایلەکان",
    fileEmpty: "فایلەکە وا دیارە بەتاڵە",
    failedProcess: "شکستی هێنا لە پڕۆسێسکردنی فایلەکە",
    selectComparisonColumns: "ستوونەکانی بەراوردکاری هەڵبژێرە",
    comparisonDescription: "هەڵبژێرە کام ستوونانە بەراورد بکرێن لە نێوان هەردوو فایلەکەدا. بەراوردکارییەکە هاوتای فەزی بەکاردێنێت بۆ دۆزینەوەی داتای هاوشێوە بە نمرەی ژیر.",
    comparisonDirection: "ئاراستەی بەراوردکاری",
    eachRecordFrom: "هەر تۆمارێک لە",
    willBeSearched: "دەگەڕێدرێت بۆ هاوتاکانی لە",
    usingIntelligent: "بە بەکارهێنانی هاوتای فەزی ژیر.",
    searchColumnFrom: "ستوونی گەڕان لە",
    source: "سەرچاوە",
    matchAgainstColumn: "بەراوردکردن لەگەڵ ستوونی",
    target: "ئامانج",
    selectColumnPlaceholder: "ستوونێک هەڵبژێرە بۆ بەراوردکردن",
    additionalColumnsOutput: "ستوونی زیادە بۆ دەرەنجام",
    additionalColumnsDescription: "ستوونی زیادە هەڵبژێرە بۆ ئەوەی بخرێتە ناو ئەنجامەکانی بەراوردکاری و فایلە داگیراوەکان.",
    additionalColumnsFrom: "ستوونی زیادە لە",
    readyToCompare: "ئامادەیە بۆ بەراوردکردن",
    readyDescription: "بۆ دەستپێکردنی بەراوردکاری هاوتای فەزی لە نێوان فایلەکانتدا، کلیک لە دوگمەی خوارەوە بکە.",
    startComparison: "دەستپێکردنی بەراوردکاری",
    processingComparison: "بەراوردکاری پڕۆسێس دەکرێت...",
    complete: "تەواو بوو!",
    percentComplete: "تەواو بووە",
    fuzzyMatchPreview: "پێشبینی هاوتای فەزی",
    previewDescription: "ئەمە نموونەیەکە لەوەی Fuse.js دەیدۆزێتەوە لە کاتی پڕۆسێسکردندا...",
    match: "هاوتا",
    processingBackground: "پڕۆسێسکردن لە پاشبنەمادا بەردەوامە...",
    matchesFound: "هاوتا دۆزراوەکان",
    notFoundIn: "نەدۆزرایەوە لە",
    neverMatched: "قەت هاوتای نەبووە",
    matchedRecords: "تۆمارە هاوتاکان",
    matchedDescription: "تۆمارەکان لە هەردوو فایلەکەدا دۆزراونەتەوە بە بەکارهێنانی هاوتای فەزی",
    downloadMatches: "داگرتنی هاوتاکان",
    noMatchesFound: "هیچ هاوتایەک نەدۆزرایەوە",
    recordsFrom: "تۆمارەکان لە",
    notMatchedDescription: "ئەم تۆمارانە لە فایلی سەرچاوەکەتەوە هیچ هاوتایەکی فەزییان نەبووە لە فایلی ئامانجدا",
    downloadUnmatched: "داگرتنی نەدۆزراوەکان لە",
    unusedRecords: "تۆمارە بەکارنەهاتووەکان لە",
    unusedDescription: "ئەم تۆمارانە لە فایلی ئامانجەکەتەوە قەت بەراورد نەکراون لەگەڵ هیچ تۆمارێکی سەرچاوە",
    downloadUnused: "داگرتنی بەکارنەهاتووەکان لە",
    noUniqueRecords: "هیچ تۆمارێکی بێهاوتا نەدۆزرایەوە",
    initializingFuzzy: "گەڕانی فەزی دەستپێدەکات...",
    preparingSearch: "ئامادەکردنی داتای گەڕان...",
    settingUpFuse: "ڕێکخستنی Fuse.js...",
    processingRecords: "پڕۆسێسکردنی تۆمارەکان...",
    processed: "پڕۆسێس کراوە",
    finalizingResults: "تەواوکردنی ئەنجامەکان...",
    wordCountComparison: "بەراوردکاری ژمارەی وشە",
    compareFirst: "بەراوردکردنی یەکەم",
    words: "وشە",
    originalWordCount: "ژمارەی وشەی ڕەسەن",
    all: "هەموو",
  },
  ar: {
    title: "أداة مقارنة ملفات إكسل",
    description: "قم بتحميل ملفي إكسل ومقارنة البيانات باستخدام المطابقة التقريبية الذكية. مثالي لمستخدمي الأعمال الذين يحتاجون إلى تحليل بيانات موثوق.",
    uploadFiles: "تحميل الملفات",
    configureComparison: "تكوين المقارنة",
    viewResults: "عرض النتائج",
    file1: "الملف ١",
    file2: "الملف ٢",
    uploadFirst: "قم بتحميل أول ملف إكسل أو CSV",
    uploadSecond: "قم بتحميل ملف إكسل أو CSV الثاني",
    darkMode: "داكن",
    lightMode: "فاتح",
    systemMode: "النظام",
    selectLanguage: "اللغة",
    toggleTheme: "تغيير المظهر",
    english: "الإنجليزية",
    kurdish: "الكردية (سوراني)",
    arabic: "العربية",
    rows: "صفوف",
    columns: "أعمدة",
    changeFile: "تغيير الملف",
    processing: "جاري معالجة الملف...",
    dropHere: "أفلت الملف هنا",
    dragDrop: "اسحب وأفلت ملفك هنا",
    supports: "يدعم ملفات Excel (.xlsx, .xls) و CSV",
    browseFiles: "تصفح الملفات",
    fileEmpty: "يبدو أن الملف فارغ",
    failedProcess: "فشل في معالجة الملف",
    selectComparisonColumns: "حدد أعمدة المقارنة",
    comparisonDescription: "اختر الأعمدة التي تريد مقارنتها بين الملفين. ستستخدم المقارنة المطابقة التقريبية للعثور على بيانات مماثلة مع تسجيل ذكي.",
    comparisonDirection: "اتجاه المقارنة",
    eachRecordFrom: "كل سجل من",
    willBeSearched: "سيتم البحث عن مطابقات له في",
    usingIntelligent: "باستخدام المطابقة التقريبية الذكية.",
    searchColumnFrom: "عمود البحث من",
    source: "المصدر",
    matchAgainstColumn: "مطابقة مع عمود من",
    target: "الهدف",
    selectColumnPlaceholder: "حدد العمود للمقارنة",
    additionalColumnsOutput: "أعمدة إضافية للمخرجات",
    additionalColumnsDescription: "حدد أعمدة إضافية لتضمينها في نتائج المقارنة وملفات التحميل.",
    additionalColumnsFrom: "أعمدة إضافية من",
    readyToCompare: "جاهز للمقارنة",
    readyDescription: "انقر على الزر أدناه لبدء مقارنة المطابقة التقريبية بين ملفاتك.",
    startComparison: "بدء المقارنة",
    processingComparison: "جاري معالجة المقارنة...",
    complete: "اكتمل!",
    percentComplete: "مكتمل",
    fuzzyMatchPreview: "معاينة المطابقة التقريبية",
    previewDescription: "هذه عينة مما يجده Fuse.js أثناء المعالجة...",
    match: "مطابقة",
    processingBackground: "تستمر المعالجة في الخلفية...",
    matchesFound: "تم العثور على مطابقات",
    notFoundIn: "لم يتم العثور عليه في",
    neverMatched: "لم يتطابق أبداً",
    matchedRecords: "السجلات المتطابقة",
    matchedDescription: "السجلات الموجودة في كلا الملفين باستخدام المطابقة التقريبية",
    downloadMatches: "تحميل المطابقات",
    noMatchesFound: "لم يتم العثور على مطابقات",
    recordsFrom: "سجلات من",
    notMatchedDescription: "هذه السجلات من ملف المصدر الخاص بك لم يكن لها مطابقات تقريبية في ملف الهدف",
    downloadUnmatched: "تحميل غير المتطابق من",
    unusedRecords: "سجلات غير مستخدمة من",
    unusedDescription: "هذه السجلات من ملف الهدف الخاص بك لم يتم مطابقتها أبداً مع أي سجلات مصدر",
    downloadUnused: "تحميل غير المستخدم من",
    noUniqueRecords: "لم يتم العثور على سجلات فريدة",
    initializingFuzzy: "بدء البحث التقريبي...",
    preparingSearch: "تحضير بيانات البحث...",
    settingUpFuse: "إعداد Fuse.js...",
    processingRecords: "معالجة السجلات...",
    processed: "تمت معالجتها",
    finalizingResults: "نهائي النتائج...",
    wordCountComparison: "مقارنة عدد الكلمات",
    compareFirst: "مقارنة أول",
    words: "كلمات",
    originalWordCount: "عدد الكلمات الأصلي",
    all: "الكل",
  },
}
