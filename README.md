# 슬로우벗베럴 대구 랜딩페이지 — 실행 및 제출 안내

## 실행 방법

1. 압축 파일을 풀고 VS Code에서 `slowbutbetter_landing` 폴더를 엽니다.
2. `index.html`을 브라우저에서 열거나 VS Code Live Server로 실행합니다.
3. 상단 메뉴로 나머지 4개 페이지를 이동하며 확인합니다.
4. GitHub Pages에 배포하려면 이 폴더 안의 **파일들 자체**를 리포지토리 루트에 올립니다.

## 구성

- `index.html` 홈
- `menu.html` 메뉴
- `about.html` 소개
- `location.html` 오시는 길
- `contact.html` 예약·문의
- `css/common.css` 전 페이지 공통 + `css/home.css`, `menu.css`, `about.css`, `location.css`, `contact.css`
- `images/menu-board.png` 사용자가 올린 메뉴판
- `images/*-placeholder.svg` 실제 사진 교체 전 자리 표시 이미지

## 실제 사진 업로드 후 교체 방법

이미지 6종을 `images` 폴더 안에 저장한 후, 해당 HTML에서 `src="images/hero-placeholder.svg"`를 `src="images/hero.jpg"`로 변경하는 방식으로 교체합니다. **사진에 맞게 `alt` 설명도 수정**해 주세요.

1. `hero.jpg` : 실내 전경 또는 카페 대표 사진 (가로형 권장)
2. `interior.jpg` : 실제 카페 실내, 좌석 사진
3. `exterior.jpg` : 외부에서 보이는 출입구·간판
4. `parking.jpg` : 실제 주차장 입구 및 진입 방향
5. `drinks.jpg` : 베럴 화이트 또는 살구가득 스무디
6. `bakery.jpg` : 베이커리 진열 및 대표 빵

실제 사진 6종이 없어도 사이트는 깨지지 않고 자리 표시 이미지로 실행됩니다. `menu-board.png`는 제공한 메뉴판 원본을 사용합니다.

## 현재 확인 필요

- 메뉴 가격은 사용자 업로드 메뉴판 기준이며 현재 판매가/시즌 한정 메뉴 재고는 확인 필요
- 영업시간 10:30~22:00와 전화 0507-1305-9611는 공개 자료 기반, 방문 전 최신 정보 재확인 필요
- 주차는 가능하다는 자료가 있으나 주차 가능 대수/요금/진입 동선 확인 필요
- 예약 자체를 받는지, 단체 예약 정책, 공식 채널, 실제 메뉴·베이커리 사진 확인 필요
- 네이버 지도 및 카카오맵 검색 링크는 실제 매장 선택 결과 확인 필요
- 문의 양식은 HTML/CSS 실습용으로 **전송·저장되지 않음**; 연락은 전화 링크 사용
- 본 사이트는 실습용 비공식 카페 소개 사이트이며 카페 공식 웹사이트 아님

## PPT 제출 전 체크리스트 점검

- [x] JavaScript, `script`, `onclick` 미사용 / HTML·CSS로만 작성
- [x] 동일한 5개 메뉴가 모든 페이지에서 상단 고정
- [x] 모바일·태블릿·PC 별 배치 변경 (미디어 쿼리)
- [x] 모바일 ☰ 메뉴: CSS 체크박스로 펼치기
- [x] 이미지 width/max-width 및 overflow 처리, 가로 넘침 방지 CSS
- [x] 5개 개별 페이지 구성
- [x] `header`, `nav`, `main`, `section`, `footer` 시맨틱 태그 사용
- [x] 공통/페이지별 CSS 파일 분리, 대표 색상 CSS 변수로 정의
- [x] `img`마다 `alt`, 각 HTML 서로 다른 `<title>`
- [x] HTML 내부에 꾸밈 CSS 미삽입, 영어 소문자 파일명 사용

**주의:** 위 내용은 코드 작성 여부의 정적 점검입니다. 실제 모바일/태블릿/PC 기기에서 클릭, 화면 넘침 및 지도 로딩을 검증하는 최종 사용성 검사는 배포 후 필요합니다.
