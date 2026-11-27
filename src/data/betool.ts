export interface BeToolEntry {
  title: string;
  href: string;
  icon: string;
  description: string;
}

interface BeToolCategory {
  id: string;
  name: string;
  tools: BeToolEntry[];
}

export const BETOOL_BASIC_TOOLS = ["urlencode", "base64", "uuid"] as const;

export type BeToolLocalTool = (typeof BETOOL_BASIC_TOOLS)[number];

export const BETOOL_CATEGORIES: BeToolCategory[] = [
  {
    id: "cate_2",
    name: "开发运维",
    tools: [
      {
        title: "随机密码生成",
        href: "/randompassword/",
        icon: "keywords.png",
        description: "密码生成器、随机字符串生成,批量生成",
      },
      {
        title: "URL编码/解码",
        href: "/urlencode/",
        icon: "url.png",
        description: "URL在线编码解码工具（UrlEncode编码 和 UrlDecode解码）",
      },
      {
        title: "UUID生成器",
        href: "/uuid/",
        icon: "uuid.png",
        description: "批量生成UUID",
      },
      {
        title: "时间戳转换",
        href: "/timetran/",
        icon: "Time.png",
        description: "在线时间戳转换工具以及获取当前时间戳",
      },
      {
        title: "MD5在线加密",
        href: "/MD5/",
        icon: "md5.png",
        description: "MD5在线加密,长度包含32位、16位",
      },
      {
        title: "Json在线转换",
        href: "/json/",
        icon: "json.png",
        description: "提供实时编辑和预览JSON 数据，语法高亮、校验、格式化、转义，去转义、压缩等功能，可以提高阅读修改的效率和准确性",
      },
      {
        title: "正则测试工具",
        href: "/reg/",
        icon: "reg.png",
        description: "正则表达式测试工具, 常用正则表达式",
      },
      {
        title: "Unicode转中文",
        href: "/unicode/",
        icon: "union.png",
        description: "Unicode和中文的相互转换",
      },
      {
        title: "HTTP状态码",
        href: "/HttpStatusCode/",
        icon: "http_code.png",
        description: "http状态对应的名称和含义解释",
      },
      {
        title: "JWT解析",
        href: "/jwt/",
        icon: "jwt_parse.png",
        description: "解析和解码JSON Web Token（jwt）",
      },
      {
        title: "html实体转义",
        href: "/HtmlEntity/",
        icon: "HtmlEntity.png",
        description: "html实体转义，实体转义成html",
      },
      {
        title: "js代码格式化/压缩",
        href: "/JSForamt/",
        icon: "JSForamt.png",
        description: "JS格式化/压缩工具,提供在线JS格式化、JS压缩、JS混淆、JS解密",
      },
      {
        title: "Html代码格式化",
        href: "/HtmlFormat/",
        icon: "HtmlFormat.png",
        description: "提供在线html、xml格式化",
      },
      {
        title: "Css代码格式化/压缩",
        href: "/CssFormat/",
        icon: "CssFormat.png",
        description: "css格式化/压缩工具,提供在线css格式化、css压缩",
      },
      {
        title: "Base64加解密",
        href: "/base64/",
        icon: "Base64.svg",
        description: "在线Base64加解密工具，支持文本的Base64编码和解码",
      },
      {
        title: "进制转换计算器",
        href: "/baseconverter/",
        icon: "scaletran.png",
        description: "在线进制转换计算器，支持二进制、八进制、十进制、十六进制等多种进制之间的相互转换",
      },
      {
        title: "数据存储单位换算",
        href: "/storageconverter/",
        icon: "storageconverter.svg",
        description: "在线数据存储单位换算工具，支持字节、KB、MB、GB、TB、PB、EB等存储单位之间的相互转换",
      },
      {
        title: "Hash计算器",
        href: "/hashcalculator/",
        icon: "hashcalculator.svg",
        description: "在线Hash计算器，支持MD5、SHA-1、SHA-256、SHA-384、SHA-512等多种哈希算法",
      },
      {
        title: "XML格式化",
        href: "/xmlformat/",
        icon: "xmlformat.svg",
        description: "在线XML格式化工具，用于美化和压缩XML代码，支持自定义缩进大小",
      },
      {
        title: "SQL格式化",
        href: "/sqlformat/",
        icon: "sqlformat.svg",
        description: "在线SQL格式化工具，用于美化和压缩SQL代码，支持自定义缩进大小",
      },
    ],
  },
  {
    id: "cate_5",
    name: "图片处理",
    tools: [
      {
        title: "二维码生成",
        href: "/qrcode/",
        icon: "qrcode.png",
        description: "在线生成带logo、透明、艺术的二维码",
      },
      {
        title: "二合一收款码",
        href: "/payqrcode/",
        icon: "payqrcode.svg",
        description: "将支付宝和微信收款码合成为一张图片",
      },
      {
        title: "在线图片处理",
        href: "/signimage/",
        icon: "img.png",
        description: "在线图片裁剪，图片标注，图片滤镜，图片画笔、图片旋转、图片文字等操作",
      },
      {
        title: "文本转图片",
        href: "/textToImg/",
        icon: "text_to_img.png",
        description: "把文本转换成图片，生成长图，具有超多个性文字排版",
      },
      {
        title: "图片分割",
        href: "/imgCut/",
        icon: "imgCut.png",
        description: "将图片分割成四宫格、九宫格、十六宫格，支持自定义行与列",
      },
      {
        title: "传图取色",
        href: "/imagecolorpicker/",
        icon: "imagecolorpicker.svg",
        description: "上传图片并点击图片获取颜色值",
      },
      {
        title: "图片水印添加",
        href: "/imagewatermark/",
        icon: "imagewatermark.svg",
        description: "上传图片并添加文字水印",
      },
      {
        title: "图片压缩",
        href: "/imagecompress/",
        icon: "image_compress.svg",
        description: "在线压缩图片大小，支持调节图片质量和尺寸，浏览器本地处理",
      },
      {
        title: "假图检测",
        href: "/imageauthenticity/",
        icon: "image_authenticity.svg",
        description: "使用 ELA 分析图片压缩差异，辅助发现 PS 修图和图片篡改痕迹，浏览器本地处理",
      },
    ],
  },
  {
    id: "cate_10",
    name: "PDF处理",
    tools: [
      {
        title: "合并 PDF",
        href: "/mergepdf/",
        icon: "pdf_merge.svg",
        description: "按顺序将多个 PDF 合并为一个文件，浏览器本地处理",
      },
      {
        title: "拆分 PDF",
        href: "/splitpdf/",
        icon: "pdf_split.svg",
        description: "按页码范围拆分 PDF，并打包下载独立页面",
      },
      {
        title: "整理PDF",
        href: "/managepdf/",
        icon: "pdf_pages.svg",
        description: "预览 PDF 页面，删除、提取或调整页面顺序",
      },
      {
        title: "旋转 PDF 页面",
        href: "/rotatepdf/",
        icon: "pdf_rotate.svg",
        description: "逐页或批量旋转 PDF 页面后导出",
      },
      {
        title: "压缩 PDF",
        href: "/compresspdf/",
        icon: "pdf_compress.svg",
        description: "调整图片质量，在浏览器本地压缩 PDF 文件",
      },
      {
        title: "图片转PDF",
        href: "/imagetopdf/",
        icon: "image_to_pdf.svg",
        description: "将多张 JPG 或 PNG 图片按顺序转换为 PDF",
      },
      {
        title: "PDF 转图片",
        href: "/pdftoimage/",
        icon: "pdf_to_image.svg",
        description: "将 PDF 每页转换为 JPG 或 PNG 图片并打包下载",
      },
    ],
  },
  {
    id: "cate_3",
    name: "文本处理",
    tools: [
      {
        title: "文本对比",
        href: "/diff/",
        icon: "diff.png",
        description: "文本差异比对支持中文、英文、代码比对",
      },
      {
        title: "markdown编辑器",
        href: "/markdown/",
        icon: "file-markdown-fill.png",
        description: "在线创建或编辑markdown, 实时预览，导出markdown",
      },
      {
        title: "字数统计",
        href: "/wordCount/",
        icon: "wordCount.png",
        description: "在线统计字符串的字数、段落、标点符号数量",
      },
      {
        title: "文本去重",
        href: "/textRemoveDuplicate/",
        icon: "textRemoveDuplicate.png",
        description: "可以删除或去除文本或字符串中的重复行",
      },
      {
        title: "ASCII字形生成器",
        href: "/asciiWordPic/",
        icon: "ascii_word_pic.png",
        description: "在线生成字形ASCII画",
      },
      {
        title: "在线文本编辑/HTML获取",
        href: "/textEdit/",
        icon: "richtextEditor.png",
        description: "在线富文本编辑, html实时预览，在线编辑文本，文本编辑获取html",
      },
      {
        title: "文本替换",
        href: "/textreplace/",
        icon: "textreplace.svg",
        description: "在线文本替换工具，支持普通文本和正则表达式替换，可用于批量修改文本内容",
      },
      {
        title: "文本处理工作流",
        href: "/textworkflow/",
        icon: "textworkflow.svg",
        description: "在线文本处理工作流工具，允许用户定义一系列文本处理步骤并按顺序执行",
      },
      {
        title: "词频统计",
        href: "/wordfrequency/",
        icon: "wordfrequency.svg",
        description: "在线词频统计工具，用于统计文本中单词出现的频率，可用于文本分析、关键词提取等场景",
      },
    ],
  },
  {
    id: "cate_4",
    name: "教育学术",
    tools: [
      {
        title: "单位换算",
        href: "/unit/",
        icon: "unit.png",
        description: "在线重量、长度、面积、时间、角度、速度、温度、压力、热量、功率等换算",
      },
      {
        title: "摩斯电码",
        href: "/morse/",
        icon: "medium.png",
        description: "支持中文的摩斯电码编码解码",
      },
      {
        title: "常用进制转换",
        href: "/scaletran/",
        icon: "scaletran.png",
        description: "在线进制转换工具,可在2到64进制之间相互转换",
      },
      {
        title: "ASCII码表",
        href: "/ascii/",
        icon: "ascii.png",
        description: "ASCII码表,控制代码、标准ASCII字符和非标准ASCII字符对照表",
      },
      {
        title: "长度单位转换",
        href: "/unit/?active=length",
        icon: "length.png",
        description: "长度转换工具-支持国际长度单位，中国传统长度单位，英制长度单位",
      },
      {
        title: "面积单位转换",
        href: "/unit/?active=area",
        icon: "area.png",
        description: "面积转换工具-支持国际面积单位，中国传统面积单位，英制面积单位",
      },
      {
        title: "重量单位转换",
        href: "/unit/?active=weight",
        icon: "weight.png",
        description: "重量转换工具-支持国际重量单位，中国传统重量单位，英制重量单位(常衡制和金衡制)",
      },
      {
        title: "时间单位转换",
        href: "/unit/?active=time",
        icon: "time_unit.png",
        description: "时间单位转换工具-支持国际时间单位",
      },
      {
        title: "温度单位转换",
        href: "/unit/?active=temperature",
        icon: "temperature.png",
        description: "温度单位转换工具-支持国际温度单位",
      },
      {
        title: "压力单位转换",
        href: "/unit/?active=pressure",
        icon: "pressure.png",
        description: "压力单位转换工具-Pa/kPa/hPa/MPa/bar/torr/psi等",
      },
      {
        title: "热量单位转换",
        href: "/unit/?active=heat",
        icon: "heat.png",
        description: "热量单位转换工具-Wh/mWh/kWh/MWh/J/kJ等",
      },
      {
        title: "功率单位转换",
        href: "/unit/?active=power",
        icon: "power.png",
        description: "功率单位转换工具-W/mW/kW/MW/GW等",
      },
    ],
  },
  {
    id: "cate_8",
    name: "数据图表",
    tools: [
      {
        title: "柱状图",
        href: "/bar/",
        icon: "bar.png",
        description: "在线制作柱状图，像做表格一样制作可视化图表，支持导出静态或动态图表",
      },
      {
        title: "折线图",
        href: "/line/",
        icon: "line.png",
        description: "在线制作折线图，像做表格一样制作可视化图表，支持导出静态或动态图表",
      },
      {
        title: "饼图",
        href: "/pie/",
        icon: "pie.png",
        description: "在线制作饼图，像做表格一样制作可视化图表，支持导出静态或动态图表",
      },
      {
        title: "散点图",
        href: "/scatter/",
        icon: "scatter.png",
        description: "在线制作散点图，像做表格一样制作可视化图表，支持导出静态或动态图表",
      },
      {
        title: "词云生成",
        href: "/wordcloud/",
        icon: "wordcloud.svg",
        description: "根据输入文本生成词云图，支持自定义词云形状和颜色",
      },
    ],
  },
  {
    id: "cate_9",
    name: "选择随机",
    tools: [
      {
        title: "生成随机数",
        href: "/random/",
        icon: "random.png",
        description: "可定制范围内进行随机数字，可用于抽奖、点名等用途",
      },
      {
        title: "帮我决定",
        href: "/decision/",
        icon: "choose.png",
        description: "选择困难，难以决定，今天吃什么，现在做什么，自定义选项都给你安排的明明白白",
      },
      {
        title: "抛硬币",
        href: "/coin/",
        icon: "coin.png",
        description: "在线抛硬币，选择困难那么交给硬币来帮你选择吧",
      },
      {
        title: "投骰子",
        href: "/dice/",
        icon: "dice.png",
        description: "在线投骰子，可自定义骰子数量，简单好用的骰子工具",
      },
      {
        title: "抽签工具",
        href: "/lottery/",
        icon: "lottery.svg",
        description: "输入多个选项，随机抽取一个或多个结果",
      },
      {
        title: "转盘工具",
        href: "/wheel/",
        icon: "wheel.svg",
        description: "自定义选项，旋转转盘随机选择结果",
      },
    ],
  },
  {
    id: "cate_7",
    name: "其他工具",
    tools: [
      {
        title: "数字转金额大写",
        href: "/numberToChinese/",
        icon: "numberToChinese.png",
        description: "在线数字一键转换成人民币大写，中文大写转换数字",
      },
      {
        title: "手持弹幕",
        href: "/barrage/",
        icon: "dm.png",
        description: "手持滚动弹幕",
      },
      {
        title: "色板",
        href: "/palettes/",
        icon: "palettes.png",
        description: "包含纯色、渐变与阶梯色和常用色彩组合",
      },
      {
        title: "Color选择器",
        href: "/ColorPicker/",
        icon: "color_picker.png",
        description: "颜色选择器、在各种颜色空间如十六进制、rgb、hsl、css等等之间转换颜色",
      },
      {
        title: "色板工具",
        href: "/colorpalette/",
        icon: "palettes.png",
        description: "提供各种颜色的色板，点击颜色可复制颜色值",
      },
      {
        title: "番茄时钟",
        href: "/pomodoro/",
        icon: "pomodoro.svg",
        description: "专注工作和休息的时间管理工具",
      },
      {
        title: "反应速度测试",
        href: "/reactiontest/",
        icon: "reactiontest.svg",
        description: "测试你的反应速度，点击变色的方块",
      },
      {
        title: "m3u8在线播放",
        href: "/m3u8player/",
        icon: "m3u8player.svg",
        description: "播放m3u8格式的视频流",
      },
      {
        title: "剪刀石头布",
        href: "/rockpaperscissors/",
        icon: "rockpaperscissors.svg",
        description: "与电脑对战的剪刀石头布游戏",
      },
      {
        title: "Emoji表情大全",
        href: "/emoji/",
        icon: "emoji.svg",
        description: "在线Emoji表情大全，提供各种分类的Emoji表情，点击即可复制到剪贴板",
      },
      {
        title: "简易计算器",
        href: "/calculator/",
        icon: "calculator.svg",
        description: "基本的加减乘除计算工具",
      },
    ],
  },
];

export const BETOOL_TOOLS = BETOOL_CATEGORIES.flatMap(({ id, tools }) =>
  tools.map((tool) => ({ ...tool, category: id, slug: tool.href.split("/")[1] })),
);

export const BETOOL_TOOL_SLUGS = [...new Set(BETOOL_TOOLS.map(({ slug }) => slug))];
