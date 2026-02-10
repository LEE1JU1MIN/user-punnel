# User Punnel — 실시간 고객 이탈 분석 대시보드

좌측은 전자상거래 흐름(홈 → 상품 → 장바구니 → 성공/이탈) 시뮬레이터, 우측은 실시간 퍼널 지표(이탈 분포, 전환율, 레이턴시)를 보여주는 대시보드입니다. 비전공자도 이해할 수 있도록 인사이트와 액션 플랜을 함께 제공합니다.

---

## 주요 기능
- **실시간 대시보드** (WebSocket `/ws/metrics`)
- **스텝별 이탈 분포** (전체 이탈 = 100% 기준 분배)
- **레이턴시 바** (시스템/유저), 스텝별 평균 포함
- **Insight 패널** (컨설팅 스타일 요약 + 액션 플랜)
- **Reset Data** 버튼으로 DB 데이터 초기화
- **Exit 시뮬레이션** (X 버튼 → Exit 페이지, 5분 무응답 시 이탈 기록)

---

## 기술 스택
- **Frontend**: React + Vite, Axios
- **Backend**: FastAPI, SQLAlchemy
- **Database**: PostgreSQL (`funnel_analytics`)
- **Realtime**: WebSocket (`/ws/metrics`)

---

## 프로젝트 구조
```
backend/
  app/
    main.py              # FastAPI 앱 + WebSocket
    db.py                # SQLAlchemy 설정 + DB 연결
    models/              # Event, Session, FunnelSnapshot
    routers/             # /events, /funnel, /sessions
    schemas.py           # Pydantic 스키마
    ws_manager.py        # WebSocket 매니저
frontend/
  src/
    App.jsx
    hooks/               # useFunnelMetrics, useLiveFunnel
    page/                # SimulatorPage, DashboardPage
    components/
      dashboard/         # FunnelPanel, FunnelRow, LatencyBar, InsightBox, DropoffChart
      simulator/         # Home/Product/Cart/Success/Exit
    services/            # API 클라이언트
    styles/              # dashboard.css, simulator.css
```

---

## 실행 방법

### 1) 백엔드

`requirements.txt`
```
fastapi
uvicorn
sqlalchemy
psycopg2-binary
```

**설치 및 실행**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt

# PostgreSQL DB 필요:
#   DB 이름: funnel_analytics
#   URL: postgresql://localhost/funnel_analytics

uvicorn app.main:app --reload
```

### 2) 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

접속: `http://localhost:5173`

---

## 동작 흐름 (기술 관점)

1. 시뮬레이터에서 이벤트가 발생하면 `/events`로 전송
2. 백엔드가 DB에 저장 후 `/funnel/summary` 계산
3. 계산 결과를 WebSocket으로 브로드캐스트
4. 프론트엔드가 실시간으로 대시보드 업데이트

**핵심 설계 포인트**
- **WebSocket**으로 실제 지표를 즉시 반영하여 사용자 체감 향상
- **Event 기반 설계**로 스텝 이동/이탈/레이턴시를 모두 기록
- **서버/유저 레이턴시 분리**로 문제 원인 진단 가능

---

## 비즈니스 관점 요약

이 시스템은 "어디서, 왜, 얼마나" 고객이 이탈하는지를 즉시 파악하게 해줍니다.
- **이탈 분포**를 통해 가장 큰 손실 구간을 빠르게 파악
- **레이턴시 지표**로 UX/시스템 병목을 분리해서 분석
- **Insight 패널**로 비전공자도 이해 가능한 개선 방향 제시

즉, 기술적 지표를 **의사결정 가능한 비즈니스 인사이트**로 전환하는 것이 핵심 가치입니다.

---

## API 요약

### `POST /events`
이벤트 생성 후 최신 요약 데이터 브로드캐스트

**Payload**
```json
{
  "user_id": "user_xxxx",
  "screen": "home",
  "next_screen": "product",
  "event_type": "navigate",
  "user_think_time": 1200,
  "system_latency": 0,
  "timestamp": "2026-02-10T00:00:00.000Z"
}
```

### `POST /events/clear`
이벤트/세션/스냅샷 테이블 전체 삭제 후 브로드캐스트

### `GET /funnel/summary`
퍼널 요약 지표 반환

### `WS /ws/metrics`
레이턴시 업데이트 수신
```json
{
  "type": "latency",
  "event_id": 123,
  "client_latency_ms": 220
}
```

---

## 퍼널 지표 로직
- **스텝별 이탈률** = `해당 스텝 이탈 수 / 전체 이탈 수 * 100`
- **도달율** = `해당 스텝 유저 수 / 전체 세션 수 * 100`
- **레이턴시** = 스텝별 최신 값 + 평균 값

---

## 스크린샷
스크린샷을 아래에 추가하세요:
```
assets/
  dashboard.png
  simulator.png
```

README에 삽입 예시:
```md
![Dashboard](assets/dashboard.png)
![Simulator](assets/simulator.png)
```

---

## 데모 시나리오

1. **Home → Product → Cart → Success** 순서로 진행
2. 중간에 **X 버튼**으로 Exit 발생시킴
3. 우측 대시보드에서 이탈 분포와 레이턴시 변화를 확인
4. **Insight 패널**에서 개선 제안 확인
5. **Reset Data** 버튼으로 초기화 후 반복 시나리오 테스트

---

## 참고
- DB 연결 문자열은 `backend/app/db.py`에 하드코딩되어 있음
- 대시보드 상단에 WS 연결 상태 배지 표시

---

## 라이선스
MIT (필요 시 변경 가능)
