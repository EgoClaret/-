// 古诗文知识图谱类型定义

// 诗人实体
export interface Poet {
  id: string;
  name: string;
  dynasty: string;
  years?: string;
  courtesyName?: string;  // 字
  pseudonym?: string;      // 号
  birthplace?: string;     // 籍贯
  style?: string;          // 风格
  achievements?: string;   // 成就
}

// 作品实体
export interface Work {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string[];
  preface?: string;        // 序
  notes?: string[];        // 注释
  translation?: string;    // 译文
  appreciation?: string;   // 赏析
  theme?: string[];        // 题材标签
  emotion?: string[];      // 情感标签
  imagery?: string[];      // 意象
  allusions?: string[];    // 典故
}

// 意象实体
export interface Imagery {
  id: string;
  name: string;
  category: string;        // 分类：植物、动物、天文、地理等
  meaning: string;         // 文化内涵
  examples: string[];      // 代表诗句
  emotion: string[];       // 关联情感
}

// 典故实体
export interface Allusion {
  id: string;
  name: string;
  source: string;          // 出处
  story: string;           // 典故内容
  meaning: string;         // 寓意
  examples: string[];      // 使用示例
}

// 知识图谱关系类型
export type RelationType = 
  | '创作'      // 诗人-作品
  | '包含'      // 作品-意象/典故
  | '引用'      // 作品-典故
  | '化用'      // 作品-作品
  | '同题材'    // 作品-作品
  | '同意象'    // 作品-作品
  | '同时代'    // 诗人-诗人
  | '师承'      // 诗人-诗人
  | '唱和'      // 诗人-诗人
  | '演变'      // 意象-意象
  | '属于';     // 诗人-朝代

// 知识图谱三元组
export interface Triple {
  head: string;
  relation: RelationType;
  tail: string;
}

// 问答结果
export interface QAResult {
  answer: string;
  work?: Work;
  relatedWorks?: Work[];
  imagery?: Imagery[];
  allusions?: Allusion[];
  poet?: Poet;
  confidence: number;
}

// 搜索结果
export interface SearchResult {
  works: Work[];
  poets: Poet[];
  imagery: Imagery[];
  allusions: Allusion[];
}

// 知识图谱节点
export interface KGNode {
  id: string;
  label: string;
  type: 'poet' | 'work' | 'imagery' | 'allusion' | 'dynasty';
  properties: Record<string, unknown>;
}

// 知识图谱边
export interface KGEdge {
  source: string;
  target: string;
  relation: RelationType;
}

// 知识图谱可视化数据
export interface KGVisualization {
  nodes: KGNode[];
  edges: KGEdge[];
}
