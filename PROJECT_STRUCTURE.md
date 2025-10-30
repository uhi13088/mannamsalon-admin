# 맛남살롱 근무관리 시스템 - 프로젝트 구조

## 📋 페이지 흐름도

```
index.html (메인 랜딩)
├── 👨‍💼 관리자 버튼 클릭
│   └──> admin-login.html (관리자 로그인)
│        └── Firebase 인증 성공
│            └──> admin-dashboard.html (관리자 대시보드)
│                 - 8개 탭: 대시보드, 직원관리, 근태관리, 급여관리, 승인관리, 계약서관리, 공지사항, 매장관리
│                 - Firebase Firestore 연동
│
├── 👤 직원 버튼 클릭
│   └──> employee-login.html (직원 로그인)
│        └── 이름 입력 후 로그인
│            └──> employee.html (직원 페이지)
│                 - 출퇴근 관리
│                 - 근무내역 조회
│                 - 급여 조회
│
└── 🆕 직원 가입하기 버튼 클릭
    └──> employee-register.html (직원 가입)
         └── Firebase 계정 생성 + Firestore 저장
         
계약서 서명:
    admin-dashboard.html → 계약서 작성 → 서명 링크 생성
                                    └──> contract-sign.html (직원이 서명)
```

## 📂 파일 구조

### 핵심 HTML (7개) ✅
- **index.html** - 메인 랜딩 페이지
- **admin-login.html** - 관리자 로그인 (Firebase Auth)
- **admin-dashboard.html** - 관리자 대시보드 (Firebase 직접 포함)
- **employee-login.html** - 직원 로그인 (이름 기반)
- **employee.html** - 직원 페이지 (외부 JS 참조)
- **employee-register.html** - 직원 가입 (Firebase Auth + Firestore)
- **contract-sign.html** - 계약서 서명 (Canvas)

### CSS (1개)
- **css/common.css** - 공통 스타일 (브라운/베이지 테마)

### JavaScript (9개)
- **js/firebase-config.js** - Firebase 초기화 설정
- **js/admin.js** - 관리자 페이지 로직
- **js/employee.js** - 직원 페이지 로직
- **js/contract.js** - 계약서 작성 로직
- **js/contract-sign.js** - 계약서 서명 로직
- **js/auth.js** - 인증 관리
- **js/api.js** - API 통신 (Google Apps Script 연동 예정)
- **js/config.js** - 설정 파일
- **js/utils.js** - 유틸리티 함수

### 문서 (4개)
- **README.md** - 프로젝트 전체 문서
- **FIREBASE_SETUP.md** - Firebase 설정 가이드
- **FIREBASE_DATA_STRUCTURE.md** - Firestore 데이터 구조
- **PROJECT_STRUCTURE.md** - 프로젝트 구조 (이 문서)

## 🔗 링크 연결 상태

### index.html
```
✅ 관리자 버튼 → admin-login.html
✅ 직원 버튼 → employee-login.html  
✅ 직원 가입 → employee-register.html
```

### admin-login.html
```
✅ 로그인 성공 → admin-dashboard.html
✅ 메인으로 → index.html
```

### employee-login.html
```
✅ 로그인 → employee.html
✅ 메인으로 → index.html
```

### employee-register.html
```
✅ 가입 완료 → employee-login.html
✅ 메인으로 → index.html
```

## 🔥 Firebase 연동

### Authentication
- **admin-login.html**: 이메일/비밀번호 로그인
- **employee-register.html**: 계정 생성

### Firestore Collections
- **users**: 전체 사용자 정보
- **employees**: 직원 전용 정보 (⚠️ users와 중복, 정리 필요)
- **contracts**: 계약서 데이터 (⚠️ 현재 localStorage 사용 중)
- **attendance**: 근태 기록
- **salaries**: 급여 정보

### 현재 데이터 저장 방식 (⚠️ 일관성 없음)
- ✅ **직원 정보**: Firestore (올바름)
- ❌ **계약서**: localStorage (Firestore로 이동 필요)
- ❌ **매장 정보**: localStorage (Firestore로 이동 필요)

## 🎨 디자인 시스템

### 컬러 테마
```css
--primary-color: #8b7355;      /* 메인 브라운 */
--primary-dark: #6b5d4f;       /* 다크 브라운 */
--bg-light: #f5f1e8;           /* 배경 베이지 */
--bg-white: #fdfcfa;           /* 카드 */
--text-primary: #6b5d4f;       /* 주요 텍스트 */
--text-secondary: #9b8a76;     /* 보조 텍스트 */
```

## ✅ 점검 완료 사항 (2025-01-30)

1. ✅ 불필요한 파일 삭제 (admin-index.html 등 5개)
2. ✅ 핵심 파일 7개로 정리
3. ✅ 링크 연결 확인 (index.html → admin-login.html, employee-login.html)
4. ✅ Firebase 설정 파일 존재 확인
5. ✅ CSS/JS 파일 경로 정상 확인
6. ✅ HTTP 응답: 모든 페이지 200 OK

## ⚠️ 알려진 문제 (사장님 확인)

### 1. 스크립트 방식 불일치
- **admin-dashboard.html**: Firebase SDK를 HTML 내부에 직접 포함
- **employee.html**: 외부 JS 파일 참조 (js/employee.js)
- **문제**: 일관성 없음
- **해결**: 모든 페이지를 외부 JS 참조 방식으로 통일 필요 (나중에 리팩토링)

### 2. 데이터 저장 전략 혼재
- **localStorage**: 계약서, 매장 정보 (❌ 삭제 위험, 공유 불가)
- **Firestore**: 직원 정보 (✅ 올바름)
- **문제**: 일관성 없음, 데이터 손실 위험
- **해결**: 모든 데이터를 Firestore로 이동 필요

### 3. 중복 컬렉션
- **users**와 **employees** 컬렉션이 중복
- **해결**: 하나로 통합 필요

## 🎯 향후 작업 계획 (사장님 확인)

### Phase 1: 웹 개발 완료 (현재)
- [x] Firebase 연동
- [x] 로그인/가입 기능
- [ ] 실제 출퇴근 기능 구현
- [ ] 근태/급여 관리 기능 구현
- [ ] 데이터 저장 전략 통일 (localStorage → Firestore)

### Phase 2: Google Sheets 연동 (웹 완료 후)
- [ ] Google Apps Script 백엔드 작성
- [ ] js/api.js에서 Apps Script 호출
- [ ] Firestore ↔ Google Sheets 양방향 동기화
- [ ] 스프레드시트 자동화

### Phase 3: 배포 (Cloudflare Pages)
- [ ] Cloudflare Pages 배포
- [ ] 커스텀 도메인 설정
- [ ] 프로덕션 환경 테스트

## 📊 파일 통계

- **HTML**: 7개 (정리 완료)
- **CSS**: 1개
- **JS**: 9개
- **문서**: 4개
- **총**: 21개 파일

## 🔒 보안 고려사항

1. ⚠️ Firebase Config가 클라이언트에 노출됨 (정상, Firestore Rules로 제어)
2. ⚠️ 주민등록번호 평문 저장 (암호화 필요)
3. ⚠️ localStorage 사용 중 (보안 취약, Firestore로 이동 필요)

---

**마지막 업데이트**: 2025-01-30  
**작성자**: AI Assistant  
**상태**: 점검 완료, 정리 완료
