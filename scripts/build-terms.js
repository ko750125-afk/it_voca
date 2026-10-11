const fs = require('fs');
const path = require('path');

const terms = [
  // ========================================================
  // 1. AI · 인공지능 (categoryId: 1) - 26개
  // ========================================================
  {
    term: "LLM",
    pronunciation: "엘엘엠",
    fullName: "Large Language Model",
    meaning: "대규모 언어 모델",
    explanation: "인터넷의 방대한 텍스트 데이터를 학습해 사람처럼 문맥을 이해하고 글과 코드를 생성하는 초거대 인공지능 모델입니다.",
    categoryId: 1
  },
  {
    term: "Prompt",
    pronunciation: "프롬프트",
    fullName: "",
    meaning: "AI에게 내리는 작업 지시문",
    explanation: "AI 모델이 원하는 결과물을 만들어내도록 사용자가 입력하는 질문, 지시사항, 맥락 정보 일체를 뜻합니다.",
    categoryId: 1
  },
  {
    term: "System Prompt",
    pronunciation: "시스템 프롬프트",
    fullName: "",
    meaning: "AI의 기본 역할과 행동 규칙 설정",
    explanation: "일반 사용자의 질문 이전에 AI에게 페르소나, 답변 어조, 필수 준수 규칙, 출력 형식 등을 사전에 정의해 두는 핵심 지침입니다.",
    categoryId: 1
  },
  {
    term: "Prompt Engineering",
    pronunciation: "프롬프트 엔지니어링",
    fullName: "",
    meaning: "AI 답변 품질을 극대화하는 지시문 설계 기술",
    explanation: "AI가 오차 없이 가장 정확하고 유용한 코딩이나 답변을 하도록 질문의 구조, 예시, 제약조건을 정교하게 다듬는 기법입니다.",
    categoryId: 1
  },
  {
    term: "Hallucination",
    pronunciation: "할루시네이션 (환각)",
    fullName: "",
    meaning: "AI가 사실이 아닌 내용을 그럴듯하게 지어내는 현상",
    explanation: "학습 데이터의 한계나 확률적 생성 과정으로 인해 틀린 정보나 존재하지 않는 라이브러리를 사실인 것처럼 당당하게 답변하는 현상입니다.",
    categoryId: 1
  },
  {
    term: "RAG",
    pronunciation: "라그 (또는 알에이지)",
    fullName: "Retrieval-Augmented Generation",
    meaning: "검색 증강 생성",
    explanation: "AI가 답변하기 전에 외부 문서나 최신 사내 데이터를 먼저 검색해 읽어본 뒤, 그 내용을 바탕으로 신뢰성 높은 답변을 생성하는 기술입니다.",
    categoryId: 1
  },
  {
    term: "Token",
    pronunciation: "토큰",
    fullName: "",
    meaning: "AI가 글자를 처리하는 기본 단위",
    explanation: "AI가 글을 읽고 쓸 때 문장을 잘게 쪼갠 조각으로, 단어의 일부나 형태소 단위입니다. AI API 사용 요금과 기억 용량의 기준이 됩니다.",
    categoryId: 1
  },
  {
    term: "Context Window",
    pronunciation: "컨텍스트 윈도우 (문맥 창)",
    fullName: "",
    meaning: "AI가 한 번에 기억하고 처리할 수 있는 대화 용량",
    explanation: "AI가 이전 대화나 코드 파일을 한꺼번에 읽어들여 기억할 수 있는 최대 토큰 한계치를 의미합니다.",
    categoryId: 1
  },
  {
    term: "Temperature",
    pronunciation: "템퍼러처 (온도값)",
    fullName: "",
    meaning: "AI 답변의 창의성 및 무작위성 조절 값",
    explanation: "0에 가까울수록 가장 확률 높은 정답 위주의 정확하고 일관된 답변을 하며, 1에 가까울수록 창의적이고 다양한 아이디어를 냅니다.",
    categoryId: 1
  },
  {
    term: "Top-p",
    pronunciation: "탑피 (뉴클리어스 샘플링)",
    fullName: "Top-p Sampling / Nucleus Sampling",
    meaning: "단어 선택 후보의 누적 확률 임계치 조절 값",
    explanation: "후보 단어들의 확률을 높은 순서대로 누적해 p값(예: 0.9) 범위 안에서만 다음 단어를 고르게 제한하여 엉뚱한 단어 생성을 막아주는 파라미터입니다.",
    categoryId: 1
  },
  {
    term: "Embedding",
    pronunciation: "임베딩",
    fullName: "",
    meaning: "글자나 문장의 의미를 숫자의 나열(벡터)로 변환한 것",
    explanation: "컴퓨터가 문맥의 유사도를 계산할 수 있도록 단어나 문장의 의미를 좌표 공간의 숫자 배열로 바꾼 표현입니다.",
    categoryId: 1
  },
  {
    term: "Vector DB",
    pronunciation: "벡터 디비",
    fullName: "Vector Database",
    meaning: "문장의 의미 유사도를 고속으로 검색하는 데이터베이스",
    explanation: "단어의 단순 철자 일치가 아니라, '강아지'와 '반려견'처럼 의미가 비슷한 데이터를 빠르게 찾아내어 RAG 등에 필수적으로 쓰입니다.",
    categoryId: 1
  },
  {
    term: "AI Agent",
    pronunciation: "에이아이 에이전트",
    fullName: "",
    meaning: "스스로 계획을 세우고 도구를 사용해 목표를 완수하는 AI",
    explanation: "단순 질의응답을 넘어 파일 읽기, 터미널 명령 실행, 웹 검색 등 도구를 직접 실행하며 문제를 스스로 해결하는 능동적 AI 시스템입니다.",
    categoryId: 1
  },
  {
    term: "MCP",
    pronunciation: "엠씨피",
    fullName: "Model Context Protocol",
    meaning: "AI와 로컬 프로그램/데이터를 연결하는 표준 규격",
    explanation: "Anthropic이 발표한 오픈 표준으로, AI 어시스턴트가 사용자의 로컬 파일, DB, 깃허브, 슬랙 등의 외부 도구를 안전하고 규격화된 방식으로 호출할 수 있게 해줍니다.",
    categoryId: 1
  },
  {
    term: "Function Calling",
    pronunciation: "펑션 콜링 (함수 호출 / 도구 사용)",
    fullName: "",
    meaning: "AI가 외부 함수나 API를 실행할 수 있도록 매개변수를 JSON으로 반환하는 기능",
    explanation: "AI가 직접 날씨를 알 수 없을 때 'getWeather(city: Seoul)' 함수를 실행하라고 필요한 인자 데이터를 컴퓨터 규격에 맞게 만들어주는 핵심 기술입니다.",
    categoryId: 1
  },
  {
    term: "Fine-tuning",
    pronunciation: "파인 튜닝 (미세 조정)",
    fullName: "",
    meaning: "기존 AI 모델을 특정 도메인 데이터로 추가 학습시키는 작업",
    explanation: "이미 완성된 기본 거대 모델에 법률, 의료, 특정 사내 규정 등 전문 지식 데이터를 추가로 주입하여 특화 모델로 개조하는 기법입니다.",
    categoryId: 1
  },
  {
    term: "Multimodal",
    pronunciation: "멀티모달",
    fullName: "",
    meaning: "텍스트뿐만 아니라 이미지, 음성, 영상 등 여러 형태의 데이터를 동시에 이해하고 생성하는 AI",
    explanation: "글자만 읽는 것이 아니라 사용자가 캡처한 화면 스크린샷, 도면, 녹음 음성 등을 함께 분석해 즉시 코딩이나 해설을 제공하는 모델입니다.",
    categoryId: 1
  },
  {
    term: "Zero-shot / Few-shot",
    pronunciation: "제로샷 / 퓨샷",
    fullName: "",
    meaning: "사전 예시 없이 바로 지시하기(Zero-shot) vs 예시를 1~2개 주고 지시하기(Few-shot)",
    explanation: "AI에게 원하는 출력 형태의 모범 예시를 프롬프트에 몇 개 적어주느냐에 따라 정답률과 답변 형식이 획기적으로 개선됩니다.",
    categoryId: 1
  },
  {
    term: "Inference",
    pronunciation: "인퍼런스 (추론)",
    fullName: "",
    meaning: "학습이 끝난 AI 모델이 실제 사용자의 입력을 받아 결과를 생성하는 실행 과정",
    explanation: "새로운 모델을 만드는 '학습(Training)' 단계와 구별되며, 완성된 모델을 서비스 서버에 올려서 사용자의 요청에 답을 만들어내는 실제 서비스 단계입니다.",
    categoryId: 1
  },
  {
    term: "Vibe Coding",
    pronunciation: "바이브 코딩",
    fullName: "",
    meaning: "AI에게 자연어로 직관적 지시를 내리며 빠르게 소프트웨어를 완성하는 코딩 패러다임",
    explanation: "복잡한 문법을 밑바닥부터 일일이 타이핑하지 않고, AI 에이전트와 페어 프로그래밍하며 직관과 맥락(Vibe)을 중심으로 신속하게 결과물을 창작하는 현대 개발 방식입니다.",
    categoryId: 1
  },
  {
    term: "RLHF",
    pronunciation: "알엘에이치에프",
    fullName: "Reinforcement Learning from Human Feedback",
    meaning: "인간의 피드백을 반영한 강화학습",
    explanation: "AI가 생성한 여러 답변 중 사람이 더 친절하고 정확하다고 평가한 답변에 보상을 주어 사람의 선호도와 윤리 기준에 맞추는 학습 기법입니다.",
    categoryId: 1
  },
  {
    term: "Quantization",
    pronunciation: "양자화",
    fullName: "",
    meaning: "AI 모델의 가중치 용량을 줄여 가볍고 빠르게 만드는 최적화 기술",
    explanation: "소수점 숫자로 이루어진 방대한 AI 매개변수를 16비트에서 8비트, 4비트로 압축하여 고가의 GPU 없이도 일반 PC나 모바일에서 모델을 구동할 수 있게 해줍니다.",
    categoryId: 1
  },
  {
    term: "Chain of Thought",
    pronunciation: "체인 오브 쏘트 (CoT / 생각의 사슬)",
    fullName: "Chain of Thought",
    meaning: "AI에게 '단계별로 차근차근 생각해봐'라고 유도하여 논리적 추론 능력을 극대화하는 기법",
    explanation: "복잡한 코딩이나 수학 문제에서 곧바로 결론을 내지 않고 단계별 생각 과정을 거치게 함으로써 최신 추론형 AI의 정답률을 크게 높입니다.",
    categoryId: 1
  },
  {
    term: "Guardrail",
    pronunciation: "가드레일",
    fullName: "",
    meaning: "AI가 부적절한 발언이나 보안 위협 코드를 출력하지 못하도록 막는 안전 울타리",
    explanation: "사용자의 악의적인 프롬프트 주입이나 민감 정보 유출을 사전에 차단하기 위해 입력과 출력 단계에 설치하는 엄격한 보안 필터입니다.",
    categoryId: 1
  },
  {
    term: "Context Injection",
    pronunciation: "컨텍스트 주입",
    fullName: "",
    meaning: "프롬프트 앞부분에 관련된 코드 파일이나 DB 조회 결과를 실시간으로 끼워 넣는 기법",
    explanation: "AI 에디터가 현재 열려 있는 파일 내용이나 Git diff 변경사항을 AI에게 자동으로 전달하여 정확한 수정 코드를 얻어내는 기본 원리입니다.",
    categoryId: 1
  },
  {
    term: "Latent Space",
    pronunciation: "레이턴트 스페이스 (잠재 공간)",
    fullName: "",
    meaning: "데이터의 본질적 의미와 특징이 고차원 수학적 좌표로 압축되어 있는 공간",
    explanation: "AI가 이미지나 문장을 이해할 때 겉모습이 아닌 핵심 특징(개념, 스타일, 의미)만을 추출해 위치시키는 추상적인 다차원 공간입니다.",
    categoryId: 1
  },

  // ========================================================
  // 2. 웹 개발 (categoryId: 2) - 27개
  // ========================================================
  {
    term: "Frontend",
    pronunciation: "프론트엔드",
    fullName: "",
    meaning: "사용자가 직접 눈으로 보고 상호작용하는 웹/앱의 앞단 화면",
    explanation: "HTML, CSS, JavaScript 및 React 등을 사용하여 사용자의 브라우저나 스마트폰 화면에 보이는 버튼, 디자인, 애니메이션을 구현하는 영역입니다.",
    categoryId: 2
  },
  {
    term: "Backend",
    pronunciation: "백엔드",
    fullName: "",
    meaning: "사용자 눈에 보이지 않는 서버 뒤편의 로직과 데이터 관리 영역",
    explanation: "데이터베이스 연동, 회원 인증, 결제 처리 등 비즈니스 핵심 규칙을 처리하고 프론트엔드의 요청에 맞춰 데이터를 안전하게 가공해 전달하는 서버 영역입니다.",
    categoryId: 2
  },
  {
    term: "API",
    pronunciation: "에이피아이",
    fullName: "Application Programming Interface",
    meaning: "서로 다른 소프트웨어 프로그램들이 대화하고 소통하기 위한 공식 창구",
    explanation: "식당의 손님(프론트엔드)과 주방(백엔드) 사이에서 메뉴 주문을 받고 음식을 전달해주는 웨이터에 비유할 수 있는 표준 통신 규약입니다.",
    categoryId: 2
  },
  {
    term: "REST API",
    pronunciation: "레스트 에이피아이",
    fullName: "Representational State Transfer API",
    meaning: "인터넷 표준 규약(HTTP)을 활용해 자원을 직관적으로 주고받는 가장 대중적인 API 설계 방식",
    explanation: "URL 주소로 대상(예: /users)을 정하고, HTTP 메서드(GET 조회, POST 생성, PUT 수정, DELETE 삭제)로 행위를 직관적으로 표현하는 웹 표준 API입니다.",
    categoryId: 2
  },
  {
    term: "JSON",
    pronunciation: "제이슨",
    fullName: "JavaScript Object Notation",
    meaning: "데이터를 주고받을 때 전 세계 개발자들이 가장 널리 쓰는 텍스트 포맷",
    explanation: "사람도 읽기 쉽고 컴퓨터도 해석하기 쉬운 {'이름': '홍길동', '나이': 30} 형태의 키-값 쌍으로 이루어진 가벼운 데이터 형식입니다.",
    categoryId: 2
  },
  {
    term: "DOM",
    pronunciation: "돔",
    fullName: "Document Object Model",
    meaning: "브라우저가 HTML 문서를 자바스크립트로 조작할 수 있도록 나무(Tree) 구조로 만든 객체 모델",
    explanation: "웹페이지의 글자, 버튼, 이미지 하나하나를 자바스크립트가 찾아서 내용을 바꾸거나 색상을 변경할 수 있게 브라우저가 메모리에 펼쳐놓은 요소 지도입니다.",
    categoryId: 2
  },
  {
    term: "Virtual DOM",
    pronunciation: "버추얼 돔 (가상 돔)",
    fullName: "Virtual Document Object Model",
    meaning: "실제 브라우저 화면 대신 메모리상에서 먼저 변경사항을 비교해 렌더링 성능을 극대화하는 기술",
    explanation: "React의 핵심 기술로, 데이터가 바뀔 때마다 느린 실제 브라우저 화면을 바로 고치지 않고, 가상 메모리에서 바뀐 부분만 콕 집어 한 번에 반영합니다.",
    categoryId: 2
  },
  {
    term: "SPA",
    pronunciation: "에스피에이",
    fullName: "Single Page Application",
    meaning: "페이지 이동 시 화면 깜빡임 없이 부드럽게 필요한 부분만 바꾸는 웹 애플리케이션",
    explanation: "첫 접속 때 하나의 페이지만 받아온 후, 페이지 이동 시 전체를 새로고침하지 않고 데이터만 받아와 앱처럼 매끄럽게 화면을 갱신하는 웹입니다.",
    categoryId: 2
  },
  {
    term: "SSR",
    pronunciation: "에스에스알",
    fullName: "Server-Side Rendering",
    meaning: "서버에서 완성된 HTML 화면을 완전히 다 그린 후 브라우저로 내려보내는 방식",
    explanation: "검색 로봇이 내용을 쉽게 긁어갈 수 있어 검색엔진 최적화(SEO)에 매우 유리하며, 초기 화면 진입 속도가 빠릅니다.",
    categoryId: 2
  },
  {
    term: "CSR",
    pronunciation: "씨에스알",
    fullName: "Client-Side Rendering",
    meaning: "서버는 뼈대만 주고, 브라우저가 자바스크립트를 실행하여 화면을 직접 완성하는 방식",
    explanation: "초기 로딩은 조금 걸릴 수 있지만, 한 번 로딩되면 화면 깜빡임 없이 앱처럼 부드럽고 빠른 사용자 반응 속도를 제공합니다.",
    categoryId: 2
  },
  {
    term: "Hydration",
    pronunciation: "하이드레이션",
    fullName: "",
    meaning: "서버가 보낸 정적 HTML 화면에 자바스크립트 클릭 이벤트와 동작을 불어넣어 살아 움직이게 만드는 과정",
    explanation: "물(JavaScript)을 부어 마른 미역(정적 HTML)을 생생하게 되살린다는 비유처럼, 정적인 화면에 클릭이나 스크롤 등의 상호작용 생명을 불어넣는 결합 작업입니다.",
    categoryId: 2
  },
  {
    term: "Component",
    pronunciation: "컴포넌트",
    fullName: "",
    meaning: "UI 화면을 독립적이고 재사용 가능하게 레고 블록처럼 쪼갠 기본 조각 단위",
    explanation: "버튼, 내비게이션 바, 카드 등 반복되는 UI 요소를 독립된 파일로 만들어두고, 필요할 때마다 어디서든 조립해 쓰는 모던 프론트엔드의 핵심 개념입니다.",
    categoryId: 2
  },
  {
    term: "State",
    pronunciation: "스테이트 (상태)",
    fullName: "",
    meaning: "화면의 변화를 일으키는 컴포넌트 내부의 동적 데이터",
    explanation: "장바구니 담긴 개수, 모달 열림 여부처럼 사용자의 조작에 따라 수시로 변하며, 이 값이 바뀌면 컴포넌트가 자동으로 다시 그려집니다.",
    categoryId: 2
  },
  {
    term: "Props",
    pronunciation: "프롭스 (속성)",
    fullName: "Properties",
    meaning: "부모 컴포넌트가 자식 컴포넌트에게 전달하는 읽기 전용 데이터",
    explanation: "버튼 컴포넌트에 '글자색은 파란색, 문구는 확인'처럼 외부에서 지정해주는 설정값으로, 자식 컴포넌트가 임의로 직접 수정할 수 없습니다.",
    categoryId: 2
  },
  {
    term: "Hook",
    pronunciation: "훅",
    fullName: "",
    meaning: "함수형 컴포넌트에서 상태 관리와 생명주기 제어 기능을 손쉽게 꺼내 쓰게 해주는 도구",
    explanation: "useState, useEffect처럼 'use'로 시작하는 특수 함수들로, 복잡한 클래스 문법 없이도 간결하게 상태와 부수 효과를 다룰 수 있게 해줍니다.",
    categoryId: 2
  },
  {
    term: "Routing",
    pronunciation: "라우팅",
    fullName: "",
    meaning: "사용자가 입력한 URL 주소나 화면 경로에 따라 알맞은 화면 컴포넌트를 보여주는 길 찾기 기능",
    explanation: "웹의 '/login', '/home'이나 모바일 앱의 탭 전환처럼 사용자의 이동 명령에 맞춰 화면을 전환해주는 내비게이션 시스템입니다.",
    categoryId: 2
  },
  {
    term: "Middleware",
    pronunciation: "미들웨어",
    fullName: "",
    meaning: "사용자의 요청이 최종 목적지에 도달하기 전에 중간에서 가로채 검증이나 처리를 수행하는 계층",
    explanation: "로그인 여부 확인, 관리자 권한 체크, 에러 로그 기록 등을 화면이나 API 컨트롤러에 닿기 전 중간 관문에서 공통으로 처리해주는 통로입니다.",
    categoryId: 2
  },
  {
    term: "Payload",
    pronunciation: "페이로드",
    fullName: "",
    meaning: "네트워크 통신에서 전송하고자 하는 실제 핵심 데이터 내용물 알맹이",
    explanation: "택배 상자에서 송장 스티커나 포장재를 제외한, 고객이 진짜로 받길 원하는 주문 상품 자체에 해당하는 순수 데이터 본문입니다.",
    categoryId: 2
  },
  {
    term: "CORS",
    pronunciation: "코어스",
    fullName: "Cross-Origin Resource Sharing",
    meaning: "내가 만든 웹사이트가 다른 도메인의 서버 API를 호출할 때 브라우저가 차단하지 않도록 허용해주는 보안 정책",
    explanation: "보안을 위해 브라우저는 출처가 다른 서버의 데이터 호출을 기본 차단하므로, 백엔드 서버에서 '이 도메인은 허용함'이라고 명시해 주어야 통신이 가능합니다.",
    categoryId: 2
  },
  {
    term: "Webhook",
    pronunciation: "웹훅 (역방향 API)",
    fullName: "",
    meaning: "특정 이벤트가 발생했을 때 서버가 다른 서버로 즉시 자동 알림을 쏴주는 메커니즘",
    explanation: "주문 결제가 완료되었을 때 결제 대행사(PG사) 서버가 우리 쇼핑몰 서버의 지정된 URL로 '결제 끝났음!' 하고 즉시 통보해주는 역방향 호출입니다.",
    categoryId: 2
  },
  {
    term: "Responsive Web",
    pronunciation: "반응형 웹",
    fullName: "",
    meaning: "PC 모니터, 태블릿, 스마트폰 등 기기 화면 크기에 맞춰 레이아웃이 유연하게 변하는 웹 디자인",
    explanation: "미디어 쿼리(CSS)를 활용해 별도의 모바일 전용 주소 없이도 하나의 웹사이트로 모든 화면 크기에서 최적의 가독성을 제공하는 기법입니다.",
    categoryId: 2
  },
  {
    term: "Bundler",
    pronunciation: "번들러",
    fullName: "",
    meaning: "수십 수백 개로 쪼개진 JS, CSS, 이미지 파일들을 브라우저가 빠르게 읽을 수 있도록 하나로 묶고 압축해주는 도구",
    explanation: "Vite, Webpack, Metro(React Native용) 등이 대표적이며, 코드 경량화와 모듈 결합을 담당하여 웹/앱의 실행 속도를 끌어올립니다.",
    categoryId: 2
  },
  {
    term: "Debounce & Throttle",
    pronunciation: "디바운스 & 쓰로틀",
    fullName: "",
    meaning: "검색창 입력이나 스크롤 시 짧은 시간에 함수가 수백 번 폭주하는 것을 제어하는 성능 최적화 기법",
    explanation: "디바운스는 타이핑이 완전히 끝난 뒤 한 번만 호출하고, 쓰로틀은 스크롤 중에도 일정 시간(예: 0.2초) 간격으로 한 번씩만 호출되도록 제한합니다.",
    categoryId: 2
  },
  {
    term: "SEO",
    pronunciation: "에스이오",
    fullName: "Search Engine Optimization",
    meaning: "구글이나 네이버 같은 검색 엔진 결과 페이지에서 웹사이트가 상위에 노출되도록 최적화하는 작업",
    explanation: "올바른 제목 태그, 메타 설명, 시맨틱 태그 사용 및 빠른 로딩 속도를 확보하여 검색 로봇이 웹사이트를 높게 평가하도록 돕습니다.",
    categoryId: 2
  },
  {
    term: "LocalStorage",
    pronunciation: "로컬 스토리지",
    fullName: "",
    meaning: "브라우저를 껐다 켜도 데이터가 날아가지 않고 영구적으로 보관되는 클라이언트 저장소",
    explanation: "다크모드 설정, 장바구니 임시 보관, 자동 로그인 토큰 등 서버에 매번 묻지 않아도 되는 간단한 텍스트 데이터를 사용자 기기에 저장합니다.",
    categoryId: 2
  },
  {
    term: "Native vs WebView",
    pronunciation: "네이티브 vs 웹뷰",
    fullName: "",
    meaning: "모바일 OS 순수 부품으로 렌더링하는 방식(Native)과 앱 안에 인터넷 브라우저 창을 띄워 웹페이지를 보여주는 방식(WebView)의 차이",
    explanation: "네이티브는 부드럽고 기기 제어가 강력하며, 웹뷰는 한 번 웹을 고치면 앱 심사 없이 즉시 화면이 바뀌는 유지보수의 장점이 있습니다.",
    categoryId: 2
  },
  {
    term: "SDK",
    pronunciation: "에스디케이",
    fullName: "Software Development Kit",
    meaning: "특정 플랫폼이나 서비스용 프로그램을 개발하는 데 필요한 도구, 라이브러리, 문서의 종합 선물세트",
    explanation: "카카오 로그인 SDK, 구글 지도 SDK처럼 타사 서비스를 내 앱에 쉽게 붙일 수 있도록 개발에 필요한 모든 부품을 패키지로 제공하는 키트입니다.",
    categoryId: 2
  },

  // ========================================================
  // 3. 프로그래밍 기초 (categoryId: 3) - 26개
  // ========================================================
  {
    term: "Variable",
    pronunciation: "배리어블 (변수)",
    fullName: "",
    meaning: "언제든지 다른 값으로 바뀔 수 있는 데이터를 담아두는 이름 붙은 상자",
    explanation: "프로그램 안에서 계산 중간 결과나 사용자 입력값을 저장해두고 필요할 때마다 꺼내 쓰거나 덮어쓸 수 있는 저장 공간입니다.",
    categoryId: 3
  },
  {
    term: "Constant",
    pronunciation: "콘스턴트 (상수)",
    fullName: "",
    meaning: "한 번 정해지면 프로그램이 끝날 때까지 절대로 값을 바꿀 수 없는 고정된 값",
    explanation: "원주율(3.14)이나 서버 기본 주소처럼 코드 작성 도중 실수로 값이 바뀌는 것을 방지하기 위해 단단히 고정해두는 변수입니다.",
    categoryId: 3
  },
  {
    term: "Function",
    pronunciation: "펑션 (함수)",
    fullName: "",
    meaning: "특정 작업이나 연산을 수행하도록 미리 작성해둔 재사용 가능한 코드 덩어리",
    explanation: "재료(입력)를 넣으면 정해진 레시피대로 요리하여 완성된 음식(출력)을 내어주는 자판기나 기계에 비유할 수 있습니다.",
    categoryId: 3
  },
  {
    term: "Parameter",
    pronunciation: "파라미터 (매개변수)",
    fullName: "",
    meaning: "함수를 정의할 때 '외부에서 이런 값을 받아오겠다'고 선언해둔 변수 이름",
    explanation: "함수 껍데기를 만들 때 구체적인 값이 들어올 자리를 미리 마련해두는 통로 변수입니다.",
    categoryId: 3
  },
  {
    term: "Argument",
    pronunciation: "아규먼트 (인수 / 인자)",
    fullName: "",
    meaning: "함수를 실제로 실행할 때 괄호 안에 집어넣어 주는 구체적인 실제 값",
    explanation: "더하기 함수를 만들 때 선언한 것은 매개변수이고, 실제로 add(3, 5)를 부를 때 넣은 '3'과 '5'가 인수입니다.",
    categoryId: 3
  },
  {
    term: "Return",
    pronunciation: "리턴 (반환)",
    fullName: "",
    meaning: "함수 내부의 계산 결과를 함수를 호출했던 바깥 자리로 전달하고 함수를 끝내는 명령",
    explanation: "일을 시킨 사람에게 최종 결과 보고서를 제출하는 것과 같으며, return을 만나면 그 즉시 해당 함수는 실행을 종료합니다.",
    categoryId: 3
  },
  {
    term: "Conditional",
    pronunciation: "컨디셔널 (조건문)",
    fullName: "",
    meaning: "주어진 조건이 참(True)이냐 거짓(False)이냐에 따라 코드의 실행 길을 나누는 문법",
    explanation: "if-else 문처럼 '만약 로그인된 상태라면 마이페이지로, 아니면 로그인 창으로 보내라'는 식의 갈림길을 만드는 기초 문법입니다.",
    categoryId: 3
  },
  {
    term: "Loop",
    pronunciation: "루프 (반복문)",
    fullName: "",
    meaning: "특정 조건이 만족되는 동안 동일한 코드를 자동으로 되풀이해 실행하는 문법",
    explanation: "for 문이나 while 문을 사용하여 1,000명의 회원에게 환영 메시지를 보내는 작업을 코드 단 세 줄로 일괄 처리할 수 있습니다.",
    categoryId: 3
  },
  {
    term: "Scope",
    pronunciation: "스코프 (유효 범위)",
    fullName: "",
    meaning: "변수나 함수가 어디까지 살아서 접근 가능한지를 결정하는 유효 영역",
    explanation: "특정 함수 안에서 만든 변수는 그 함수 밖에서는 보이지 않고 사라지는 것처럼, 변수가 살아 숨 쉬는 물리적 코드 경계입니다.",
    categoryId: 3
  },
  {
    term: "Synchronous",
    pronunciation: "싱크로너스 (동기)",
    fullName: "",
    meaning: "앞선 작업이 완전히 끝나야만 다음 작업으로 넘어가는 순차적 실행 방식",
    explanation: "은행 창구에서 앞 손님의 상담이 완전히 끝나야 뒷 손님이 상담을 받을 수 있는 것처럼 한 번에 한 단계씩 차례대로 진행됩니다.",
    categoryId: 3
  },
  {
    term: "Asynchronous",
    pronunciation: "에이싱크로너스 (비동기)",
    fullName: "",
    meaning: "시간이 오래 걸리는 작업의 완료를 기다리지 않고 바로 다음 작업을 실행하는 방식",
    explanation: "카페에서 커피 주문 후 진동벨을 받고 자리에 가서 스마트폰을 하다가 벨이 울리면 커피를 받는 것처럼 화면 멈춤 없이 효율적으로 동작합니다.",
    categoryId: 3
  },
  {
    term: "Promise",
    pronunciation: "프로미스",
    fullName: "",
    meaning: "비동기 작업이 미래에 성공할지 실패할지 결과를 약속해주는 자바스크립트 객체",
    explanation: "지금 당장은 결과가 안 나왔지만 '데이터 다운로드가 끝나면 성공(Resolve)값을 주고, 에러가 나면 실패(Reject)를 알리겠다'는 증서입니다.",
    categoryId: 3
  },
  {
    term: "Async / Await",
    pronunciation: "에이싱크 / 어웨이트",
    fullName: "",
    meaning: "비동기 코드를 마치 한 줄씩 순서대로 실행되는 동기 코드처럼 깔끔하게 작성하는 문법",
    explanation: "복잡한 콜백 함수 지옥이나 체이닝 없이 직관적으로 '이 데이터가 올 때까지 기다렸다가 다음 줄을 실행해'라고 읽기 쉽게 작성하는 모던 문법입니다.",
    categoryId: 3
  },
  {
    term: "Callback",
    pronunciation: "콜백 함수",
    fullName: "",
    meaning: "어떤 작업이 끝난 뒤에 나중에 실행해 달라고 다른 함수에 인수로 넘겨주는 함수",
    explanation: "'타이머가 3초 지나면 이 함수를 실행해줘', '사용자가 버튼을 누르면 이 함수를 호출해줘'처럼 나중에 불려지기를 기다리는 함수입니다.",
    categoryId: 3
  },
  {
    term: "Null & Undefined",
    pronunciation: "널 & 언디파인드",
    fullName: "",
    meaning: "'고의로 비워둔 빈 상자'(Null)와 '아예 아무 값도 들어오지 않아 알 수 없는 상태'(Undefined)",
    explanation: "초보 개발자가 가장 많이 만나는 'Cannot read properties of undefined' 에러의 원인으로, 데이터의 부재 상태를 엄격히 구분하는 개념입니다.",
    categoryId: 3
  },
  {
    term: "Exception Handling",
    pronunciation: "익셉션 핸들링 (예외 처리)",
    fullName: "",
    meaning: "예기치 못한 에러가 발생해도 프로그램이 튕기거나 먹통이 되지 않도록 안전하게 감싸는 장치",
    explanation: "try-catch 문을 이용해 네트워크 장애나 잘못된 입력값이 들어와도 앱이 강제 종료되지 않고 '잠시 후 다시 시도해주세요'라며 우아하게 대응하게 합니다.",
    categoryId: 3
  },
  {
    term: "Refactoring",
    pronunciation: "리팩토링",
    fullName: "",
    meaning: "프로그램의 겉보기 기능 동작은 그대로 유지한 채 내부 코드 구조와 가독성을 개선하는 작업",
    explanation: "방 청소나 낡은 배관을 교체하듯이, 지저분하고 얽힌 코드를 정리하여 향후 버그를 줄이고 새 기능을 쉽게 붙일 수 있게 체질을 개선합니다.",
    categoryId: 3
  },
  {
    term: "Debugging",
    pronunciation: "디버깅",
    fullName: "",
    meaning: "프로그램에서 발생하는 오류(버그)의 원인을 찾아내어 수정하는 모든 과정",
    explanation: "콘솔 로그(console.log)를 찍어보거나 중단점(Breakpoint)을 걸어 데이터 흐름을 한 줄씩 추적하면서 논리적 오류를 제거하는 행위입니다.",
    categoryId: 3
  },
  {
    term: "Syntax Error",
    pronunciation: "신택스 에러 (문법 오류)",
    fullName: "",
    meaning: "프로그래밍 언어의 기본 문법 규칙을 어겨 프로그램이 실행조차 되지 못하는 오류",
    explanation: "괄호를 닫지 않았거나 따옴표 철자를 빼먹었을 때 에디터가 빨간 줄을 긋고 컴파일을 거부하는 가장 기초적인 에러입니다.",
    categoryId: 3
  },
  {
    term: "Runtime Error",
    pronunciation: "런타임 에러",
    fullName: "",
    meaning: "문법상으로는 이상이 없으나, 프로그램이 실제로 실행되던 도중 예기치 못한 상황을 만나 뻗어버리는 오류",
    explanation: "0으로 나누기를 시도하거나 없는 객체의 속성을 읽으려 할 때 등, 실제 사용자가 앱을 조작하는 도중에 화면이 꺼지거나 멈추는 에러입니다.",
    categoryId: 3
  },
  {
    term: "Type",
    pronunciation: "타입 (자료형)",
    fullName: "Data Type",
    meaning: "컴퓨터가 다루는 데이터 값의 종류 (숫자, 문자열, 불리언, 객체 등)",
    explanation: "컴퓨터가 1 + 1을 숫자 2로 계산할지 문자 '11'로 이어붙일지 결정하는 기준이며, TypeScript를 쓰면 타입 실수를 사전에 원천 차단할 수 있습니다.",
    categoryId: 3
  },
  {
    term: "Type Casting",
    pronunciation: "타입 캐스팅 (형변환)",
    fullName: "Type Conversion / Coercion",
    meaning: "한 데이터 타입의 값을 다른 데이터 타입으로 변환하는 작업",
    explanation: "문자열 '100'을 숫자 100으로 바꾸어 덧셈 연산을 가능하게 하거나, 숫자를 문자열로 바꾸어 화면에 출력할 때 사용합니다.",
    categoryId: 3
  },
  {
    term: "Immutability",
    pronunciation: "이뮤터빌리티 (불변성)",
    fullName: "",
    meaning: "한 번 생성된 데이터 원본을 직접 수정하지 않고, 복사본을 만들어 변경하는 개발 원칙",
    explanation: "React에서 상태를 다룰 때 원본 배열을 직접 건드리지 않고 스프레드 연산자([...arr])로 복사하여 수정해야 화면 리렌더링이 정확하게 감지됩니다.",
    categoryId: 3
  },
  {
    term: "Recursion",
    pronunciation: "리커전 (재귀)",
    fullName: "",
    meaning: "어떤 함수가 문제 해결을 위해 함수 내부에서 자기 자신을 다시 호출하는 기법",
    explanation: "폴더 안의 하위 폴더들을 끝까지 파고들며 탐색하거나 댓글의 대댓글 구조를 화면에 펼칠 때 직관적으로 쓰이는 알고리즘 방식입니다.",
    categoryId: 3
  },
  {
    term: "Garbage Collection",
    pronunciation: "가비지 컬렉션 (GC)",
    fullName: "",
    meaning: "더 이상 프로그램에서 참조하지 않는 쓰레기 메모리를 엔진이 알아서 자동으로 청소해주는 기능",
    explanation: "C언어처럼 개발자가 일일이 메모리를 해제하지 않아도, JavaScript나 Python 같은 모던 언어 가상머신이 메모리 누수를 스스로 방지해줍니다.",
    categoryId: 3
  },
  {
    term: "Dependency",
    pronunciation: "디펜던시 (의존성)",
    fullName: "",
    meaning: "내 코드가 올바르게 작동하기 위해 다른 외부 모듈이나 라이브러리에 기대고 있는 관계",
    explanation: "package.json 파일에 적힌 외부 패키지 목록처럼, 특정 기능(예: 날짜 계산, DB 접속)을 외부 라이브러리에 의존하는 구조를 뜻합니다.",
    categoryId: 3
  },

  // ========================================================
  // 4. 서버 · 네트워크 (categoryId: 4) - 23개
  // ========================================================
  {
    term: "Server",
    pronunciation: "서버",
    fullName: "",
    meaning: "네트워크를 통해 다른 컴퓨터(클라이언트)의 요청을 받아 서비스를 제공해주는 컴퓨터",
    explanation: "24시간 켜져 있으면서 웹페이지 데이터, 데이터베이스 정보, 로그인 처리 등을 사용자들의 스마트폰이나 PC로 전달해주는 중심 컴퓨터입니다.",
    categoryId: 4
  },
  {
    term: "Client",
    pronunciation: "클라이언트",
    fullName: "",
    meaning: "서버에 서비스를 요청하고 그 결과를 받아 이용하는 사용자 측 컴퓨터나 스마트폰 브라우저",
    explanation: "웹 브라우저(크롬, 사파리)나 스마트폰 모바일 앱처럼 서버에 '이 화면 데이터 좀 줘'라고 요청하는 손님에 해당합니다.",
    categoryId: 4
  },
  {
    term: "HTTP",
    pronunciation: "에이치티티피",
    fullName: "HyperText Transfer Protocol",
    meaning: "인터넷 세상에서 클라이언트와 서버가 웹페이지와 데이터를 주고받기 위해 맺은 가장 기본적인 대화 규칙",
    explanation: "텍스트 기반의 통신 규약으로, 전 세계 모든 브라우저와 웹 서버가 이 규칙을 준수하여 상호작용합니다.",
    categoryId: 4
  },
  {
    term: "HTTPS",
    pronunciation: "에이치티티피에스",
    fullName: "HyperText Transfer Protocol Secure",
    meaning: "HTTP 통신 과정 전체를 SSL/TLS 암호화로 감싸 해킹과 도청을 원천 차단한 안전한 프로토콜",
    explanation: "브라우저 주소창에 자물쇠 아이콘이 뜨는 사이트로, 비밀번호나 결제 카드 번호가 네트워크 전송 중에 중간에서 털리지 않도록 보호합니다.",
    categoryId: 4
  },
  {
    term: "Status Code",
    pronunciation: "스테이터스 코드 (HTTP 상태 코드)",
    fullName: "HTTP Status Code",
    meaning: "서버가 클라이언트의 요청을 어떻게 처리했는지 알려주는 세 자리 표준 숫자 응답",
    explanation: "200번대는 성공(OK), 400번대는 클라이언트 실수(404 Not Found), 500번대는 서버 내부 폭발(500 Internal Server Error)을 뜻합니다.",
    categoryId: 4
  },
  {
    term: "Header & Body",
    pronunciation: "헤더 & 바디",
    fullName: "HTTP Header & Body",
    meaning: "네트워크 통신의 메타 정보(인증키, 형식)를 담는 헤더와 실제 내용물 데이터를 담는 바디",
    explanation: "편지 봉투의 수신인 주소와 우표가 '헤더'라면 편지 봉투 안에 든 실제 편지지 알맹이 글이 '바디'에 해당합니다.",
    categoryId: 4
  },
  {
    term: "DNS",
    pronunciation: "디엔에스",
    fullName: "Domain Name System",
    meaning: "사람이 외우기 쉬운 영문 도메인 주소를 컴퓨터가 이해하는 숫자 IP 주소로 바꿔주는 인터넷 전화번호부",
    explanation: "사용자가 'google.com'을 입력했을 때 실제 통신에 필요한 '142.250.190.46' 같은 IP 주소를 전 세계 DNS 서버가 실시간으로 찾아 연결해줍니다.",
    categoryId: 4
  },
  {
    term: "IP Address",
    pronunciation: "아이피 주소",
    fullName: "Internet Protocol Address",
    meaning: "인터넷에 연결된 모든 기기(컴퓨터, 스마트폰, 서버)가 서로를 구별하기 위해 갖는 고유한 고유 번지수",
    explanation: "우리 집 도로명 주소처럼 인터넷 통신망에서 데이터 패킷이 정확한 목적지 기기로 배달될 수 있도록 부여된 숫자 주소입니다.",
    categoryId: 4
  },
  {
    term: "Port",
    pronunciation: "포트 번호",
    fullName: "",
    meaning: "한 컴퓨터 안에서 여러 개의 프로그램 중 어떤 프로그램으로 데이터를 보낼지 정하는 문 번호",
    explanation: "아파트 번지수(IP) 안에서 '101호는 웹 서버(80)', '102호는 보안웹(443)', '3000호는 React 개발서버'처럼 구체적인 방 번호에 비유됩니다.",
    categoryId: 4
  },
  {
    term: "Latency",
    pronunciation: "레이턴시 (지연 시간)",
    fullName: "",
    meaning: "사용자가 요청을 보낸 순간부터 서버로부터 첫 응답이 도착할 때까지 걸리는 왕복 물리적 시간",
    explanation: "보통 밀리초(ms) 단위로 측정되며, 레이턴시가 낮을수록 버튼을 눌렀을 때 체감 반응 속도가 번개처럼 빠릅니다.",
    categoryId: 4
  },
  {
    term: "Throughput / TPS",
    pronunciation: "스루풋 / 티피에스",
    fullName: "Throughput / Transactions Per Second",
    meaning: "시스템이 1초 동안 얼마나 많은 요청과 데이터를 처리해낼 수 있는지를 나타내는 처리량 지표",
    explanation: "고속도로에 차가 얼마나 막힘없이 많이 통과하는지의 대역폭 역량으로, 대규모 트래픽 감당 능력을 가늠하는 핵심 척도입니다.",
    categoryId: 4
  },
  {
    term: "Reverse Proxy",
    pronunciation: "리버스 프록시",
    fullName: "",
    meaning: "클라이언트와 내부 백엔드 서버 사이에서 트래픽을 대신 받아 중계하고 방어해주는 전방 방패 서버",
    explanation: "Nginx가 대표적이며, 실제 내부 서버의 IP를 외부에 숨기고 SSL 암호화 해제 및 부하 분산을 대행하여 보안과 성능을 높입니다.",
    categoryId: 4
  },
  {
    term: "Load Balancer",
    pronunciation: "로드 밸런서 (부하 분산기)",
    fullName: "",
    meaning: "특정 서버 하나에 과부하가 걸려 터지지 않도록 트래픽을 여러 대의 서버로 골고루 나누어 주는 교통정리 장치",
    explanation: "은행 창구가 여러 개 있을 때 번호표 기계가 손님들을 비어있는 창구로 적절히 나누어 안내하는 것과 같은 역할을 합니다.",
    categoryId: 4
  },
  {
    term: "Cookie",
    pronunciation: "쿠키",
    fullName: "",
    meaning: "웹 서버가 사용자의 브라우저에 몰래 저장해두는 아주 작은 텍스트 데이터 조각",
    explanation: "'오늘 하루 이 창 열지 않기' 체크 여부나 쇼핑몰 장바구니 품목처럼 브라우저가 보관하다가 서버에 요청할 때마다 자동으로 함께 전송합니다.",
    categoryId: 4
  },
  {
    term: "Session",
    pronunciation: "세션",
    fullName: "",
    meaning: "로그인한 사용자의 민감한 인증 정보를 서버 컴퓨터의 메모리에 안전하게 기억해두는 방식",
    explanation: "브라우저에는 암호화된 세션 ID 번호표만 쥐어주고, 실제 유저 정보는 안전한 서버 내부 메모리에 보관하여 위변조를 막는 전통적 로그인 관리법입니다.",
    categoryId: 4
  },
  {
    term: "WebSocket",
    pronunciation: "웹소켓",
    fullName: "",
    meaning: "연결을 끊지 않고 브라우저와 서버가 실시간으로 고속 양방향 대화를 주고받는 통신 기술",
    explanation: "카카오톡 채팅, 주식 실시간 호가창, 멀티플레이 온라인 게임처럼 새로고침 없이 즉각적인 데이터 전달이 필수인 곳에 쓰입니다.",
    categoryId: 4
  },
  {
    term: "SSE",
    pronunciation: "에스에스이",
    fullName: "Server-Sent Events",
    meaning: "서버가 클라이언트 방향으로 데이터를 한 글자씩 실시간으로 밀어 넣어주는 단방향 스트리밍 기술",
    explanation: "ChatGPT처럼 AI가 답변을 생성하는 족족 타자기처럼 브라우저 화면에 실시간으로 글자가 주르륵 뜨게 만들 때 가장 널리 쓰입니다.",
    categoryId: 4
  },
  {
    term: "Rate Limit",
    pronunciation: "레이트 리밋 (호출 제한)",
    fullName: "",
    meaning: "단시간 내에 무리한 API 호출 폭주를 막기 위해 분당 요청 가능 횟수를 제한하는 방어선",
    explanation: "서버 과부하나 해킹을 막기 위해 '1분에 60번 초과 호출 시 429 Too Many Requests 에러'를 반환하며, 유료 AI API 연동 시 필수적으로 관리해야 합니다.",
    categoryId: 4
  },
  {
    term: "Endpoint",
    pronunciation: "엔드포인트",
    fullName: "",
    meaning: "API 서버에서 특정 자원이나 기능에 접근할 수 있도록 열어둔 구체적인 URL 목적지",
    explanation: "'https://api.voca.com/terms', 'https://api.voca.com/login'처럼 클라이언트가 요청을 쏘는 서버 측 종착지 주소입니다.",
    categoryId: 4
  },
  {
    term: "GraphQL",
    pronunciation: "그래프큐엘",
    fullName: "",
    meaning: "클라이언트가 필요한 데이터 필드만 콕 집어서 단 한 번의 요청으로 받아오는 페이스북이 만든 차세대 쿼리 언어",
    explanation: "REST API처럼 불필요한 데이터까지 몽땅 받아오는 낭비(Over-fetching)나 여러 번 호출해야 하는 비효율(Under-fetching)을 완벽히 해결합니다.",
    categoryId: 4
  },
  {
    term: "SSL / TLS",
    pronunciation: "에스에스엘 / 티엘에스",
    fullName: "Transport Layer Security",
    meaning: "네트워크 통신 전송 구간 전체를 암호화하여 중간자의 도청과 조작을 방지하는 보안 표준",
    explanation: "웹 서버와 브라우저 사이에 보안 터널을 뚫어 HTTPS 통신을 가능하게 해주는 암호화 인증서의 핵심 기술입니다.",
    categoryId: 4
  },
  {
    term: "gRPC",
    pronunciation: "지알피씨",
    fullName: "Google Remote Procedure Call",
    meaning: "구글이 개발한 프로토콜 버퍼 기반의 초경량·초고속 서버 간 원격 프로시저 호출 통신 규약",
    explanation: "JSON보다 훨씬 작고 빠른 이진(Binary) 데이터를 사용해 대규모 마이크로서비스(MSA) 환경에서 백엔드 서버끼리 통신할 때 주로 사용됩니다.",
    categoryId: 4
  },
  {
    term: "Polling vs Long-Polling",
    pronunciation: "폴링 vs 롱폴링",
    fullName: "",
    meaning: "새 데이터가 왔는지 클라이언트가 1초마다 계속 찔러보기(폴링) vs 새 데이터가 생길 때까지 서버가 응답을 쥐고 대기하기(롱폴링)",
    explanation: "웹소켓 지원이 어려운 환경에서 실시간 느낌의 알림이나 상태 변경을 구현하기 위해 사용하는 고전적 테크닉입니다.",
    categoryId: 4
  },

  // ========================================================
  // 5. 데이터베이스 (categoryId: 5) - 22개
  // ========================================================
  {
    term: "RDBMS",
    pronunciation: "알디비엠에스",
    fullName: "Relational Database Management System",
    meaning: "행(Row)과 열(Column)로 구성된 엑셀 표(Table) 형태로 데이터를 정리하고 관계를 맺어 관리하는 전통적 DB",
    explanation: "MySQL, PostgreSQL, Oracle, SQLite 등이 있으며, 데이터의 정확성과 엄격한 규칙이 생명인 금융, 결제, 회원 시스템에 최적입니다.",
    categoryId: 5
  },
  {
    term: "NoSQL",
    pronunciation: "노에스큐엘",
    fullName: "Not Only SQL",
    meaning: "정형화된 표 형태를 벗어나 JSON 문서나 키-값 형태로 유연하게 대용량 분산 데이터를 다루는 DB",
    explanation: "MongoDB, DynamoDB, Redis 등이 대표적이며, 데이터 구조가 자주 바뀌거나 초당 수만 건의 비정형 로그를 처리할 때 뛰어난 확장성을 보여줍니다.",
    categoryId: 5
  },
  {
    term: "SQL",
    pronunciation: "에스큐엘 (또는 시퀄)",
    fullName: "Structured Query Language",
    meaning: "데이터베이스에게 '이 데이터 찾아줘, 추가해줘, 지워줘'라고 명령하는 표준 컴퓨터 언어",
    explanation: "SELECT, INSERT, UPDATE, DELETE 같은 영어 단어로 명령을 내려 전 세계 거의 모든 관계형 데이터베이스를 자유자재로 조작합니다.",
    categoryId: 5
  },
  {
    term: "CRUD",
    pronunciation: "크루드",
    fullName: "Create, Read, Update, Delete",
    meaning: "소프트웨어에서 데이터를 다루는 가장 기본적인 4가지 핵심 기능 (생성, 조회, 수정, 삭제)",
    explanation: "게시판의 글쓰기(Create), 글읽기(Read), 글수정(Update), 글삭제(Delete)처럼 세상 모든 비즈니스 앱 기능의 뼈대를 이루는 4대 연산입니다.",
    categoryId: 5
  },
  {
    term: "Primary Key",
    pronunciation: "프라이머리 키 (기본키 / PK)",
    fullName: "Primary Key",
    meaning: "테이블 안에서 각 행(Row) 데이터를 유일하게 식별할 수 있는 중복 없는 고유 주민등록번호 같은 열",
    explanation: "회원 테이블의 '유저 고유 ID'처럼 중복되거나 비어있을 수 없으며, 데이터를 초고속으로 조회하는 핵심 기준이 됩니다.",
    categoryId: 5
  },
  {
    term: "Foreign Key",
    pronunciation: "포린 키 (외래키 / FK)",
    fullName: "Foreign Key",
    meaning: "다른 테이블의 기본키를 참조하여 두 테이블 사이의 부모-자식 관계를 맺어주는 열",
    explanation: "'주문 목록' 테이블에서 '누가 주문했는가'를 가리키기 위해 '회원' 테이블의 기본키(id)를 가져와 보관하는 참조 고리입니다.",
    categoryId: 5
  },
  {
    term: "Schema",
    pronunciation: "스키마",
    fullName: "",
    meaning: "데이터베이스에 어떤 이름의 테이블이 있고 각 컬럼의 타입과 제약조건이 무엇인지 정의한 전체 설계도",
    explanation: "건물을 짓기 전 그리는 청사진처럼 데이터베이스의 구조, 규칙, 관계를 엄격히 규정한 뼈대 문서입니다.",
    categoryId: 5
  },
  {
    term: "Index",
    pronunciation: "인덱스 (색인)",
    fullName: "",
    meaning: "책 맨 뒤의 '찾아보기' 색인처럼 특정 열의 검색 속도를 번개처럼 빠르게 만들어주는 데이터베이스 색인",
    explanation: "수천만 건의 회원 데이터 중 이메일로 검색할 때 전체를 다 뒤지지 않고 인덱스 트리를 통해 0.001초 만에 찾아내게 돕습니다.",
    categoryId: 5
  },
  {
    term: "Transaction",
    pronunciation: "트랜잭션",
    fullName: "",
    meaning: "더 이상 쪼갤 수 없는 하나의 완결된 작업 단위 (전부 성공하거나, 아니면 아예 없었던 일로 취소)",
    explanation: "계좌 이체 시 '내 통장에서 돈 빠져나감'과 '상대 통장에 돈 입금됨' 중 하나라도 실패하면 전체를 취소해야 하는 불가분의 작업 단위입니다.",
    categoryId: 5
  },
  {
    term: "ACID",
    pronunciation: "에이시드",
    fullName: "Atomicity, Consistency, Isolation, Durability",
    meaning: "데이터베이스 트랜잭션의 신뢰성을 보장하는 4대 절대 원칙 (원자성, 일관성, 격리성, 지속성)",
    explanation: "작업이 도중에 실패하면 없던 일로 되돌리고(원자성), 완료된 결과는 시스템이 꺼져도 영구 보존(지속성)되어 금융권 신뢰성을 지킵니다.",
    categoryId: 5
  },
  {
    term: "ORM",
    pronunciation: "오알엠",
    fullName: "Object-Relational Mapping",
    meaning: "직접 복잡한 SQL 쿼리문을 작성하지 않고 자바스크립트/파이썬 객체와 메서드로 DB를 조작하게 해주는 기술",
    explanation: "Prisma, TypeORM, Drizzle 등이 있으며, 'User.find({ id: 1 })'처럼 친숙한 프로그래밍 코드로 데이터베이스를 다룰 수 있게 해줍니다.",
    categoryId: 5
  },
  {
    term: "Migration",
    pronunciation: "마이그레이션",
    fullName: "",
    meaning: "데이터베이스의 테이블 구조(스키마) 변경 이력을 코드처럼 버전별로 관리하고 안전하게 적용하는 과정",
    explanation: "새 기능 개발로 컬럼이 추가되거나 이름이 바뀔 때 실서버 데이터 손실 없이 안전하게 스키마를 업데이트해주는 변경 스크립트입니다.",
    categoryId: 5
  },
  {
    term: "Redis",
    pronunciation: "레디스",
    fullName: "Remote Dictionary Server",
    meaning: "하드디스크가 아닌 초고속 메모리(RAM)에 데이터를 저장하여 밀리초 단위로 조회하는 인메모리 키-값 저장소",
    explanation: "자주 조회되는 인기 게시글 캐싱, 실시간 로그인 세션 보관, 선착순 티케팅 대기열 구현 등에 필수적으로 쓰이는 고속 DB입니다.",
    categoryId: 5
  },
  {
    term: "Join",
    pronunciation: "조인",
    fullName: "",
    meaning: "서로 관련된 두 개 이상의 테이블을 연결 고리(외래키)를 바탕으로 합쳐서 하나의 큰 결과표로 조회하는 SQL 기법",
    explanation: "'주문 테이블'과 '고객 테이블'을 조인하여 '어떤 고객이 무슨 상품을 몇 개 주문했는가'를 한눈에 볼 수 있는 통합 데이터를 만듭니다.",
    categoryId: 5
  },
  {
    term: "Sharding",
    pronunciation: "샤딩 (수평 분할)",
    fullName: "",
    meaning: "데이터가 너무 거대해졌을 때 여러 대의 분산 DB 서버에 나누어 저장하는 기법",
    explanation: "회원 번호 1~100만 번은 1번 DB 서버에, 101만~200만 번은 2번 DB 서버에 나누어 담아 단일 서버 용량 한계를 극복합니다.",
    categoryId: 5
  },
  {
    term: "Replication",
    pronunciation: "레플리케이션 (복제)",
    fullName: "",
    meaning: "원본 DB(Primary)의 데이터를 실시간으로 보조 DB(Replica)에 복제해두는 이중화 기술",
    explanation: "쓰기/수정 작업은 원본에서만 하고 읽기 조회는 여러 복제본에서 분산 처리하여 속도를 올리고, 원본이 죽었을 때 즉시 대체할 수 있게 대비합니다.",
    categoryId: 5
  },
  {
    term: "N+1 Problem",
    pronunciation: "엔 플러스 원 문제",
    fullName: "",
    meaning: "ORM 사용 시 한 번의 쿼리로 끝날 일을 연관 관계마다 반복 호출해 쿼리가 수백 번 터지는 대표적 성능 병목 현상",
    explanation: "게시글 100개를 가져오면서 작성자 이름을 가져오기 위해 추가 쿼리가 100번 더 나가 총 101번의 쿼리가 실행되어 서버가 느려지는 현상입니다.",
    categoryId: 5
  },
  {
    term: "Connection Pool",
    pronunciation: "커넥션 풀",
    fullName: "",
    meaning: "DB 연결 통로를 매번 새로 맺고 끊는 비용을 아끼기 위해 미리 여러 개를 열어두고 재사용하는 대기소",
    explanation: "사용자 요청이 들어올 때마다 대기 중인 연결 통로를 하나 빌려주어 쿼리를 실행한 뒤 반납받는 방식으로 서버의 응답 속도를 크게 개선합니다.",
    categoryId: 5
  },
  {
    term: "Cascade",
    pronunciation: "캐스케이드 (연쇄 처리)",
    fullName: "",
    meaning: "부모 테이블의 데이터가 삭제되거나 수정될 때 연결된 자식 데이터까지 연쇄적으로 함께 처리하는 규칙",
    explanation: "회원이 탈퇴하면 그 회원이 썼던 글과 댓글도 함께 지워지게 설정(ON DELETE CASCADE)하여 쓰레기 유령 데이터가 남는 것을 방지합니다.",
    categoryId: 5
  },
  {
    term: "Soft Delete",
    pronunciation: "소프트 딜리트 (논리 삭제)",
    fullName: "",
    meaning: "데이터를 DB에서 완전히 지우지 않고 '삭제일시(deleted_at)' 컬럼만 채워 화면에서만 숨겨두는 안전 보관 기법",
    explanation: "실수로 지운 데이터를 복구하거나 회원 탈퇴 후 법적 보관 기간을 준수하기 위해 실무 서비스에서 보편적으로 사용합니다.",
    categoryId: 5
  },
  {
    term: "Deadlock",
    pronunciation: "데드락 (교착 상태)",
    fullName: "",
    meaning: "두 개 이상의 트랜잭션이 서로가 쥐고 있는 자원의 락(Lock)이 풀리기만을 기다리며 무한 대기에 빠지는 현상",
    explanation: "서로 비켜주지 않는 좁은 골목길의 두 자동차처럼 아무 작업도 진행되지 못하고 멈춰버려 DB 엔진이 강제로 하나를 취소시켜야 해결됩니다.",
    categoryId: 5
  },
  {
    term: "Normalization",
    pronunciation: "노멀라이제이션 (정규화)",
    fullName: "",
    meaning: "데이터의 중복을 제거하고 무결성을 지키기 위해 테이블을 규칙에 따라 체계적으로 분해하는 설계 기법",
    explanation: "한 테이블에 모든 정보를 쑤셔 넣지 않고 고객 테이블, 상품 테이블로 분리하여 데이터 수정 시 오류와 불일치를 원천 방지합니다.",
    categoryId: 5
  },

  // ========================================================
  // 6. 개발 도구 · Git (categoryId: 6) - 23개
  // ========================================================
  {
    term: "Git",
    pronunciation: "깃",
    fullName: "",
    meaning: "코드의 모든 변경 이력을 시간대별로 기록하고 관리하는 분산 버전 관리 시스템",
    explanation: "코드 작업 도중 문제가 생기면 언제든 과거 특정 시점으로 되돌릴 수 있고, 수많은 개발자가 동시에 협업할 수 있게 해주는 개발 필수 도구입니다.",
    categoryId: 6
  },
  {
    term: "Repository",
    pronunciation: "리포지토리 (저장소 / Repo)",
    fullName: "",
    meaning: "프로젝트의 모든 소스코드 파일과 Git 변경 이력 전체가 보관되는 프로젝트의 집",
    explanation: "내 컴퓨터 로컬에 있는 '로컬 저장소'와 GitHub 같은 클라우드 웹에 올라가 있는 '원격 저장소'로 나뉩니다.",
    categoryId: 6
  },
  {
    term: "Commit",
    pronunciation: "커밋",
    fullName: "",
    meaning: "코드의 수정 사항들을 의미 있는 하나의 단위로 묶어 영구적인 스냅샷 기록으로 남기는 행동",
    explanation: "게임의 '세이브포인트(저장)'와 같으며, '어떤 버그를 고쳤는지' 명확한 커밋 메시지를 적어두어 나중에 쉽게 추적할 수 있게 합니다.",
    categoryId: 6
  },
  {
    term: "Branch",
    pronunciation: "브랜치 (가지)",
    fullName: "",
    meaning: "메인 코드에 영향을 주지 않고 새로운 기능 개발이나 실험을 하기 위해 갈라져 나온 독립된 작업 공간",
    explanation: "원래 나무줄기(main)는 온전히 보존한 채 새 가지(feature)를 쳐서 마음껏 개발해본 뒤 완성되면 합칠 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Merge",
    pronunciation: "머지 (병합)",
    fullName: "",
    meaning: "별도의 브랜치에서 완료된 작업 결과물을 기준 브랜치(main)로 합쳐 하나로 만드는 작업",
    explanation: "새로운 기능 개발이나 버그 수정을 마친 후 메인 서비스 코드에 작업 내용을 안전하게 합체시키는 절차입니다.",
    categoryId: 6
  },
  {
    term: "Pull Request",
    pronunciation: "풀 리퀘스트 (PR)",
    fullName: "Pull Request",
    meaning: "내가 작업한 브랜치의 코드를 메인 브랜치에 합쳐달라고 동료들에게 검토(코드 리뷰)를 요청하는 공식 절차",
    explanation: "GitHub 협업의 핵심 문화로, 다른 팀원이 내 코드를 확인하고 승인(Approve)해야만 메인 브랜치로 최종 병합할 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Conflict",
    pronunciation: "컨플릭트 (충돌)",
    fullName: "",
    meaning: "두 명 이상의 개발자가 같은 파일의 같은 위치를 동시에 수정하여 Git이 스스로 판단하지 못하고 멈추는 현상",
    explanation: "어떤 코드가 진짜 맞는지 사람이 직접 눈으로 보고 둘 중 하나를 선택하거나 합쳐서 충돌을 풀어주어야 병합이 완료됩니다.",
    categoryId: 6
  },
  {
    term: "Staging",
    pronunciation: "스테이징 (준비 영역)",
    fullName: "Staging Area / Index",
    meaning: "커밋으로 영구 기록하기 전에 이번 커밋에 포함할 변경 파일들만 골라 올려놓는 무대 대기실",
    explanation: "'git add' 명령어로 변경된 파일 중 이번 커밋에 담고 싶은 파일만 스테이지 무대에 올려놓고 한 번에 깔끔하게 커밋합니다.",
    categoryId: 6
  },
  {
    term: "CLI",
    pronunciation: "씨엘아이",
    fullName: "Command Line Interface",
    meaning: "마우스 클릭 대신 검은 터미널 화면에 키보드로 글자 명령어를 직접 입력해 컴퓨터를 제어하는 방식",
    explanation: "Git 명령어, 빌드 실행, 패키지 설치 등을 마우스보다 훨씬 정밀하고 빠르게 자동화하여 처리할 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Environment Variable",
    pronunciation: "환경 변수 (.env)",
    fullName: "Environment Variable",
    meaning: "API 비밀키나 DB 접속 주소처럼 코드에 노출되면 안 되는 민감한 비밀값을 운영체제에 숨겨두는 변수",
    explanation: "깃허브에 코드를 올려도 비밀키가 유출되지 않도록 '.env' 파일에 분리하여 보관하고 코드에서 안전하게 읽어옵니다.",
    categoryId: 6
  },
  {
    term: "Package Manager",
    pronunciation: "패키지 매니저",
    fullName: "",
    meaning: "외부 라이브러리의 설치, 버전 업데이트, 삭제를 자동으로 관리해주는 도구 (npm, yarn, bun, pnpm)",
    explanation: "개발에 필요한 온갖 오픈소스 부품들을 인터넷 중앙 저장소에서 한 줄 명령어로 다운로드받아 프로젝트에 연결해줍니다.",
    categoryId: 6
  },
  {
    term: "Linter",
    pronunciation: "린터",
    fullName: "",
    meaning: "코드의 잠재적 버그, 문법 오류, 코딩 스타일 위반을 자동으로 검사해 밑줄로 지적해주는 도구 (ESLint)",
    explanation: "사용하지 않는 변수나 오타, 잘못된 문법을 실행하기도 전에 에디터에서 즉시 잡아주어 코드 품질을 유지시킵니다.",
    categoryId: 6
  },
  {
    term: "Stash",
    pronunciation: "스태시 (임시 보관)",
    fullName: "",
    meaning: "아직 커밋하긴 애매하지만 다른 브랜치로 급히 이동해야 할 때 현재 작업 중인 변경 사항을 임시 보관함에 쓱 치워두는 기능",
    explanation: "'git stash'로 작업 중이던 내용을 서랍에 잠깐 넣어두고 깨끗한 상태로 다른 일을 본 뒤 나중에 다시 꺼내올 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Rebase",
    pronunciation: "리베이스",
    fullName: "",
    meaning: "내 브랜치의 시작 베이스 기준점을 최신 메인 브랜치 끝으로 옮겨 커밋 역사를 깔끔한 한 줄로 정리하는 고급 병합 기술",
    explanation: "불필요한 병합 커밋(Merge commit) 없이 마치 처음부터 최신 코드 위에서 작업한 것처럼 커밋 로그를 깔끔하게 일직선으로 폅니다.",
    categoryId: 6
  },
  {
    term: "Cherry-pick",
    pronunciation: "체리픽",
    fullName: "",
    meaning: "다른 브랜치에 있는 수많은 커밋 중 내가 원하는 딱 특정 커밋 1~2개만 쏙 뽑아서 내 브랜치로 가져오는 명령어",
    explanation: "케이크 위의 체리만 쏙 골라 먹듯이, 다른 동료의 브랜치 전체를 합치지 않고 필요한 버그 수정 커밋 하나만 내 쪽으로 가져옵니다.",
    categoryId: 6
  },
  {
    term: "HEAD",
    pronunciation: "헤드",
    fullName: "",
    meaning: "Git에서 현재 내가 작업 중인 위치가 어디인지 가리키고 있는 나침반 포인터",
    explanation: "보통은 현재 작업 중인 브랜치의 가장 최신 커밋을 가리키고 있으며, 체크아웃할 때마다 이 포인터의 위치가 이동합니다.",
    categoryId: 6
  },
  {
    term: ".gitignore",
    pronunciation: "깃 이그노어",
    fullName: "",
    meaning: "node_modules나 .env처럼 용량이 너무 크거나 보안에 민감한 파일을 Git 추적에서 제외시키는 설정 파일",
    explanation: "이 파일 안에 파일명이나 폴더명을 적어두면 Git이 해당 파일들을 완전히 투명인간 취급하여 GitHub에 실수로 올라가는 참사를 막습니다.",
    categoryId: 6
  },
  {
    term: "Reset vs Revert",
    pronunciation: "리셋 vs 리버트",
    fullName: "",
    meaning: "과거로 돌아갈 때 아예 커밋 역사를 없애버리는 것(Reset)과 되돌리는 반대 커밋을 새로 남겨 역사를 보존하는 것(Revert)의 차이",
    explanation: "이미 팀원들과 공유된 GitHub 원격 브랜치에서는 과거를 지우는 Reset 대신 안전하게 Revert를 쓰는 것이 협업의 철칙입니다.",
    categoryId: 6
  },
  {
    term: "Fork",
    pronunciation: "포크",
    fullName: "",
    meaning: "다른 사람이나 기관의 원격 GitHub 저장소를 통째로 내 개인 GitHub 계정 공간으로 복제해오는 기능",
    explanation: "남의 프로젝트에 직접 수정 권한이 없을 때 내 계정으로 포크해와서 자유롭게 고친 뒤 Pull Request를 보내 기여할 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Hotfix",
    pronunciation: "핫픽스",
    fullName: "",
    meaning: "실제 서비스 운영 도중 치명적인 긴급 버그가 터졌을 때 정규 배포 일정과 무관하게 즉시 투입되는 긴급 수정 작업",
    explanation: "정규 릴리즈 사이클을 기다리지 않고 현재 배포된 실서버 코드에서 즉각 가지를 따서 수정한 뒤 즉시 재배포합니다.",
    categoryId: 6
  },
  {
    term: "SSH Key",
    pronunciation: "에스에스에이치 키",
    fullName: "Secure Shell Key",
    meaning: "비밀번호 입력 없이 안전하게 서버나 GitHub에 자동 로그인할 수 있게 해주는 비대칭 암호키 쌍 (공개키/개인키)",
    explanation: "내 컴퓨터에는 개인키(열쇠)를 보관하고 서버에는 공개키(자물쇠)를 등록해두어 안전하고 편리하게 원격 저장소에 푸시합니다.",
    categoryId: 6
  },
  {
    term: "Monorepo",
    pronunciation: "모노레포",
    fullName: "",
    meaning: "웹 프론트, 백엔드 API, 모바일 앱 등 여러 연관 프로젝트를 하나의 거대한 단일 Git 저장소에서 함께 관리하는 방식",
    explanation: "공통 유틸리티나 타입을 프로젝트 간에 쉽게 공유하고 코드 수정 시 연관된 모든 프로젝트를 한 번에 검증할 수 있습니다.",
    categoryId: 6
  },
  {
    term: "Semantic Versioning",
    pronunciation: "시맨틱 버저닝 (유의적 버전)",
    fullName: "",
    meaning: "'주.부.수 (Major.Minor.Patch)' 3자리 숫자 규칙으로 프로그램 버전의 변화 성격을 명확히 전달하는 표준",
    explanation: "v2.1.4처럼 앞자리는 호환성이 깨지는 대규모 변경(Major), 중간은 새 기능 추가(Minor), 끝자리는 단순 버그 수정(Patch)을 뜻합니다.",
    categoryId: 6
  },

  // ========================================================
  // 7. 클라우드 · 배포 · DevOps (categoryId: 7) - 20개
  // ========================================================
  {
    term: "Cloud Computing",
    pronunciation: "클라우드 컴퓨팅",
    fullName: "",
    meaning: "비싼 서버 컴퓨터를 직접 사서 설치하지 않고 아마존(AWS)이나 구글(GCP)의 가상 서버를 인터넷으로 빌려 쓰는 방식",
    explanation: "전기나 수도를 쓴 만큼 요금을 내듯, 필요한 만큼 서버 대수와 용량을 자유롭게 늘리고 줄일 수 있습니다.",
    categoryId: 7
  },
  {
    term: "Deploy",
    pronunciation: "디플로이 (배포)",
    fullName: "",
    meaning: "내 로컬 컴퓨터에서 만든 프로그램과 웹사이트를 실제 사용자가 접속할 수 있는 인터넷 실서버에 올리는 과정",
    explanation: "개발을 완료하고 실제 세상에 소프트웨어를 출시키시는 최종 단계입니다.",
    categoryId: 7
  },
  {
    term: "CI / CD",
    pronunciation: "씨아이 / 씨디",
    fullName: "Continuous Integration / Continuous Deployment",
    meaning: "개발자가 코드를 커밋하면 자동으로 빌드와 테스트를 거쳐 실서버까지 무인으로 자동 배포해주는 파이프라인",
    explanation: "수동으로 서버에 접속해 파일을 복사하는 번거로움과 실수를 없애고, 코드 수정 즉시 몇 분 만에 안전하게 서비스에 반영시킵니다.",
    categoryId: 7
  },
  {
    term: "Docker",
    pronunciation: "도커",
    fullName: "",
    meaning: "프로그램과 실행에 필요한 모든 환경(OS 설정, 라이브러리)을 '컨테이너' 상자에 통째로 패키징해 어디서든 동일하게 실행시키는 기술",
    explanation: "'내 컴퓨터에서는 잘 되는데 왜 서버에서는 안 되지?'라는 악명 높은 환경 불일치 문제를 완벽하게 해결해줍니다.",
    categoryId: 7
  },
  {
    term: "Container",
    pronunciation: "컨테이너",
    fullName: "",
    meaning: "가상머신보다 훨씬 가볍게 운영체제 핵심을 공유하면서도 격리된 독립 환경을 제공하는 실행 상자",
    explanation: "독립된 프로세스 공간에서 앱이 실행되므로 서버 한 대에 수십 개의 컨테이너를 가볍고 빠르게 띄울 수 있습니다.",
    categoryId: 7
  },
  {
    term: "Serverless",
    pronunciation: "서버리스",
    fullName: "",
    meaning: "서버 컴퓨터를 상시 켜두지 않고, 코드가 실행될 때만 컴퓨터 자원을 켜서 쓰고 쓴 시간만큼만 초 단위로 과금하는 방식",
    explanation: "AWS Lambda, Vercel Serverless 등이 대표적이며, 서버 인프라 관리 부담을 완전히 없애줍니다.",
    categoryId: 7
  },
  {
    term: "CDN",
    pronunciation: "씨디엔",
    fullName: "Content Delivery Network",
    meaning: "전 세계 거점마다 캐시 서버를 두고 사용자에게서 가장 물리적으로 가까운 위치에서 웹사이트와 이미지를 초고속으로 전송하는 망",
    explanation: "미국에 있는 원본 서버 대신 서울에 있는 캐시 서버에서 데이터를 바로 쏴주어 로딩 속도를 극대화합니다.",
    categoryId: 7
  },
  {
    term: "Build",
    pronunciation: "빌드",
    fullName: "",
    meaning: "사람이 작성한 원본 소스코드를 컴퓨터가 실행하기에 가장 최적화된 최종 실행 파일 형태로 변환하고 압축하는 과정",
    explanation: "TypeScript를 JavaScript로 변환하고, 코드를 난독화 및 용량 압축하여 배포 가능한 최종 산출물을 뽑아내는 과정입니다.",
    categoryId: 7
  },
  {
    term: "Edge Computing",
    pronunciation: "엣지 컴퓨팅",
    fullName: "",
    meaning: "먼 중앙 클라우드 데이터센터 대신 사용자의 스마트폰 바로 앞단 기지국이나 로컬 캐시 서버에서 즉시 데이터를 처리하는 기술",
    explanation: "지연 시간을 거의 0ms에 가깝게 줄여 초저지연이 생명인 자율주행, 실시간 게임, 모던 웹 최적화에 사용됩니다.",
    categoryId: 7
  },
  {
    term: "Kubernetes",
    pronunciation: "쿠버네티스 (k8s)",
    fullName: "",
    meaning: "수백 수천 개의 도커 컨테이너를 자동으로 띄우고, 죽으면 살려내고, 트래픽에 맞춰 늘려주는 대규모 컨테이너 지휘 오케스트레이션 시스템",
    explanation: "컨테이너의 배포, 확장, 장애 복구를 전자동으로 관리해주는 대기업 및 대규모 서비스 인프라의 표준 운영체제입니다.",
    categoryId: 7
  },
  {
    term: "IaaS / PaaS / SaaS",
    pronunciation: "아이아스 / 파스 / 사스",
    fullName: "Infrastructure / Platform / Software as a Service",
    meaning: "인프라만 빌려주는 IaaS(AWS EC2), 개발 플랫폼까지 주는 PaaS(Vercel, Heroku), 완성된 소프트웨어만 쓰는 SaaS(Notion, Slack)",
    explanation: "클라우드 서비스가 개발자에게 어느 수준까지 관리 책임을 위임하는지를 분류한 3대 서비스 모델입니다.",
    categoryId: 7
  },
  {
    term: "Rollback",
    pronunciation: "롤백 (원상 복구)",
    fullName: "",
    meaning: "신규 버전 배포 후 치명적인 장애나 버그가 발견되었을 때 1초 만에 직전의 정상 작동 버전으로 되돌리는 복구 작업",
    explanation: "배포 사고가 발생했을 때 서비스를 신속하게 살려내어 고객 피해를 최소화하는 필수 안전장치입니다.",
    categoryId: 7
  },
  {
    term: "Blue-Green Deployment",
    pronunciation: "블루-그린 무중단 배포",
    fullName: "",
    meaning: "구버전 서버(Blue)와 신버전 서버(Green)를 동시에 띄워두고 트래픽 스위치만 탁 전환하여 서비스 중단 없이 배포하는 기법",
    explanation: "사용자에게 '점검 중' 안내창을 띄우지 않고 24시간 끊김 없이 신규 버전을 즉각 배포할 수 있는 대표적인 무중단 배포 전략입니다.",
    categoryId: 7
  },
  {
    term: "Canary Deployment",
    pronunciation: "카나리 배포",
    fullName: "",
    meaning: "위험을 감지하는 광산의 카나리아처럼, 전체 사용자의 5%에게만 새 버전을 먼저 열어보고 이상이 없으면 점진적으로 전면 확대하는 배포 방식",
    explanation: "치명적인 버그가 터지더라도 소수의 사용자에게만 영향이 미치게 방어하면서 안전하게 실서비스 반응을 테스트합니다.",
    categoryId: 7
  },
  {
    term: "Auto Scaling",
    pronunciation: "오토 스케일링",
    fullName: "",
    meaning: "트래픽이 폭주하면 서버 대수를 자동으로 늘리고(스케일 아웃), 한산해지면 자동으로 줄여 비용을 아끼는 스마트 확장 기능",
    explanation: "블랙프라이데이나 이벤트 당일 서버가 다운되는 사태를 막아주고, 평상시에는 최소한의 서버만 켜두어 인프라 비용을 극적으로 아낍니다.",
    categoryId: 7
  },
  {
    term: "S3 / Object Storage",
    pronunciation: "에스쓰리 / 객체 스토리지",
    fullName: "Simple Storage Service",
    meaning: "이미지, 동영상, 대용량 파일 등을 용량 제한 없이 안전하고 저렴하게 무제한으로 보관할 수 있는 클라우드 파일 창고",
    explanation: "웹 서버 하드디스크에 이미지를 저장하지 않고 S3에 올려두면 전 세계 누구나 고속으로 다운로드받을 수 있습니다.",
    categoryId: 7
  },
  {
    term: "Health Check",
    pronunciation: "헬스 체크 (생존 확인)",
    fullName: "",
    meaning: "로드밸런서가 각 서버가 살아있는지 주기적으로 찔러보고 죽은 서버에는 트래픽을 보내지 않는 생존 확인 기능",
    explanation: "주기적으로 '너 정상 작동 중이니?' 요청을 보내 응답이 없으면 즉시 트래픽 격리 및 새 컨테이너 재생성을 지시합니다.",
    categoryId: 7
  },
  {
    term: "Microservices / MSA",
    pronunciation: "마이크로서비스 아키텍처",
    fullName: "Microservices Architecture",
    meaning: "하나의 거대한 단일 프로그램 대신 결제, 주문, 회원 등 작고 독립적인 서비스들로 쪼개어 개발·배포하는 설계 방식",
    explanation: "결제 서비스에 장애가 생겨도 장바구니나 상품 둘러보기는 정상 작동하도록 격리성과 유연성을 높입니다.",
    categoryId: 7
  },
  {
    term: "BaaS",
    pronunciation: "바스",
    fullName: "Backend as a Service",
    meaning: "백엔드 서버를 직접 구축하지 않고 Supabase나 Firebase처럼 DB, 회원가입, 스토리지를 통째로 빌려 쓰는 서비스",
    explanation: "바이브코딩의 일등 공신으로, 혼자서 풀스택 앱을 개발할 때 백엔드 구축 시간을 90% 이상 단축시켜줍니다.",
    categoryId: 7
  },
  {
    term: "Ingress",
    pronunciation: "인그레스",
    fullName: "",
    meaning: "쿠버네티스 클러스터 외부에서 들어오는 HTTP/HTTPS 웹 트래픽을 내부의 알맞은 서비스로 안내해주는 관문 규칙",
    explanation: "도메인 이름이나 URL 경로(예: /api는 API 서비스로, /는 웹 프론트로)에 따라 트래픽을 교통정리해주는 관문 라우터입니다.",
    categoryId: 7
  },

  // ========================================================
  // 8. 보안 · 인증 · 신뢰성 (categoryId: 8) - 20개
  // ========================================================
  {
    term: "Authentication",
    pronunciation: "오센티케이션 (인증 / AuthN)",
    fullName: "Authentication",
    meaning: "'당신이 정말 본인이 맞습니까?'를 신분증이나 비밀번호, 지문으로 증명하고 확인하는 절차",
    explanation: "아이디와 비밀번호를 치고 로그인하는 행위 자체로, 시스템에 접속하려는 사람의 신원을 확인하는 1차 관문입니다.",
    categoryId: 8
  },
  {
    term: "Authorization",
    pronunciation: "오소라이제이션 (인가 / 권한 부여 / AuthZ)",
    fullName: "Authorization",
    meaning: "신원이 확인된 사용자에게 '어디까지 접근하고 무엇을 할 수 있는 권한이 있는가'를 판정하는 절차",
    explanation: "로그인된 일반 회원인지 관리자인지 따져서, 관리자 전용 페이지 접근이나 회원 삭제 버튼 노출 여부를 결정합니다.",
    categoryId: 8
  },
  {
    term: "OAuth",
    pronunciation: "오오스 (오픈 인증)",
    fullName: "Open Authorization",
    meaning: "내 비밀번호를 넘겨주지 않고도 '구글로 로그인', '카카오로 로그인'처럼 안전하게 타사 서비스를 이용할 수 있게 해주는 표준 인증 규격",
    explanation: "사용자는 비밀번호 유출 걱정 없이 안전하게 로그인하고, 개발자는 번거로운 회원가입 구현을 쉽게 해결합니다.",
    categoryId: 8
  },
  {
    term: "JWT",
    pronunciation: "제이더블유티 (토큰)",
    fullName: "JSON Web Token",
    meaning: "로그인한 사용자의 정보와 권한을 안전하게 디지털 서명하여 클라이언트가 들고 다니게 하는 디지털 신분증",
    explanation: "서버가 세션 메모리를 유지할 필요 없이 토큰 위변조 서명만 확인하면 되므로 대규모 서버 확장에 최적화된 로그인 방식입니다.",
    categoryId: 8
  },
  {
    term: "API Key",
    pronunciation: "에이피아이 키",
    fullName: "",
    meaning: "OpenAI나 결제 서비스 등의 유료 API를 사용할 자격과 권한을 증명하는 비밀 영문-숫자 암호 문자열",
    explanation: "내 신용카드와 연결된 고유 키이므로 GitHub 등에 절대로 노출되지 않도록 환경 변수(.env)에 엄격히 보관해야 합니다.",
    categoryId: 8
  },
  {
    term: "Hashing",
    pronunciation: "해싱",
    fullName: "",
    meaning: "원래 비밀번호를 복호화가 불가능한 일방향 암호 문자열로 뭉개버려 DB가 털려도 절대 원본을 알 수 없게 만드는 보안 기술",
    explanation: "bcrypt나 SHA-256 같은 단방향 수학 함수를 적용하여 서버 관리자조차도 사용자의 진짜 비밀번호를 볼 수 없게 만듭니다.",
    categoryId: 8
  },
  {
    term: "Encryption",
    pronunciation: "인크립션 (양방향 암호화)",
    fullName: "",
    meaning: "비밀 열쇠(Secret Key)를 가진 사람만 다시 원래대로 풀(복호화) 수 있는 양방향 암호화 기술",
    explanation: "해싱과 달리 복호화 키가 존재하여, 중요한 주민번호나 계좌번호를 암호화해 보관했다가 필요할 때 열쇠로 다시 풀어 확인하는 방식입니다.",
    categoryId: 8
  },
  {
    term: "SQL Injection",
    pronunciation: "에스큐엘 인젝션",
    fullName: "",
    meaning: "입력창에 악의적인 SQL 명령어를 주입하여 데이터베이스를 탈취하거나 변조하는 치명적 해킹 기법",
    explanation: "비밀번호 입력창에 `' OR 1=1 --` 같은 조작된 코드를 넣어 비밀번호 없이 관리자로 로그인하거나 전체 회원 정보를 다운받아가는 공격입니다.",
    categoryId: 8
  },
  {
    term: "XSS",
    pronunciation: "엑스에스에스",
    fullName: "Cross-Site Scripting",
    meaning: "게시판 댓글 등에 악성 자바스크립트 코드를 심어 다른 피해자가 글을 읽는 순간 쿠키/세션을 훔쳐 달아나게 하는 공격",
    explanation: "사용자의 브라우저 화면 안에서 해킹 스크립트가 실행되어 개인 정보나 로그인 권한을 탈취당하게 만듭니다.",
    categoryId: 8
  },
  {
    term: "CSRF",
    pronunciation: "씨에스알에프",
    fullName: "Cross-Site Request Forgery",
    meaning: "이미 로그인되어 있는 사용자의 권한을 도용하여 본인도 모르게 강제로 송금이나 비밀번호 변경 요청을 보내게 만드는 공격",
    explanation: "피해자가 은행에 로그인된 상태에서 악성 사이트 링크를 누르게 만들어 은행 서버로 몰래 이체 요청을 전송시키는 수법입니다.",
    categoryId: 8
  },
  {
    term: "MFA / 2FA",
    pronunciation: "엠에프에이 / 투에프에이",
    fullName: "Multi-Factor Authentication",
    meaning: "비밀번호 외에 스마트폰 OTP나 지문 등 추가 인증 수단을 함께 요구하는 다중 인증 체계",
    explanation: "비밀번호가 유출되더라도 내 스마트폰으로 오는 인증번호 없이는 로그인을 원천 차단하여 계정을 강력하게 보호합니다.",
    categoryId: 8
  },
  {
    term: "Zero Trust",
    pronunciation: "제로 트러스트",
    fullName: "",
    meaning: "'아무것도 맹신하지 않고, 항상 모든 접근을 의심하고 검증한다'는 최신 보안 패러다임",
    explanation: "사내망이나 방화벽 내부에 접속해 있다고 해서 무조건 믿지 않고, 모든 사용자, 기기, 네트워크 요청을 건건이 엄격하게 검증합니다.",
    categoryId: 8
  },
  {
    term: "Session vs Token",
    pronunciation: "세션 vs 토큰",
    fullName: "",
    meaning: "로그인 상태를 서버 메모리에 보관하는 방식(세션)과 암호화 서명된 토큰을 클라이언트가 들고 다니는 방식(토큰)의 차이",
    explanation: "세션은 서버가 유저 접속을 즉시 강제 종료시킬 수 있는 장점이 있고, 토큰은 서버 메모리를 쓰지 않아 대규모 트래픽 확장에 유리합니다.",
    categoryId: 8
  },
  {
    term: "Access & Refresh Token",
    pronunciation: "액세스 & 리프레시 토큰",
    fullName: "Access Token & Refresh Token",
    meaning: "수명이 짧은(30분) 접근 토큰과, 이를 조용히 재발급받기 위한 장기 보관용 갱신 토큰의 2중 보안 구조",
    explanation: "액세스 토큰이 해킹당해도 30분 뒤면 만료되어 안전하며, 사용자는 매번 다시 로그인할 필요 없이 리프레시 토큰으로 자동 갱신됩니다.",
    categoryId: 8
  },
  {
    term: "CORS Preflight",
    pronunciation: "코어스 프리플라이트 (사전 요청)",
    fullName: "",
    meaning: "실제 데이터 요청을 보내기 전에 브라우저가 OPTIONS 메서드로 서버에 '이 요청 보내도 안전한가요?' 먼저 물어보는 예비 검사",
    explanation: "브라우저가 보안을 위해 자동으로 날리는 탐색 요청으로, 서버가 허용 헤더를 돌려주어야만 실제 본 요청(GET/POST)이 출발합니다.",
    categoryId: 8
  },
  {
    term: "Sanitization & Validation",
    pronunciation: "새니타이제이션 & 밸리데이션",
    fullName: "",
    meaning: "사용자가 입력한 값에서 위험한 스크립트를 소독(Sanitization)하고 올바른 형식인지 검증(Validation)하는 방어선",
    explanation: "이메일 형식인지 검사하고 HTML 태그나 특수문자를 무력화하여 XSS나 SQL Injection 같은 공격을 원천 봉쇄합니다.",
    categoryId: 8
  },
  {
    term: "DDoS",
    pronunciation: "디도스",
    fullName: "Distributed Denial of Service",
    meaning: "수많은 좀비 PC나 봇넷을 동원해 특정 서버에 감당 못할 트래픽 폭탄을 쏟아부어 서비스를 마비시키는 분산 서비스 거부 공격",
    explanation: "식당 입구에 가짜 손님 수만 명이 몰려와 진짜 손님이 한 명도 들어가지 못하게 가로막아 서버를 다운시키는 공격입니다.",
    categoryId: 8
  },
  {
    term: "Man-in-the-Middle",
    pronunciation: "맨 인 더 미들 (중간자 공격 / MITM)",
    fullName: "Man-in-the-Middle Attack",
    meaning: "송신자와 수신자 사이의 네트워크 통신 회선에 몰래 끼어들어 대화 내용을 도청하거나 위조하는 공격",
    explanation: "공공 와이파이 등에서 통신 패킷을 엿듣는 수법으로, HTTPS와 SSL 암호화 터널을 적용하면 내용이 암호화되어 방어할 수 있습니다.",
    categoryId: 8
  },
  {
    term: "SSO",
    pronunciation: "에스에스오 (싱글 사인온)",
    fullName: "Single Sign-On",
    meaning: "한 번의 아이디/비밀번호 로그인으로 연동된 회사 내 모든 서비스(슬랙, 지라, 노션, 구글)를 한 번에 이용하는 통합 로그인",
    explanation: "여러 서비스마다 비밀번호를 따로 외우고 로그인할 필요 없이 중앙 인증 서버 하나로 모든 업무 도구를 안전하게 관통합니다.",
    categoryId: 8
  },
  {
    term: "Principle of Least Privilege",
    pronunciation: "최소 권한의 원칙",
    fullName: "Principle of Least Privilege (PoLP)",
    meaning: "보안 사고 피해를 최소화하기 위해 사용자나 프로세스에 업무 수행에 꼭 필요한 최소한의 권한만 부여하는 대원칙",
    explanation: "모든 개발자나 서버 프로그램에 '전체 관리자(root)' 권한을 주지 않고 각자 담당 업무에 필요한 읽기/쓰기 권한만 쪼개어 부여합니다.",
    categoryId: 8
  }
];

// ID 부여 (1부터 순차적으로)
const finalTerms = terms.map((t, idx) => ({
  id: idx + 1,
  ...t
}));

const targetPath = path.join(__dirname, '..', 'src', 'data', 'terms.json');
fs.writeFileSync(targetPath, JSON.stringify(finalTerms, null, 2), 'utf-8');

console.log(`Successfully generated ${finalTerms.length} curated IT / Vibe Coding terms to src/data/terms.json!`);
