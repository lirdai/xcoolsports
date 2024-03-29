const countryCode = [
  {
    "short": "CN",
    "name": "中国大陆",
    "en": "China",
    "tel": "86",
    "pinyin": "zg"
  },
  {
      "short": "HK",
      "name": "中国香港",
      "en": "Hongkong",
      "tel": "852",
      "pinyin": "zgxg"
  },
  {
      "short": "MO",
      "name": "中国澳门",
      "en": "Macao",
      "tel": "853",
      "pinyin": "zgam"
  },
  {
      "short": "TW",
      "name": "中国台湾",
      "en": "Taiwan",
      "tel": "886",
      "pinyin": "zgtw"
  },
  {
    "short": "AD",
    "name": "安道尔共和国",
    "en": "Andorra",
    "tel": "376",
    "pinyin": "adeghg"
  },
  {
    "short": "AE",
    "name": "阿拉伯联合酋长国",
    "en": "UnitedArabEmirates",
    "tel": "971",
    "pinyin": "alblhqzg"
  },
  {
    "short": "AF",
    "name": "阿富汗",
    "en": "Afghanistan",
    "tel": "93",
    "pinyin": "afh"
  },
  {
    "short": "AG",
    "name": "安提瓜和巴布达",
    "en": "AntiguaandBarbuda",
    "tel": "1268",
    "pinyin": "atghbbd"
  },
  {
    "short": "AI",
    "name": "安圭拉岛",
    "en": "Anguilla",
    "tel": "1264",
    "pinyin": "agld"
  },
  {
    "short": "AL",
    "name": "阿尔巴尼亚",
    "en": "Albania",
    "tel": "355",
    "pinyin": "aebny"
  },
  {
    "short": "AM",
    "name": "阿美尼亚",
    "en": "Armenia",
    "tel": "374",
    "pinyin": "amny"
  },
  {
    "short": "",
    "name": "阿森松",
    "en": "Ascension",
    "tel": "247",
    "pinyin": "als"
  },
  {
    "short": "AO",
    "name": "安哥拉",
    "en": "Angola",
    "tel": "244",
    "pinyin": "agl"
  },
  {
    "short": "AR",
    "name": "阿根廷",
    "en": "Argentina",
    "tel": "54",
    "pinyin": "agt"
  },
  {
    "short": "AT",
    "name": "奥地利",
    "en": "Austria",
    "tel": "43",
    "pinyin": "adl"
  },
  {
    "short": "AU",
    "name": "澳大利亚",
    "en": "Australia",
    "tel": "61",
    "pinyin": "adly"
  },
  {
    "short": "AZ",
    "name": "阿塞拜疆",
    "en": "Azerbaijan",
    "tel": "994",
    "pinyin": "asbj"
  },
  {
    "short": "BB",
    "name": "巴巴多斯",
    "en": "Barbados",
    "tel": "1246",
    "pinyin": "bbds"
  },
  {
    "short": "BD",
    "name": "孟加拉国",
    "en": "Bangladesh",
    "tel": "880",
    "pinyin": "mjlg"
  },
  {
    "short": "BE",
    "name": "比利时",
    "en": "Belgium",
    "tel": "32",
    "pinyin": "bls"
  },
  {
    "short": "BF",
    "name": "布基纳法索",
    "en": "Burkina-faso",
    "tel": "226",
    "pinyin": "bjnfs"
  },
  {
    "short": "BG",
    "name": "保加利亚",
    "en": "Bulgaria",
    "tel": "359",
    "pinyin": "bjly"
  },
  {
    "short": "BH",
    "name": "巴林",
    "en": "Bahrain",
    "tel": "973",
    "pinyin": "bl"
  },
  {
    "short": "BI",
    "name": "布隆迪",
    "en": "Burundi",
    "tel": "257",
    "pinyin": "bld"
  },
  {
    "short": "BJ",
    "name": "贝宁",
    "en": "Benin",
    "tel": "229",
    "pinyin": "bl"
  },
  {
    "short": "BL",
    "name": "巴勒斯坦",
    "en": "Palestine",
    "tel": "970",
    "pinyin": "blst"
  },
  {
    "short": "BM",
    "name": "百慕大群岛",
    "en": "BermudaIs.",
    "tel": "1441",
    "pinyin": "bmdqd"
  },
  {
    "short": "BN",
    "name": "文莱",
    "en": "Brunei",
    "tel": "673",
    "pinyin": "wl"
  },
  {
    "short": "BO",
    "name": "玻利维亚",
    "en": "Bolivia",
    "tel": "591",
    "pinyin": "blwy"
  },
  {
    "short": "BR",
    "name": "巴西",
    "en": "Brazil",
    "tel": "55",
    "pinyin": "bx"
  },
  {
    "short": "BS",
    "name": "巴哈马",
    "en": "Bahamas",
    "tel": "1242",
    "pinyin": "bhm"
  },
  {
    "short": "BW",
    "name": "博茨瓦纳",
    "en": "Botswana",
    "tel": "267",
    "pinyin": "bcwn"
  },
  {
    "short": "BY",
    "name": "白俄罗斯",
    "en": "Belarus",
    "tel": "375",
    "pinyin": "bels"
  },
  {
    "short": "BZ",
    "name": "伯利兹",
    "en": "Belize",
    "tel": "501",
    "pinyin": "blz"
  },
  {
    "short": "CA",
    "name": "加拿大",
    "en": "Canada",
    "tel": "1",
    "pinyin": "jnd"
  },
  {
    "short": "",
    "name": "开曼群岛",
    "en": "CaymanIs.",
    "tel": "1345",
    "pinyin": "kmqd"
  },
  {
    "short": "CF",
    "name": "中非共和国",
    "en": "CentralAfricanRepublic",
    "tel": "236",
    "pinyin": "zfghg"
  },
  {
    "short": "CG",
    "name": "刚果",
    "en": "Congo",
    "tel": "242",
    "pinyin": "gg"
  },
  {
    "short": "CH",
    "name": "瑞士",
    "en": "Switzerland",
    "tel": "41",
    "pinyin": "rs"
  },
  {
    "short": "CK",
    "name": "库克群岛",
    "en": "CookIs.",
    "tel": "682",
    "pinyin": "kkqd"
  },
  {
    "short": "CL",
    "name": "智利",
    "en": "Chile",
    "tel": "56",
    "pinyin": "zl"
  },
  {
    "short": "CM",
    "name": "喀麦隆",
    "en": "Cameroon",
    "tel": "237",
    "pinyin": "kml"
  },
  {
    "short": "CO",
    "name": "哥伦比亚",
    "en": "Colombia",
    "tel": "57",
    "pinyin": "glby"
  },
  {
    "short": "CR",
    "name": "哥斯达黎加",
    "en": "CostaRica",
    "tel": "506",
    "pinyin": "gsdlj"
  },
  {
    "short": "CS",
    "name": "捷克",
    "en": "Czech",
    "tel": "420",
    "pinyin": "jk"
  },
  {
    "short": "CU",
    "name": "古巴",
    "en": "Cuba",
    "tel": "53",
    "pinyin": "gb"
  },
  {
    "short": "CY",
    "name": "塞浦路斯",
    "en": "Cyprus",
    "tel": "357",
    "pinyin": "spls"
  },
  {
    "short": "DE",
    "name": "德国",
    "en": "Germany",
    "tel": "49",
    "pinyin": "dg"
  },
  {
    "short": "DJ",
    "name": "吉布提",
    "en": "Djibouti",
    "tel": "253",
    "pinyin": "jbt"
  },
  {
    "short": "DK",
    "name": "丹麦",
    "en": "Denmark",
    "tel": "45",
    "pinyin": "dm"
  },
  {
    "short": "DO",
    "name": "多米尼加共和国",
    "en": "DominicaRep.",
    "tel": "1890",
    "pinyin": "dmnjghg"
  },
  {
    "short": "DZ",
    "name": "阿尔及利亚",
    "en": "Algeria",
    "tel": "213",
    "pinyin": "aejly"
  },
  {
    "short": "EC",
    "name": "厄瓜多尔",
    "en": "Ecuador",
    "tel": "593",
    "pinyin": "egde"
  },
  {
    "short": "EE",
    "name": "爱沙尼亚",
    "en": "Estonia",
    "tel": "372",
    "pinyin": "asny"
  },
  {
    "short": "EG",
    "name": "埃及",
    "en": "Egypt",
    "tel": "20",
    "pinyin": "ej"
  },
  {
    "short": "ES",
    "name": "西班牙",
    "en": "Spain",
    "tel": "34",
    "pinyin": "xby"
  },
  {
    "short": "ET",
    "name": "埃塞俄比亚",
    "en": "Ethiopia",
    "tel": "251",
    "pinyin": "aseby"
  },
  {
    "short": "FI",
    "name": "芬兰",
    "en": "Finland",
    "tel": "358",
    "pinyin": "fl"
  },
  {
    "short": "FJ",
    "name": "斐济",
    "en": "Fiji",
    "tel": "679",
    "pinyin": "fj"
  },
  {
    "short": "FR",
    "name": "法国",
    "en": "France",
    "tel": "33",
    "pinyin": "fg"
  },
  {
    "short": "GA",
    "name": "加蓬",
    "en": "Gabon",
    "tel": "241",
    "pinyin": "jp"
  },
  {
    "short": "GB",
    "name": "英国",
    "en": "UnitedKiongdom",
    "tel": "44",
    "pinyin": "yg"
  },
  {
    "short": "GD",
    "name": "格林纳达",
    "en": "Grenada",
    "tel": "1809",
    "pinyin": "glnd"
  },
  {
    "short": "GE",
    "name": "格鲁吉亚",
    "en": "Georgia",
    "tel": "995",
    "pinyin": "gljy"
  },
  {
    "short": "GF",
    "name": "法属圭亚那",
    "en": "FrenchGuiana",
    "tel": "594",
    "pinyin": "fsgyn"
  },
  {
    "short": "GH",
    "name": "加纳",
    "en": "Ghana",
    "tel": "233",
    "pinyin": "jn"
  },
  {
    "short": "GI",
    "name": "直布罗陀",
    "en": "Gibraltar",
    "tel": "350",
    "pinyin": "zblt"
  },
  {
    "short": "GM",
    "name": "冈比亚",
    "en": "Gambia",
    "tel": "220",
    "pinyin": "gby"
  },
  {
    "short": "GN",
    "name": "几内亚",
    "en": "Guinea",
    "tel": "224",
    "pinyin": "jny"
  },
  {
    "short": "GR",
    "name": "希腊",
    "en": "Greece",
    "tel": "30",
    "pinyin": "xl"
  },
  {
    "short": "GT",
    "name": "危地马拉",
    "en": "Guatemala",
    "tel": "502",
    "pinyin": "wdml"
  },
  {
    "short": "GU",
    "name": "关岛",
    "en": "Guam",
    "tel": "1671",
    "pinyin": "gd"
  },
  {
    "short": "GY",
    "name": "圭亚那",
    "en": "Guyana",
    "tel": "592",
    "pinyin": "gyn"
  },
  {
    "short": "HN",
    "name": "洪都拉斯",
    "en": "Honduras",
    "tel": "504",
    "pinyin": "hdls"
  },
  {
    "short": "HT",
    "name": "海地",
    "en": "Haiti",
    "tel": "509",
    "pinyin": "hd"
  },
  {
    "short": "HU",
    "name": "匈牙利",
    "en": "Hungary",
    "tel": "36",
    "pinyin": "xyl"
  },
  {
    "short": "ID",
    "name": "印度尼西亚",
    "en": "Indonesia",
    "tel": "62",
    "pinyin": "ydnxy"
  },
  {
    "short": "IE",
    "name": "爱尔兰",
    "en": "Ireland",
    "tel": "353",
    "pinyin": "ael"
  },
  {
    "short": "IL",
    "name": "以色列",
    "en": "Israel",
    "tel": "972",
    "pinyin": "ysl"
  },
  {
    "short": "IN",
    "name": "印度",
    "en": "India",
    "tel": "91",
    "pinyin": "yd"
  },
  {
    "short": "IQ",
    "name": "伊拉克",
    "en": "Iraq",
    "tel": "964",
    "pinyin": "ylk"
  },
  {
    "short": "IR",
    "name": "伊朗",
    "en": "Iran",
    "tel": "98",
    "pinyin": "yl"
  },
  {
    "short": "IS",
    "name": "冰岛",
    "en": "Iceland",
    "tel": "354",
    "pinyin": "bd"
  },
  {
    "short": "IT",
    "name": "意大利",
    "en": "Italy",
    "tel": "39",
    "pinyin": "ydl"
  },
  {
    "short": "",
    "name": "科特迪瓦",
    "en": "IvoryCoast",
    "tel": "225",
    "pinyin": "ktdw"
  },
  {
    "short": "JM",
    "name": "牙买加",
    "en": "Jamaica",
    "tel": "1876",
    "pinyin": "ymj"
  },
  {
    "short": "JO",
    "name": "约旦",
    "en": "Jordan",
    "tel": "962",
    "pinyin": "yd"
  },
  {
    "short": "JP",
    "name": "日本",
    "en": "Japan",
    "tel": "81",
    "pinyin": "rb"
  },
  {
    "short": "KE",
    "name": "肯尼亚",
    "en": "Kenya",
    "tel": "254",
    "pinyin": "kny"
  },
  {
    "short": "KG",
    "name": "吉尔吉斯坦",
    "en": "Kyrgyzstan",
    "tel": "331",
    "pinyin": "jejst"
  },
  {
    "short": "KH",
    "name": "柬埔寨",
    "en": "Kampuchea(Cambodia)",
    "tel": "855",
    "pinyin": "jpz"
  },
  {
    "short": "KP",
    "name": "朝鲜",
    "en": "NorthKorea",
    "tel": "850",
    "pinyin": "cx"
  },
  {
    "short": "KR",
    "name": "韩国",
    "en": "Korea",
    "tel": "82",
    "pinyin": "hg"
  },
  {
    "short": "KT",
    "name": "科特迪瓦共和国",
    "en": "RepublicofIvoryCoast",
    "tel": "225",
    "pinyin": "ktdwghg"
  },
  {
    "short": "KW",
    "name": "科威特",
    "en": "Kuwait",
    "tel": "965",
    "pinyin": "kwt"
  },
  {
    "short": "KZ",
    "name": "哈萨克斯坦",
    "en": "Kazakstan",
    "tel": "327",
    "pinyin": "hskst"
  },
  {
    "short": "LA",
    "name": "老挝",
    "en": "Laos",
    "tel": "856",
    "pinyin": "lw"
  },
  {
    "short": "LB",
    "name": "黎巴嫩",
    "en": "Lebanon",
    "tel": "961",
    "pinyin": "lbn"
  },
  {
    "short": "LC",
    "name": "圣卢西亚",
    "en": "St.Lucia",
    "tel": "1758",
    "pinyin": "slxy"
  },
  {
    "short": "LI",
    "name": "列支敦士登",
    "en": "Liechtenstein",
    "tel": "423",
    "pinyin": "lzdsd"
  },
  {
    "short": "LK",
    "name": "斯里兰卡",
    "en": "SriLanka",
    "tel": "94",
    "pinyin": "sllk"
  },
  {
    "short": "LR",
    "name": "利比里亚",
    "en": "Liberia",
    "tel": "231",
    "pinyin": "lbly"
  },
  {
    "short": "LS",
    "name": "莱索托",
    "en": "Lesotho",
    "tel": "266",
    "pinyin": "lst"
  },
  {
    "short": "LT",
    "name": "立陶宛",
    "en": "Lithuania",
    "tel": "370",
    "pinyin": "ltw"
  },
  {
    "short": "LU",
    "name": "卢森堡",
    "en": "Luxembourg",
    "tel": "352",
    "pinyin": "lsb"
  },
  {
    "short": "LV",
    "name": "拉脱维亚",
    "en": "Latvia",
    "tel": "371",
    "pinyin": "ltwy"
  },
  {
    "short": "LY",
    "name": "利比亚",
    "en": "Libya",
    "tel": "218",
    "pinyin": "lby"
  },
  {
    "short": "MA",
    "name": "摩洛哥",
    "en": "Morocco",
    "tel": "212",
    "pinyin": "mlg"
  },
  {
    "short": "MC",
    "name": "摩纳哥",
    "en": "Monaco",
    "tel": "377",
    "pinyin": "mng"
  },
  {
    "short": "MD",
    "name": "摩尔多瓦",
    "en": "Moldova,Republicof",
    "tel": "373",
    "pinyin": "medw"
  },
  {
    "short": "MG",
    "name": "马达加斯加",
    "en": "Madagascar",
    "tel": "261",
    "pinyin": "mdjsj"
  },
  {
    "short": "ML",
    "name": "马里",
    "en": "Mali",
    "tel": "223",
    "pinyin": "ml"
  },
  {
    "short": "MM",
    "name": "缅甸",
    "en": "Burma",
    "tel": "95",
    "pinyin": "md"
  },
  {
    "short": "MN",
    "name": "蒙古",
    "en": "Mongolia",
    "tel": "976",
    "pinyin": "mg"
  },
  {
    "short": "MS",
    "name": "蒙特塞拉特岛",
    "en": "MontserratIs",
    "tel": "1664",
    "pinyin": "mtsstd"
  },
  {
    "short": "MT",
    "name": "马耳他",
    "en": "Malta",
    "tel": "356",
    "pinyin": "met"
  },
  {
    "short": "",
    "name": "马里亚那群岛",
    "en": "MarianaIs",
    "tel": "1670",
    "pinyin": "mlynqd"
  },
  {
    "short": "",
    "name": "马提尼克",
    "en": "Martinique",
    "tel": "596",
    "pinyin": "mtnk"
  },
  {
    "short": "MU",
    "name": "毛里求斯",
    "en": "Mauritius",
    "tel": "230",
    "pinyin": "mlqs"
  },
  {
    "short": "MV",
    "name": "马尔代夫",
    "en": "Maldives",
    "tel": "960",
    "pinyin": "medf"
  },
  {
    "short": "MW",
    "name": "马拉维",
    "en": "Malawi",
    "tel": "265",
    "pinyin": "mlw"
  },
  {
    "short": "MX",
    "name": "墨西哥",
    "en": "Mexico",
    "tel": "52",
    "pinyin": "mxg"
  },
  {
    "short": "MY",
    "name": "马来西亚",
    "en": "Malaysia",
    "tel": "60",
    "pinyin": "mlxy"
  },
  {
    "short": "MZ",
    "name": "莫桑比克",
    "en": "Mozambique",
    "tel": "258",
    "pinyin": "msbk"
  },
  {
    "short": "NA",
    "name": "纳米比亚",
    "en": "Namibia",
    "tel": "264",
    "pinyin": "nmby"
  },
  {
    "short": "NE",
    "name": "尼日尔",
    "en": "Niger",
    "tel": "977",
    "pinyin": "nre"
  },
  {
    "short": "NG",
    "name": "尼日利亚",
    "en": "Nigeria",
    "tel": "234",
    "pinyin": "nrly"
  },
  {
    "short": "NI",
    "name": "尼加拉瓜",
    "en": "Nicaragua",
    "tel": "505",
    "pinyin": "njlg"
  },
  {
    "short": "NL",
    "name": "荷兰",
    "en": "Netherlands",
    "tel": "31",
    "pinyin": "hl"
  },
  {
    "short": "NO",
    "name": "挪威",
    "en": "Norway",
    "tel": "47",
    "pinyin": "nw"
  },
  {
    "short": "NP",
    "name": "尼泊尔",
    "en": "Nepal",
    "tel": "977",
    "pinyin": "nbe"
  },
  {
    "short": "",
    "name": "荷属安的列斯",
    "en": "NetheriandsAntilles",
    "tel": "599",
    "pinyin": "hsadls"
  },
  {
    "short": "NR",
    "name": "瑙鲁",
    "en": "Nauru",
    "tel": "674",
    "pinyin": "nl"
  },
  {
    "short": "NZ",
    "name": "新西兰",
    "en": "NewZealand",
    "tel": "64",
    "pinyin": "xxl"
  },
  {
    "short": "OM",
    "name": "阿曼",
    "en": "Oman",
    "tel": "968",
    "pinyin": "am"
  },
  {
    "short": "PA",
    "name": "巴拿马",
    "en": "Panama",
    "tel": "507",
    "pinyin": "bnm"
  },
  {
    "short": "PE",
    "name": "秘鲁",
    "en": "Peru",
    "tel": "51",
    "pinyin": "bl"
  },
  {
    "short": "PF",
    "name": "法属玻利尼西亚",
    "en": "FrenchPolynesia",
    "tel": "689",
    "pinyin": "fsblnxy"
  },
  {
    "short": "PG",
    "name": "巴布亚新几内亚",
    "en": "PapuaNewCuinea",
    "tel": "675",
    "pinyin": "bbyxjny"
  },
  {
    "short": "PH",
    "name": "菲律宾",
    "en": "Philippines",
    "tel": "63",
    "pinyin": "flb"
  },
  {
    "short": "PK",
    "name": "巴基斯坦",
    "en": "Pakistan",
    "tel": "92",
    "pinyin": "bjst"
  },
  {
    "short": "PL",
    "name": "波兰",
    "en": "Poland",
    "tel": "48",
    "pinyin": "bl"
  },
  {
    "short": "PR",
    "name": "波多黎各",
    "en": "PuertoRico",
    "tel": "1787",
    "pinyin": "bdlg"
  },
  {
    "short": "PT",
    "name": "葡萄牙",
    "en": "Portugal",
    "tel": "351",
    "pinyin": "pty"
  },
  {
    "short": "PY",
    "name": "巴拉圭",
    "en": "Paraguay",
    "tel": "595",
    "pinyin": "blg"
  },
  {
    "short": "QA",
    "name": "卡塔尔",
    "en": "Qatar",
    "tel": "974",
    "pinyin": "kte"
  },
  {
    "short": "",
    "name": "留尼旺",
    "en": "Reunion",
    "tel": "262",
    "pinyin": "lnw"
  },
  {
    "short": "RO",
    "name": "罗马尼亚",
    "en": "Romania",
    "tel": "40",
    "pinyin": "lmny"
  },
  {
    "short": "RU",
    "name": "俄罗斯",
    "en": "Russia",
    "tel": "7",
    "pinyin": "els"
  },
  {
    "short": "SA",
    "name": "沙特阿拉伯",
    "en": "SaudiArabia",
    "tel": "966",
    "pinyin": "stalb"
  },
  {
    "short": "SB",
    "name": "所罗门群岛",
    "en": "SolomonIs",
    "tel": "677",
    "pinyin": "slmqd"
  },
  {
    "short": "SC",
    "name": "塞舌尔",
    "en": "Seychelles",
    "tel": "248",
    "pinyin": "sse"
  },
  {
    "short": "SD",
    "name": "苏丹",
    "en": "Sudan",
    "tel": "249",
    "pinyin": "sd"
  },
  {
    "short": "SE",
    "name": "瑞典",
    "en": "Sweden",
    "tel": "46",
    "pinyin": "rd"
  },
  {
    "short": "SG",
    "name": "新加坡",
    "en": "Singapore",
    "tel": "65",
    "pinyin": "xjp"
  },
  {
    "short": "SI",
    "name": "斯洛文尼亚",
    "en": "Slovenia",
    "tel": "386",
    "pinyin": "slwny"
  },
  {
    "short": "SK",
    "name": "斯洛伐克",
    "en": "Slovakia",
    "tel": "421",
    "pinyin": "slfk"
  },
  {
    "short": "SL",
    "name": "塞拉利昂",
    "en": "SierraLeone",
    "tel": "232",
    "pinyin": "slla"
  },
  {
    "short": "SM",
    "name": "圣马力诺",
    "en": "SanMarino",
    "tel": "378",
    "pinyin": "smln"
  },
  {
    "short": "",
    "name": "东萨摩亚(美)",
    "en": "SamoaEastern",
    "tel": "684",
    "pinyin": "dsmym"
  },
  {
    "short": "",
    "name": "西萨摩亚",
    "en": "SanMarino",
    "tel": "685",
    "pinyin": "xsmy"
  },
  {
    "short": "SN",
    "name": "塞内加尔",
    "en": "Senegal",
    "tel": "221",
    "pinyin": "snje"
  },
  {
    "short": "SO",
    "name": "索马里",
    "en": "Somali",
    "tel": "252",
    "pinyin": "sml"
  },
  {
    "short": "SR",
    "name": "苏里南",
    "en": "Suriname",
    "tel": "597",
    "pinyin": "sln"
  },
  {
    "short": "ST",
    "name": "圣多美和普林西比",
    "en": "SaoTomeandPrincipe",
    "tel": "239",
    "pinyin": "sdmhplxb"
  },
  {
    "short": "SV",
    "name": "萨尔瓦多",
    "en": "EISalvador",
    "tel": "503",
    "pinyin": "sewd"
  },
  {
    "short": "SY",
    "name": "叙利亚",
    "en": "Syria",
    "tel": "963",
    "pinyin": "xly"
  },
  {
    "short": "SZ",
    "name": "斯威士兰",
    "en": "Swaziland",
    "tel": "268",
    "pinyin": "swsl"
  },
  {
    "short": "TD",
    "name": "乍得",
    "en": "Chad",
    "tel": "235",
    "pinyin": "zd"
  },
  {
    "short": "TG",
    "name": "多哥",
    "en": "Togo",
    "tel": "228",
    "pinyin": "dg"
  },
  {
    "short": "TH",
    "name": "泰国",
    "en": "Thailand",
    "tel": "66",
    "pinyin": "tg"
  },
  {
    "short": "TJ",
    "name": "塔吉克斯坦",
    "en": "Tajikstan",
    "tel": "992",
    "pinyin": "tjkst"
  },
  {
    "short": "TM",
    "name": "土库曼斯坦",
    "en": "Turkmenistan",
    "tel": "993",
    "pinyin": "tkmst"
  },
  {
    "short": "TN",
    "name": "突尼斯",
    "en": "Tunisia",
    "tel": "216",
    "pinyin": "tns"
  },
  {
    "short": "TO",
    "name": "汤加",
    "en": "Tonga",
    "tel": "676",
    "pinyin": "tj"
  },
  {
    "short": "TR",
    "name": "土耳其",
    "en": "Turkey",
    "tel": "90",
    "pinyin": "teq"
  },
  {
    "short": "TT",
    "name": "特立尼达和多巴哥",
    "en": "TrinidadandTobago",
    "tel": "1809",
    "pinyin": "tlndhdbg"
  },
  {
    "short": "TZ",
    "name": "坦桑尼亚",
    "en": "Tanzania",
    "tel": "255",
    "pinyin": "tsny"
  },
  {
    "short": "UA",
    "name": "乌克兰",
    "en": "Ukraine",
    "tel": "380",
    "pinyin": "wkl"
  },
  {
    "short": "UG",
    "name": "乌干达",
    "en": "Uganda",
    "tel": "256",
    "pinyin": "wgd"
  },
  {
    "short": "US",
    "name": "美国",
    "en": "UnitedStatesofAmerica",
    "tel": "1",
    "pinyin": "mg"
  },
  {
    "short": "UY",
    "name": "乌拉圭",
    "en": "Uruguay",
    "tel": "598",
    "pinyin": "wlg"
  },
  {
    "short": "UZ",
    "name": "乌兹别克斯坦",
    "en": "Uzbekistan",
    "tel": "233",
    "pinyin": "wzbkst"
  },
  {
    "short": "VC",
    "name": "圣文森特岛",
    "en": "SaintVincent",
    "tel": "1784",
    "pinyin": "swstd"
  },
  {
    "short": "VE",
    "name": "委内瑞拉",
    "en": "Venezuela",
    "tel": "58",
    "pinyin": "wnrl"
  },
  {
    "short": "VN",
    "name": "越南",
    "en": "Vietnam",
    "tel": "84",
    "pinyin": "yn"
  },
  {
    "short": "YE",
    "name": "也门",
    "en": "Yemen",
    "tel": "967",
    "pinyin": "ym"
  },
  {
    "short": "YU",
    "name": "南斯拉夫",
    "en": "Yugoslavia",
    "tel": "381",
    "pinyin": "nslf"
  },
  {
    "short": "ZA",
    "name": "南非",
    "en": "SouthAfrica",
    "tel": "27",
    "pinyin": "nf"
  },
  {
    "short": "ZM",
    "name": "赞比亚",
    "en": "Zambia",
    "tel": "260",
    "pinyin": "zby"
  },
  {
    "short": "ZR",
    "name": "扎伊尔",
    "en": "Zaire",
    "tel": "243",
    "pinyin": "zye"
  },
  {
    "short": "ZW",
    "name": "津巴布韦",
    "en": "Zimbabwe",
    "tel": "263",
    "pinyin": "jbbw"
  }
]

export default countryCode;