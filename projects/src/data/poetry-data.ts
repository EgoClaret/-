// 古诗文知识图谱数据 - 基于《全唐诗》《全宋词》精选
import type { Poet, Work, Imagery, Allusion } from '@/types';

// 诗人数据
export const poets: Poet[] = [
  {
    id: 'p1',
    name: '李白',
    dynasty: '唐',
    years: '701-762',
    courtesyName: '太白',
    pseudonym: '青莲居士、谪仙人',
    birthplace: '陇西成纪',
    style: '豪放飘逸',
    achievements: '诗仙，浪漫主义诗人代表'
  },
  {
    id: 'p2',
    name: '杜甫',
    dynasty: '唐',
    years: '712-770',
    courtesyName: '子美',
    pseudonym: '少陵野老',
    birthplace: '河南巩县',
    style: '沉郁顿挫',
    achievements: '诗圣，现实主义诗人代表'
  },
  {
    id: 'p3',
    name: '白居易',
    dynasty: '唐',
    years: '772-846',
    courtesyName: '乐天',
    pseudonym: '香山居士',
    birthplace: '山西太原',
    style: '平易近人',
    achievements: '新乐府运动领袖'
  },
  {
    id: 'p4',
    name: '王维',
    dynasty: '唐',
    years: '701-761',
    courtesyName: '摩诘',
    pseudonym: '诗佛',
    birthplace: '山西祁县',
    style: '诗中有画',
    achievements: '山水田园诗人代表'
  },
  {
    id: 'p5',
    name: '苏轼',
    dynasty: '宋',
    years: '1037-1101',
    courtesyName: '子瞻',
    pseudonym: '东坡居士',
    birthplace: '四川眉山',
    style: '豪放旷达',
    achievements: '豪放派词人代表'
  },
  {
    id: 'p6',
    name: '辛弃疾',
    dynasty: '宋',
    years: '1140-1207',
    courtesyName: '幼安',
    pseudonym: '稼轩',
    birthplace: '山东济南',
    style: '慷慨悲壮',
    achievements: '爱国词人'
  },
  {
    id: 'p7',
    name: '李清照',
    dynasty: '宋',
    years: '1084-1155',
    courtesyName: '易安居士',
    birthplace: '山东济南',
    style: '婉约清新',
    achievements: '婉约派词人代表'
  },
  {
    id: 'p8',
    name: '柳永',
    dynasty: '宋',
    years: '984-1053',
    courtesyName: '耆卿',
    pseudonym: '柳三变',
    birthplace: '福建崇安',
    style: '婉约细腻',
    achievements: '婉约派词人，慢词开拓者'
  },
  {
    id: 'p9',
    name: '王之涣',
    dynasty: '唐',
    years: '688-742',
    birthplace: '山西太原',
    style: '雄浑壮阔',
    achievements: '边塞诗人'
  },
  {
    id: 'p10',
    name: '李商隐',
    dynasty: '唐',
    years: '813-858',
    courtesyName: '义山',
    pseudonym: '玉溪生',
    birthplace: '河南沁阳',
    style: '隐晦迷离',
    achievements: '晚唐诗坛代表'
  }
];

// 作品数据
export const works: Work[] = [
  {
    id: 'w1',
    title: '将进酒',
    author: '李白',
    dynasty: '唐',
    content: [
      '君不见，黄河之水天上来，奔流到海不复回。',
      '君不见，高堂明镜悲白发，朝如青丝暮成雪。',
      '人生得意须尽欢，莫使金樽空对月。',
      '天生我材必有用，千金散尽还复来。',
      '烹羊宰牛且为乐，会须一饮三百杯。',
      '岑夫子，丹丘生，将进酒，杯莫停。',
      '与君歌一曲，请君为我倾耳听。',
      '钟鼓馔玉不足贵，但愿长醉不复醒。',
      '古来圣贤皆寂寞，惟有饮者留其名。',
      '陈王昔时宴平乐，斗酒十千恣欢谑。',
      '主人何为言少钱，径须沽取对君酌。',
      '五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。'
    ],
    theme: ['咏怀', '饮酒'],
    emotion: ['豪放', '悲愤', '旷达'],
    imagery: ['黄河', '酒', '白发', '明月'],
    allusions: ['陈王宴平乐'],
    appreciation: '此诗为李白长安放还以后所作，思想内容非常深沉。诗人豪饮高歌，借酒消愁，抒发了忧愤深广的人生感慨。全诗气势豪迈，感情豪放，言语流畅，具有极强的感染力，是李白"借题发挥"借酒消愁的千古名篇。'
  },
  {
    id: 'w2',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: [
      '床前明月光，',
      '疑是地上霜。',
      '举头望明月，',
      '低头思故乡。'
    ],
    theme: ['思乡'],
    emotion: ['惆怅', '思乡'],
    imagery: ['明月', '霜'],
    appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天忙于事务，还冲淡了离愁，到了夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。'
  },
  {
    id: 'w3',
    title: '登高',
    author: '杜甫',
    dynasty: '唐',
    content: [
      '风急天高猿啸哀，渚清沙白鸟飞回。',
      '无边落木萧萧下，不尽长江滚滚来。',
      '万里悲秋常作客，百年多病独登台。',
      '艰难苦恨繁霜鬓，潦倒新停浊酒杯。'
    ],
    theme: ['登高', '悲秋'],
    emotion: ['沉郁', '悲凉', '忧国'],
    imagery: ['秋风', '落叶', '长江', '白发'],
    appreciation: '此诗作于大历二年（767）秋，当时杜甫寓居夔州。全诗通过登高所见秋江景色，倾诉了诗人长年漂泊、老病孤愁的复杂感情，慷慨激越，动人心弦。杨伦称赞此诗为"杜集七言律诗第一"，胡应麟更认为此诗当为"古今七言律诗第一"。'
  },
  {
    id: 'w4',
    title: '春望',
    author: '杜甫',
    dynasty: '唐',
    content: [
      '国破山河在，城春草木深。',
      '感时花溅泪，恨别鸟惊心。',
      '烽火连三月，家书抵万金。',
      '白头搔更短，浑欲不胜簪。'
    ],
    theme: ['忧国', '思乡'],
    emotion: ['沉痛', '忧愤'],
    imagery: ['花', '鸟', '烽火', '白发'],
    appreciation: '此诗作于唐肃宗至德二年（757年）三月。诗的前四句写春城败象，饱含感叹；后四句写心念亲人境况，充溢离情。全诗沉着蕴藉，真挚自然，反映了诗人热爱祖国、眷怀家人的感情。'
  },
  {
    id: 'w5',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    content: [
      '日照香炉生紫烟，',
      '遥看瀑布挂前川。',
      '飞流直下三千尺，',
      '疑是银河落九天。'
    ],
    theme: ['山水', '咏物'],
    emotion: ['豪放', '惊叹'],
    imagery: ['瀑布', '银河', '紫烟'],
    appreciation: '这是诗人李白五十岁左右隐居庐山时写的一首风景诗。这首诗形象地描绘了庐山瀑布雄奇壮丽的景色，反映了诗人对祖国大好河山的无限热爱。用夸张的比喻和浪漫的想象，进一步描绘瀑布的形象和气势，可谓字字珠玑。'
  },
  {
    id: 'w6',
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋',
    content: [
      '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。',
      '明月几时有？把酒问青天。',
      '不知天上宫阙，今夕是何年。',
      '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。',
      '起舞弄清影，何似在人间。',
      '转朱阁，低绮户，照无眠。',
      '不应有恨，何事长向别时圆？',
      '人有悲欢离合，月有阴晴圆缺，此事古难全。',
      '但愿人长久，千里共婵娟。'
    ],
    theme: ['中秋', '怀人'],
    emotion: ['旷达', '思念'],
    imagery: ['明月', '酒', '天上宫阙'],
    appreciation: '此词是中秋望月怀人之作，表达了对胞弟苏辙的无限思念。丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。词人运用形象描绘手法，勾勒出一种皓月当空、亲人千里、孤高旷远的境界氛围。'
  },
  {
    id: 'w7',
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋',
    content: [
      '大江东去，浪淘尽，千古风流人物。',
      '故垒西边，人道是，三国周郎赤壁。',
      '乱石穿空，惊涛拍岸，卷起千堆雪。',
      '江山如画，一时多少豪杰。',
      '遥想公瑾当年，小乔初嫁了，雄姿英发。',
      '羽扇纶巾，谈笑间，樯橹灰飞烟灭。',
      '故国神游，多情应笑我，早生华发。',
      '人生如梦，一尊还酹江月。'
    ],
    theme: ['怀古', '咏史'],
    emotion: ['豪放', '感慨'],
    imagery: ['大江', '浪涛', '明月'],
    allusions: ['周瑜赤壁'],
    appreciation: '此词通过对月夜江上壮美景色的描绘，借对古代战场的凭吊和对风流人物才略、气度、功业的追念，曲折地表达了作者怀才不遇、功业未就、老大未成的忧愤之情，同时表现了作者关注历史和人生的旷达之心。'
  },
  {
    id: 'w8',
    title: '声声慢·寻寻觅觅',
    author: '李清照',
    dynasty: '宋',
    content: [
      '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。',
      '乍暖还寒时候，最难将息。',
      '三杯两盏淡酒，怎敌他、晚来风急？',
      '雁过也，正伤心，却是旧时相识。',
      '满地黄花堆积，憔悴损，如今有谁堪摘？',
      '守着窗儿，独自怎生得黑？',
      '梧桐更兼细雨，到黄昏、点点滴滴。',
      '这次第，怎一个愁字了得！'
    ],
    theme: ['秋思', '孤寂'],
    emotion: ['凄婉', '愁苦', '悲凉'],
    imagery: ['黄花', '雁', '梧桐', '细雨', '酒'],
    appreciation: '作品通过描写残秋所见、所闻、所感，抒发自己因国破家亡、天涯沦落而产生的孤寂落寞、悲凉愁苦的心绪，具有浓厚的时代色彩。全词一字一泪，风格深沉凝重，哀婉凄苦，极富艺术感染力。'
  },
  {
    id: 'w9',
    title: '雨霖铃·寒蝉凄切',
    author: '柳永',
    dynasty: '宋',
    content: [
      '寒蝉凄切，对长亭晚，骤雨初歇。',
      '都门帐饮无绪，留恋处，兰舟催发。',
      '执手相看泪眼，竟无语凝噎。',
      '念去去，千里烟波，暮霭沉沉楚天阔。',
      '多情自古伤离别，更那堪，冷落清秋节！',
      '今宵酒醒何处？杨柳岸，晓风残月。',
      '此去经年，应是良辰好景虚设。',
      '便纵有千种风情，更与何人说？'
    ],
    theme: ['离别', '相思'],
    emotion: ['凄婉', '离愁'],
    imagery: ['杨柳', '残月', '酒', '寒蝉'],
    appreciation: '此词为抒写离情别绪的千古名篇，也是柳词和婉约词的代表作。词中，作者将他离开汴京与恋人惜别时的真情实感表达得缠绵悱恻，凄婉动人。'
  },
  {
    id: 'w10',
    title: '永遇乐·京口北固亭怀古',
    author: '辛弃疾',
    dynasty: '宋',
    content: [
      '千古江山，英雄无觅孙仲谋处。',
      '舞榭歌台，风流总被雨打风吹去。',
      '斜阳草树，寻常巷陌，人道寄奴曾住。',
      '想当年，金戈铁马，气吞万里如虎。',
      '元嘉草草，封狼居胥，赢得仓皇北顾。',
      '四十三年，望中犹记，烽火扬州路。',
      '可堪回首，佛狸祠下，一片神鸦社鼓。',
      '凭谁问：廉颇老矣，尚能饭否？'
    ],
    theme: ['怀古', '爱国'],
    emotion: ['悲壮', '忧愤'],
    imagery: ['斜阳', '烽火', '铁马'],
    allusions: ['孙权', '刘裕', '廉颇'],
    appreciation: '此词写于宋宁宗开禧元年（1205年），辛弃疾六十六岁，任镇江知府。词人登临北固亭，感叹对自己报国无门的失望，凭吊英雄，借古讽今，批评韩侂胄草率北伐。'
  },
  {
    id: 'w11',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    content: [
      '白日依山尽，',
      '黄河入海流。',
      '欲穷千里目，',
      '更上一层楼。'
    ],
    theme: ['登高', '哲理'],
    emotion: ['旷达', '豪迈'],
    imagery: ['白日', '黄河', '山'],
    appreciation: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。前两句写所见，后两句写所思，意境深远，耐人寻味。'
  },
  {
    id: 'w12',
    title: '锦瑟',
    author: '李商隐',
    dynasty: '唐',
    content: [
      '锦瑟无端五十弦，一弦一柱思华年。',
      '庄生晓梦迷蝴蝶，望帝春心托杜鹃。',
      '沧海月明珠有泪，蓝田日暖玉生烟。',
      '此情可待成追忆，只是当时已惘然。'
    ],
    theme: ['爱情', '咏怀'],
    emotion: ['迷惘', '惆怅', '伤感'],
    imagery: ['锦瑟', '蝴蝶', '杜鹃', '明珠', '玉烟'],
    allusions: ['庄周梦蝶', '望帝化鹃'],
    appreciation: '《锦瑟》是李商隐的代表作，爱诗的无不乐道喜吟。然而，它又是最不易讲解的一篇难诗。自宋元以来，揣测纷纷，莫衷一是。这首诗辞藻华丽，意境朦胧，情感真挚，艺术性极高。'
  },
  {
    id: 'w13',
    title: '山居秋暝',
    author: '王维',
    dynasty: '唐',
    content: [
      '空山新雨后，天气晚来秋。',
      '明月松间照，清泉石上流。',
      '竹喧归浣女，莲动下渔舟。',
      '随意春芳歇，王孙自可留。'
    ],
    theme: ['山水', '田园'],
    emotion: ['闲适', '淡泊'],
    imagery: ['明月', '松', '清泉', '竹', '莲'],
    appreciation: '这首诗描绘了秋雨初晴后傍晚时分山村的旖旎风光和山居村民的淳朴风尚，表现了诗人寄情山水田园，对隐居生活怡然自得的满足心情。全诗将空山雨后的秋凉，松间明月的清光，石上清泉的声音，浣女归来的笑声，渔舟穿过荷花的动态，融合为一体，描绘出一幅清新秀丽的山村秋夜图。'
  },
  {
    id: 'w14',
    title: '琵琶行',
    author: '白居易',
    dynasty: '唐',
    content: [
      '浔阳江头夜送客，枫叶荻花秋瑟瑟。',
      '主人下马客在船，举酒欲饮无管弦。',
      '醉不成欢惨将别，别时茫茫江浸月。',
      '忽闻水上琵琶声，主人忘归客不发。',
      '......',
      '同是天涯沦落人，相逢何必曾相识！',
      '......',
      '座中泣下谁最多？江州司马青衫湿。'
    ],
    theme: ['送别', '感怀'],
    emotion: ['悲凉', '同情', '感慨'],
    imagery: ['枫叶', '琵琶', '明月', '江水'],
    appreciation: '《琵琶行》是白居易的长篇叙事诗，作于元和十一年（816年）。诗中通过对琵琶女高超弹奏技艺和她不幸经历的描述，表达了诗人对她的深切同情，也抒发了诗人自己无辜被贬的愤懑之情。'
  },
  {
    id: 'w15',
    title: '破阵子·为陈同甫赋壮词以寄之',
    author: '辛弃疾',
    dynasty: '宋',
    content: [
      '醉里挑灯看剑，梦回吹角连营。',
      '八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。',
      '马作的卢飞快，弓如霹雳弦惊。',
      '了却君王天下事，赢得生前身后名。',
      '可怜白发生！'
    ],
    theme: ['边塞', '爱国'],
    emotion: ['豪迈', '悲愤'],
    imagery: ['剑', '马', '弓', '白发'],
    appreciation: '这首词是作者失意闲居信州时所作，无前人沙场征战之苦，而有沙场征战的热烈。全词以两个二、二、二的对句开头，通过具体、生动的梦境描写，创造雄壮的意境，表达词人渴望杀敌报国的雄心壮志，也表现了壮志未酬的悲愤。'
  }
];

// 意象数据
export const imageryList: Imagery[] = [
  {
    id: 'i1',
    name: '明月',
    category: '天文',
    meaning: '象征思乡、离别、团圆，是中国古典诗词中最常见的意象之一',
    examples: ['举头望明月，低头思故乡', '人有悲欢离合，月有阴晴圆缺', '明月松间照，清泉石上流'],
    emotion: ['思乡', '思念', '孤寂']
  },
  {
    id: 'i2',
    name: '柳',
    category: '植物',
    meaning: '"柳"与"留"谐音，古人常折柳送别，象征离别、留恋',
    examples: ['杨柳岸，晓风残月', '渭城朝雨浥轻尘，客舍青青柳色新', '此夜曲中闻折柳，何人不起故园情'],
    emotion: ['离别', '思念', '伤感']
  },
  {
    id: 'i3',
    name: '酒',
    category: '器物',
    meaning: '象征豪情、忧愁、超脱，是诗人抒发情感的重要载体',
    examples: ['人生得意须尽欢，莫使金樽空对月', '三杯两盏淡酒，怎敌他晚来风急', '今宵酒醒何处？杨柳岸，晓风残月'],
    emotion: ['豪放', '忧愁', '超脱']
  },
  {
    id: 'i4',
    name: '雁',
    category: '动物',
    meaning: '大雁南飞，象征思乡、信使、季节变换',
    examples: ['雁过也，正伤心，却是旧时相识', '乡书何处达？归雁洛阳边', '征蓬出汉塞，归雁入胡天'],
    emotion: ['思乡', '漂泊', '孤独']
  },
  {
    id: 'i5',
    name: '黄河',
    category: '地理',
    meaning: '象征壮阔、豪迈、永恒，是中华民族的象征',
    examples: ['君不见黄河之水天上来，奔流到海不复回', '白日依山尽，黄河入海流', '大漠孤烟直，长河落日圆'],
    emotion: ['豪迈', '壮阔', '感慨']
  },
  {
    id: 'i6',
    name: '白发',
    category: '人物',
    meaning: '象征衰老、时光流逝、人生苦短',
    examples: ['高堂明镜悲白发，朝如青丝暮成雪', '艰难苦恨繁霜鬓，潦倒新停浊酒杯', '可怜白发生'],
    emotion: ['感慨', '悲凉', '无奈']
  },
  {
    id: 'i7',
    name: '梧桐',
    category: '植物',
    meaning: '象征孤寂、凄凉、秋思，古人认为梧桐是凤凰栖息之所',
    examples: ['梧桐更兼细雨，到黄昏、点点滴滴', '无言独上西楼，月如钩。寂寞梧桐深院锁清秋'],
    emotion: ['孤寂', '凄凉', '愁苦']
  },
  {
    id: 'i8',
    name: '杜鹃',
    category: '动物',
    meaning: '象征悲苦、哀愁、思念，传说杜鹃啼血，声如"不如归去"',
    examples: ['庄生晓梦迷蝴蝶，望帝春心托杜鹃', '杨花落尽子规啼，闻道龙标过五溪'],
    emotion: ['悲苦', '哀愁', '思念']
  }
];

// 典故数据
export const allusions: Allusion[] = [
  {
    id: 'a1',
    name: '庄周梦蝶',
    source: '《庄子·齐物论》',
    story: '庄子梦中化为蝴蝶，栩栩然蝴蝶也，自喻适志与！不知周也。俄然觉，则蘧蘧然周也。不知周之梦为蝴蝶与，蝴蝶之梦为周与？',
    meaning: '比喻人生如梦，物我两忘的境界',
    examples: ['庄生晓梦迷蝴蝶，望帝春心托杜鹃']
  },
  {
    id: 'a2',
    name: '望帝化鹃',
    source: '《华阳国志》',
    story: '蜀王杜宇，号望帝，禅位后隐居西山，死后化为杜鹃鸟，啼血哀鸣',
    meaning: '比喻悲苦哀怨、冤屈不伸',
    examples: ['庄生晓梦迷蝴蝶，望帝春心托杜鹃']
  },
  {
    id: 'a3',
    name: '周瑜赤壁',
    source: '《三国志·吴书·周瑜传》',
    story: '东汉末年，周瑜在赤壁之战中大败曹操，奠定三分天下之势',
    meaning: '象征英雄豪杰、建功立业',
    examples: ['遥想公瑾当年，小乔初嫁了，雄姿英发']
  },
  {
    id: 'a4',
    name: '廉颇老矣',
    source: '《史记·廉颇蔺相如列传》',
    story: '赵王想重新起用廉颇，派使者观察廉颇是否还能领兵。廉颇一饭斗米，肉十斤，披甲上马，以示可用。但使者受郭开贿赂，回报赵王说廉颇虽老，饭量尚好，但一会儿就拉了三次屎',
    meaning: '比喻年事已高但仍渴望建功立业',
    examples: ['凭谁问：廉颇老矣，尚能饭否？']
  },
  {
    id: 'a5',
    name: '陈王宴平乐',
    source: '《三国志·魏书·陈思王植传》',
    story: '曹植封陈王，曾在平乐观念设宴，极尽奢华',
    meaning: '象征及时行乐、豪放不羁',
    examples: ['陈王昔时宴平乐，斗酒十千恣欢谑']
  }
];

// 获取所有数据
export function getAllData() {
  return { poets, works, imageryList, allusions };
}

// 根据作者名搜索作品
export function getWorksByAuthor(author: string): Work[] {
  return works.filter(w => w.author.includes(author));
}

// 根据关键词搜索
export function searchByKeyword(keyword: string): { works: Work[]; poets: Poet[]; imagery: Imagery[] } {
  const lowerKeyword = keyword.toLowerCase();
  
  const matchedWorks = works.filter(w => 
    w.title.includes(keyword) || 
    w.author.includes(keyword) ||
    w.content.some(line => line.includes(keyword)) ||
    w.theme?.some(t => t.includes(keyword)) ||
    w.emotion?.some(e => e.includes(keyword)) ||
    w.imagery?.some(i => i.includes(keyword))
  );
  
  const matchedPoets = poets.filter(p =>
    p.name.includes(keyword) ||
    p.dynasty.includes(keyword) ||
    p.style?.includes(keyword)
  );
  
  const matchedImagery = imageryList.filter(i =>
    i.name.includes(keyword) ||
    i.meaning.includes(keyword) ||
    i.examples.some(e => e.includes(keyword))
  );
  
  return { works: matchedWorks, poets: matchedPoets, imagery: matchedImagery };
}

// 根据意象获取相关作品
export function getWorksByImagery(imageryName: string): Work[] {
  return works.filter(w => w.imagery?.some(i => i.includes(imageryName)));
}

// 根据情感获取相关作品
export function getWorksByEmotion(emotion: string): Work[] {
  return works.filter(w => w.emotion?.some(e => e.includes(emotion)));
}

// 获取诗人的所有作品
export function getPoetWorks(poetName: string): Work[] {
  return works.filter(w => w.author === poetName);
}

// 获取作品详情
export function getWorkById(id: string): Work | undefined {
  return works.find(w => w.id === id);
}

// 获取诗人详情
export function getPoetByName(name: string): Poet | undefined {
  return poets.find(p => p.name === name);
}

// 获取意象详情
export function getImageryByName(name: string): Imagery | undefined {
  return imageryList.find(i => i.name === name);
}
