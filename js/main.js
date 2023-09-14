const get = (target) => {
   return document.querySelector(target);
};
const getAll = (target) => {
   return document.querySelectorAll(target);
};

let $header = get('#header');
let $gnb = get('#header .gnb');
let $gnbM = getAll('#header .gnb .gnbM');
let $li = getAll('#header .gnb > li');
let $gnbSub = getAll('#header .gnb .sub');
let $pgLi = getAll('.paging li');
let $pgA = getAll('.paging a');
let $logo = get('#header h1 img');
let $sideBanner = get('.content3 .con-box .side-banner');
let $sidePrev = get('.content3 .con-box .side-banner .prev');
let $sideNext = get('.content3 .con-box .side-banner .next');

const $rolling = getAll('.rolling');
let isRolling = false;
let timer = null;
let pagePrev = 0, pageNext = 0;
let n = 1, ty = 0;
let numPage = $rolling.length;
let arrPage = [];
let check = 0;


$rolling.forEach( page => { // 각 페이지별 높이 값
   arrPage.push( page.offsetTop );
});

let cnt = 0; // 현재 보이는 콘텐츠의 인덱스를 저장할 변수 초기화
let scrollTop = 0; // 현재 Y축 스크롤 위치
window.addEventListener('wheel', e => {
   e.preventDefault();
   clearTimeout(timer);
   timer = setTimeout(function() {isRolling = false;}, 100); // 스크롤 중복 방지를 위한 setTimeout
   if (isRolling === true) return false; // 이미 스크롤 중인 경우 함수 종료
   isRolling = true; // 스크롤 중복 방지를 위한 isRolling 변수, true로 설정 (true=중지)
   
   let delta = e.deltaY;
   if (delta > 0) { // 마우스 휠 내릴 때
      check++
      if(check >4) { check = 4}
      if(check >= 1) {
         $gnbM.forEach(item => {
            item.classList.add('roll');
         })
         $logo.setAttribute('src', './images/logo.png');
         pgStyle();
      }
      // pageNext = (n >= numPage) ? numPage : (n + 1);
      if (n >= numPage) { // n = 0, numPage는 rolling IDX
         pageNext = numPage; // 마지막 페이지까지 내리면 마지막 페이지에서 멈춤
      } else {
         pageNext = n + 1; // 그게 아니라면 계속 다음 페이지로
      }
      if(pageNext == numPage) {
         $header.classList.add('hide');
      }
      showPage(pageNext);
   } else if (delta < 0) { // 마우스 휠 올릴 때
      check--;
      if(check < 0) { check = 0 }
      if(check == 0) {
         $gnbM.forEach(item => {
            item.classList.remove('roll');
         })
         $logo.setAttribute('src', './images/logo_w.png');
         $header.addEventListener('mouseleave', (e) => {
            $gnbM.forEach((gnbItem) => {
               gnbItem.classList.remove('roll');
            });
         });
         $header.classList.remove('hide');
         $logo.setAttribute('src', './images/logo_w.png');
      }
      pagePrev = (n <= 1) ? 1 : (n - 1);
      showPage(pagePrev);
      $header.classList.remove('hide');
   }},
   {passive: false});

function showPage(cnt) { // 페이지 이동 값
   ty = $rolling[cnt - 1].offsetTop; // 이동할 페이지의 offsetTop 값 계산
   n = cnt; // 현재 페이지 번호 갱신
   window.scrollTo({top: ty, behavior: 'smooth'}); // offsetTop 값으로 스크롤 이동
};

$pgLi.forEach( (pglitem, idx) => {
   pglitem.addEventListener('click', e => {
      e.preventDefault(); // a 태그라서 계속.. 가지는 거였어
      check = idx;
      n = idx+1;
      window.scrollTo({top: $rolling[idx].offsetTop, behavior: 'smooth'}); // offsetTop 값으로 스크롤 이동
   });
});
// 페이지 롤링

$li.forEach((item, idx) => {
   item.addEventListener('mouseenter', (e) => {
      $header.classList.add('roll');
      $gnb.classList.add('roll');
      $logo.setAttribute('src', './images/logo.png');

      $gnbM.forEach((gnbItem) => {
         gnbItem.classList.add('roll');
         gnbItem.classList.remove('on');
      });
      e.currentTarget.firstElementChild.classList.add('on'); // gnbM

      $gnbSub.forEach((subItem) => {
         subItem.classList.remove('roll');
      });
      e.currentTarget.firstElementChild.nextElementSibling.classList.add('roll'); // sub sub0, sub1..
   });
   $header.addEventListener('mouseleave', (e) => {
      $logo.setAttribute('src', './images/logo_w.png');
      e.currentTarget.classList.remove('roll');
      $gnbSub[idx].classList.remove('roll');
      $gnb.classList.remove('roll');
      $gnbM.forEach((gnbItem) => {
         gnbItem.classList.remove('roll');
         gnbItem.classList.remove('on');
      });
   });
});
// 메인 메뉴

const con3Swiper = () => {
   let swiper = new Swiper('.mySwiper', {
      scrollbar: {
         el: '.swiper-scrollbar',
         hide: true,
      },
      slidesPerView: 3,
      spaceBetween: 30,
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
      },
   });
   return swiper;
};
swiper = con3Swiper();
// 스와이퍼 - 코드 줄임

$pgLi[0].addEventListener('click', (e) => {
   pgStyle();
   $pgA.forEach((item) => {
      item.addEventListener('mouseenter', (e) => {
         item.classList.remove('onbtn'); // 페이징 보라색 해제
      });
   });
   $gnbM.forEach((gnbItem) => {
      gnbItem.classList.remove('roll');
   });
   $header.addEventListener('mouseleave', (e) => {
      $gnbM.forEach((gnbItem) => {
         gnbItem.classList.remove('roll');
      });
   });
   $header.classList.remove('hide');
   $logo.setAttribute('src', './images/logo_w.png');
});
// 페이징, 컨텐츠 0번 스타일 설정
const pgStyle = () => {
   $logo.setAttribute('src', './images/logo.png'); // h1 로고 계속 회색
   $pgA.forEach((item) => {
      item.addEventListener('mouseenter', (e) => {
         item.classList.add('onbtn'); // 페이징 보라색 설정
      });
   });
   $gnbM.forEach((gnbItem) => {
      gnbItem.classList.add('roll'); // 메뉴 계속 검은색
   });
   $header.addEventListener('mouseleave', (e) => {
      $gnbM.forEach((gnbItem) => {
         gnbItem.classList.add('roll'); // 헤더에서 내려도 메뉴 계속 검은색
      });
      $logo.setAttribute('src', './images/logo.png'); // 헤더에서 내려도 로고 계속 검은색
   });
};

for(let i = 1; i<=3; i++) {
  $pgLi[i].addEventListener('click', (e) => {
      pgStyle();
      $header.classList.remove('hide');
   });
}
// 페이징, 컨텐츠 1, 2, 3번 스타일 설정

// 사이드 AD 배너 롤링
let adcnt = 0, interval = 4000, timerID = null;
timerID = setInterval(adroll, interval);

$sidePrev.addEventListener('click', e => {
   adcnt--;
   if (adcnt < 0) {
      adcnt = 5;
   }
   $sideBanner.style.backgroundImage = 'url(./images/main/con3_ad'+adcnt+'.jpg)';
   clearInterval(timerID);
   timerID = setInterval(adroll, interval);
});
$sideNext.addEventListener('click', e => {
   adroll();
   clearInterval(timerID);
   timerID = setInterval(adroll, interval);
});
function adroll() {
   adcnt++;
   if (adcnt > 5) {
      adcnt = 0;
   }
   $sideBanner.style.backgroundImage = 'url(./images/main/con3_ad'+adcnt+'.jpg)';
};
// 사이드 AD 배너 롤링