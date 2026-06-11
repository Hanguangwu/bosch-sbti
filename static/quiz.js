/* Bosch SBTI 博世职场人格测试 — 纯前端题库与计分逻辑 */

const QUIZ_DATA = {
  // 四维计分规则（来自 question.txt）
  // 第一维 R/S: A=R, B=R, C=S, D=S
  // 第二维 J/M: A=J, D=J, B=M, C=M
  // 第三维 D/Y: A=D, C=D, B=Y, D=Y
  // 第四维 Q/O: A=Q, D=Q, B=O, C=O
  CHOICE_SCORES: {
    A: ["R", "J", "D", "Q"],
    B: ["R", "M", "Y", "O"],
    C: ["S", "M", "Y", "O"],
    D: ["S", "J", "Y", "Q"],
  },

  DIM_KEYS: ["RS", "JM", "DY", "QO"],
  LETTERS: [
    ["R", "S"],
    ["J", "M"],
    ["D", "Y"],
    ["Q", "O"],
  ],

  QUESTIONS: [
    {
      text: "拿到一份技术图纸 / 规格书，你第一反应",
      choices: [
        ["A", "逐条核对参数、版本、公差，有错立刻提"],
        ["B", "大致看一眼，不影响干活就行"],
        ["C", "扫个标题，等别人审完我直接用"],
        ["D", "先存归档备份，顺带标注版本溯源，做事滴水不漏"],
      ],
    },
    {
      text: "工作出了小纰漏，没人发现，你会",
      choices: [
        ["A", "主动报备 + 复盘 + 整改，留记录"],
        ["B", "悄悄补救，当做没发生"],
        ["C", "甩锅给流程 / 前任 / 环境"],
        ["D", "内部自查闭环，悄悄整改还完善流程漏洞"],
      ],
    },
    {
      text: "开会你一般状态",
      choices: [
        ["A", "提前到场带本子，逐条记录决议"],
        ["B", "准时到场，偶尔听听偶尔走神"],
        ["C", "卡点 / 迟到，全程玩手机挂机"],
        ["D", "边听边梳理待办，会后立刻同步落实到人"],
      ],
    },
    {
      text: "同事临时甩给你不属于你的活",
      choices: [
        ["A", "委婉拒绝，按岗位职责边界来"],
        ["B", "不好意思拒绝，硬着头皮接下"],
        ["C", "表面答应，实际拖着不做"],
        ["D", "划分权责明说边界，帮可以但要走正式交接流程"],
      ],
    },
    {
      text: "下班前没事做，你会",
      choices: [
        ["A", "整理文档、优化流程、学新技术"],
        ["B", "摸鱼刷手机，熬到点走人"],
        ["C", "假装很忙，实则挂机等下班"],
        ["D", "梳理本周工作复盘，提前规划下周任务"],
      ],
    },
    {
      text: "办公室没人还亮着灯空调没关",
      choices: [
        ["A", "顺手关灯关空调，节约能耗"],
        ["B", "心里觉得浪费但懒得起身"],
        ["C", "无所谓，反正电费公家出"],
        ["D", "随手关掉还顺带巡检一遍办公用电设备"],
      ],
    },
    {
      text: "做报表 / 发文件命名格式",
      choices: [
        ["A", "严格：项目 - 版本 - 日期 - 负责人 全套规范"],
        ["B", "随便起个名，能找到就行"],
        ["C", "乱命名，发完自己都找不到"],
        ["D", "统一归档分类，按部门标准建文件夹规整存放"],
      ],
    },
    {
      text: "面对客户无理改需求",
      choices: [
        ["A", "按流程评估风险，讲规则讲道理"],
        ["B", "不敢拒绝，全盘迁就连夜改"],
        ["C", "嘴上答应，实际拖时间敷衍"],
        ["D", "有理有据摆风险，折中协商不卑不亢"],
      ],
    },
    {
      text: "对待公司合规、培训、制度",
      choices: [
        ["A", "认真看完记要点，严格遵守"],
        ["B", "挂着就行，干自己的事"],
        ["C", "能逃就逃，能糊弄就糊弄"],
        ["D", "不仅自己吃透，还会提醒同事合规避坑"],
      ],
    },
    {
      text: "工具、工位、文件收纳",
      choices: [
        ["A", "分类规整、摆放固定、台账清晰"],
        ["B", "大体不乱，凑合能找"],
        ["C", "东西乱堆，找东西全靠翻"],
        ["D", "工位模块化布局，工具定点归位一目了然"],
      ],
    },
    {
      text: "别人敷衍交过来的工作成果",
      choices: [
        ["A", "直接打回，要求按标准重做"],
        ["B", "自己默默帮他补完收尾"],
        ["C", "将就收下，往后原样传递"],
        ["D", "指出问题列明标准，耐心指导对方整改到位"],
      ],
    },
    {
      text: "节假日同事找你处理工作",
      choices: [
        ["A", "非紧急一律不回，工作生活分开"],
        ["B", "不好意思不回，随叫随到"],
        ["C", "假装没看见，延后再回"],
        ["D", "分清紧急优先级，急事速办琐事节后统一处理"],
      ],
    },
    {
      text: "团队内卷加班风气",
      choices: [
        ["A", "不熬时间，只拼效率，到点就走"],
        ["B", "跟着一起熬，假装努力合群"],
        ["C", "冷眼旁观，绝不参与内卷"],
        ["D", "高效干完本职，不跟风无效熬夜内耗"],
      ],
    },
    {
      text: "发现流程有漏洞可以优化",
      choices: [
        ["A", "主动梳理、提方案、推动落地"],
        ["B", "心里知道但多一事不如少一事"],
        ["C", "反正不关我事，躺平看戏"],
        ["D", "整理漏洞明细+优化方案，主动上报推动改版"],
      ],
    },
    {
      text: "和同事有意见分歧",
      choices: [
        ["A", "就事论事直讲，不搞人情绑架"],
        ["B", "委婉绕着说，照顾对方面子"],
        ["C", "附和从众，不发表任何立场"],
        ["D", "私下理性沟通摆事实，公开场合给足对方台阶"],
      ],
    },
    {
      text: "做项目交付",
      choices: [
        ["A", "自查三遍、交叉校验、留痕归档"],
        ["B", "检查一遍差不多就交付"],
        ["C", "赶时间先交，有错后面再改"],
        ["D", "全流程节点校验，交付资料全套归档可追溯"],
      ],
    },
    {
      text: "面对新人请教问题",
      choices: [
        ["A", "条理清晰按规范教，讲原理讲流程"],
        ["B", "简单给个做法，能用就行"],
        ["C", "敷衍两句，让自己百度去"],
        ["D", "整理标准教程，耐心带教还帮新人避职场坑"],
      ],
    },
    {
      text: "采购 / 外协 / 供应商对接",
      choices: [
        ["A", "卡死标准、资质、参数、质保"],
        ["B", "过得去就行，人情好说话"],
        ["C", "随便应付，懒得较真"],
        ["D", "按德系标准严卡门槛，同时维护长期合作关系"],
      ],
    },
    {
      text: "领导画饼加任务",
      choices: [
        ["A", "理性评估工作量，敢提边界"],
        ["B", "听话全接，默默内耗"],
        ["C", "口头答应，实际摆烂不推进"],
        ["D", "列明工作量和风险，协商合理排期不盲目接活"],
      ],
    },
    {
      text: "产品有轻微不影响使用的瑕疵",
      choices: [
        ["A", "坚决拦截，返工整改不放行"],
        ["B", "默许通过，没必要太较真"],
        ["C", "跟着大流，别人过我也过"],
        ["D", "记录瑕疵溯源，同步整改杜绝下次再犯"],
      ],
    },
    {
      text: "你的职场信条",
      choices: [
        ["A", "规则为王、质量为本、事事靠谱"],
        ["B", "中庸度日、不得罪人、安稳就行"],
        ["C", "能摸则摸、能躺则躺、少管闲事"],
        ["D", "流程打底、质量兜底、情商在线、稳中求进"],
      ],
    },
  ],

  TYPE_DESCRIPTIONS: {
    RJDQ: "德系质控战神 — 严谨 + 内卷 + 直给 + 质量偏执，博世标准标杆，流程质量双在线，眼里容不下不规范，研发 / 质量 / 实验室天选人格。",
    RJDO: "严谨内卷将就派 — 做事认真爱内卷，但细节不钻牛角尖，能干能扛，不过小瑕疵愿意放过自己和别人。",
    RJYQ: "圆滑技术大佬 — 严谨上进情商高，懂流程懂质量又会做人，不硬刚不得罪人，升职加薪潜力拉满。",
    RJYO: "懂事佛系骨干 — 工作上进、处事圆滑、不爱过度抠细节，团队里最稳的老好人骨干。",
    RMDQ: "严谨摸鱼质检员 — 原则强、质量要求高，但不爱内卷，分内事做到极致，多余一概不揽。",
    RMDO: "佛系流程管理员 — 守规矩不越界，不卷不抢，做事按标准，小问题懒得深究，安稳度日。",
    RMYQ: "温柔合规老员工 — 严谨守制度、情商高、不内卷、质量有底线，办公室人缘最好的老油条好人。",
    RMYO: "德系摆烂和事佬 — 守规矩但不爱较真，摸鱼为主，谁也不得罪，职场过得最轻松。",
    SJDQ: "随性实干卷王 — 不爱死板流程，但做事拼命内卷、直来直去、质量有追求，野路子实力派。",
    SJDO: "洒脱职场狂人 — 不拘小节、拼命干活、性格直爽，差不多就放行，执行力强但不爱繁文缛节。",
    SJYQ: "高情商实干派 — 随性不刻板、上进能扛事、会做人、有质量底线，社交业务双在线。",
    SJYO: "通透职场聪明人 — 不被流程束缚、不瞎内卷、圆滑会来事、凡事差不多就行，活得最通透。",
    SMDQ: "摆烂底线党 — 平时摸鱼不爱折腾，性子直，虽然躺平，但底线质量绝不妥协。",
    SMDO: "纯纯博世躺平人 — 随性摆烂、不卷不争、直来直去，工作能过就过，只求安稳下班。",
    SMYQ: "圆滑佛系守线人 — 情商高会做人、不爱内卷、随性不刻板，关键原则和质量绝不松口。",
    SMYO: "终极博世摆烂仙人 — 全程随缘、不卷不较真、不得罪人、凡事将就，上班摸鱼下班消失，人生赢家。",
  },
};

/* ===== 计分函数 ===== */
function calculateResult(formAnswers) {
  const { CHOICE_SCORES, DIM_KEYS, LETTERS, QUESTIONS } = QUIZ_DATA;

  // 初始化计数器
  const counts = {};
  DIM_KEYS.forEach((dk) => {
    counts[dk] = {};
    LETTERS[DIM_KEYS.indexOf(dk)].forEach((l) => {
      counts[dk][l] = 0;
    });
  });

  // 遍历所有问题统计
  for (let i = 0; i < QUESTIONS.length; i++) {
    const key = "q" + i;
    const val = (formAnswers[key] || "").trim().toUpperCase();
    if (!CHOICE_SCORES[val]) continue;
    const scores = CHOICE_SCORES[val];
    DIM_KEYS.forEach((dk, idx) => {
      counts[dk][scores[idx]]++;
    });
  }

  // 拼人格码和 breakdown
  const resultLetters = [];
  const breakdown = {};
  DIM_KEYS.forEach((dk, idx) => {
    const [a, b] = LETTERS[idx];
    const ca = counts[dk][a] || 0;
    const cb = counts[dk][b] || 0;
    breakdown[a + "/" + b] = [ca, cb];
    resultLetters.push(ca >= cb ? a : b);
  });

  const typeCode = resultLetters.join("");
  const desc =
    QUIZ_DATA.TYPE_DESCRIPTIONS[typeCode] ||
    "该组合可在四维条形图上对照解读；若答题不完整，结果仅供参考。";

  // 统计已答数
  const valid = { A: true, B: true, C: true, D: true };
  let answered = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const val = (formAnswers["q" + i] || "").trim().toUpperCase();
    if (valid[val]) answered++;
  }

  return { typeCode, description: desc, breakdown, answered, total: QUESTIONS.length };
}

/* ===== 表单渲染 ===== */
function renderQuiz() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  const { QUESTIONS } = QUIZ_DATA;
  let html = '<form id="quiz-form">';

  QUESTIONS.forEach((q, i) => {
    html += `
      <section class="question" aria-labelledby="q-${i}-title">
        <h2 id="q-${i}-title" class="q-title">
          <span class="q-num">${i + 1}</span>${q.text}
        </h2>
        <div class="options options-quad">
    `;
    q.choices.forEach(([key, label]) => {
      html += `
          <label class="option">
            <input type="radio" name="q${i}" value="${key}"${i === 0 && key === "A" ? " required" : ""} />
            <span class="option-card"><span class="opt-key">${key}</span>${label}</span>
          </label>
      `;
    });
    html += `
        </div>
      </section>
    `;
  });

  html += `
      <div class="actions">
        <button type="submit" class="btn primary">查看我的博世人格</button>
      </div>
    </form>
  `;

  container.innerHTML = html;

  // 绑定提交事件
  document.getElementById("quiz-form").addEventListener("submit", handleSubmit);
}

/* ===== 提交处理 ===== */
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const answers = {};
  formData.forEach((val, key) => {
    answers[key] = val;
  });

  const result = calculateResult(answers);
  showResult(result);
}

/* ===== 结果展示 ===== */
function showResult(result) {
  const { typeCode, description, breakdown, answered, total } = result;

  // 隐藏 quiz 区，显示 result 区
  document.getElementById("quiz-section").style.display = "none";
  const resultSection = document.getElementById("result-section");
  resultSection.style.display = "block";

  // 未完整作答提示
  const warnEl = document.getElementById("result-warn");
  if (answered < total) {
    warnEl.style.display = "block";
    warnEl.textContent = "你已作答 " + answered + " / " + total + " 题，结果仅供参考。";
  } else {
    warnEl.style.display = "none";
  }

  // 人格图片
  document.getElementById("result-image").src = "static/" + typeCode + ".png";
  document.getElementById("result-image").alt = typeCode + " 人格图片";

  // 人格码
  document.getElementById("result-code").textContent = typeCode;

  // 描述
  document.getElementById("result-desc").textContent = description;

  // 四维分布条形图
  const dimKeys = ["R/S", "J/M", "D/Y", "Q/O"];
  const breakdownList = document.getElementById("breakdown-list");
  breakdownList.innerHTML = "";
  dimKeys.forEach((label) => {
    const pair = breakdown[label];
    if (!pair) return;
    const [a, b] = pair;
    const totalAB = a + b;
    const pct = totalAB > 0 ? (100 * a) / totalAB : 50;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="dim-label">${label}</span>
      <span class="dim-bar-wrap" role="img" aria-label="${label} ${a} 比 ${b}">
        <span class="dim-bar">
          <span class="dim-fill" style="width: ${pct}%"></span>
        </span>
      </span>
      <span class="dim-count">${a} : ${b}</span>
    `;
    breakdownList.appendChild(li);
  });

  // 滚动到结果区
  document.getElementById("result-section").scrollIntoView({ behavior: "smooth" });
}

/* ===== 再测一次 ===== */
function resetQuiz() {
  document.getElementById("result-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  document.getElementById("quiz-form").reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== 页面访问计数器（localStorage） ===== */
(function initVisitCounter() {
  const KEY = "bosch_sbti_visits";
  let count = parseInt(localStorage.getItem(KEY) || "0", 10);
  count++;
  localStorage.setItem(KEY, count.toString());
  const el = document.getElementById("visit-counter");
  if (el) el.textContent = count;
})();

/* ===== 初始化 ===== */
document.addEventListener("DOMContentLoaded", renderQuiz);
