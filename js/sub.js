const get = (target) => { return document.querySelector(target) }
const getAll = (target) => { return document.querySelectorAll(target) }

let $header = get('#header');
let $gnb = get('#header .gnb');
let $gnbM = getAll('#header .gnb .gnbM')
let $li = getAll('#header .gnb > li');
let $gnbSub = getAll('#header .gnb .sub');
let $rolling = getAll('.main .rolling');
let $pgLi = getAll('.paging li');
let $pgA = getAll('.paging a');
let $logo = get('#header h1 img');

$li.forEach( (item, idx) => {
    item.addEventListener('mouseenter', e => {
        $header.classList.add('roll');
        $gnb.classList.add('roll');

        $gnbM.forEach(gnbItem => {
            gnbItem.classList.add('roll');
            gnbItem.classList.remove('on');
        });
        e.currentTarget.firstElementChild.classList.add('on'); // gnbM

        $gnbSub.forEach(subItem => {
            subItem.classList.remove('roll');
        });
        e.currentTarget.firstElementChild.nextElementSibling.classList.add('roll'); // sub sub0, sub1..
    });
    $header.addEventListener('mouseleave', e => {
        e.currentTarget.classList.remove('roll');
        $gnbSub[idx].classList.remove('roll');
        $gnb.classList.remove('roll');
        $gnbM.forEach(gnbItem => {
            gnbItem.classList.remove('roll');
            gnbItem.classList.remove('on');
        });
    });
});
// 메인 메뉴

// 소셜
(function(){
    const get = target => document.querySelector(target);
    const getAll = target => document.querySelectorAll(target);

    // 타이틀박스
    let $shareIcon = getAll('.title-wrap .icon-box li p');
    let $snsBox = get('.title-wrap .icon-box li .sns-box');
    let $shareBg = get('.title-wrap .bg');

    // 타이틀박스 시작
    //타이틀박스 공유 아이콘 All
    $shareIcon.forEach(shareItem => {
        shareItem.addEventListener('mouseenter',e => e.currentTarget.classList.add('on'));
        shareItem.addEventListener('mouseleave',e=> e.currentTarget.classList.remove('on'));
    })

    //타이틀박스 sns공유 아이콘 팝업
    $shareIcon[0].addEventListener('click',e=>{
        $snsBox.classList.add('on');
        $shareBg.classList.add('on');
    })
    $shareBg.addEventListener('click',e=>{
        $shareBg.classList.remove('on');
        $snsBox.classList.remove('on');
    })
    $shareIcon[1].addEventListener('click',e=> prompt('이 글의 URL 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요.', window.location.href));
    $shareIcon[2].addEventListener('click',e=> window.print());
})()

// 공지사항
function notice() {
    let a = document.querySelectorAll('.notice span p a');
    let noticeP = document.querySelector('.notice span p');
    let noticeBar = document.querySelectorAll('.notice .inner table tbody tr');
    let count = 2;

    noticeBar.forEach(item => {
        item.addEventListener("mouseover", e => {
            noticeBar.forEach(bar => {
                bar.classList.remove("on");
            })
            item.classList.add('on');
        })
        item.addEventListener('mouseleave', e => {
            noticeBar.forEach(bar => {
                bar.classList.remove("on");
            })
        })
    })

    noticeP.addEventListener('click', e => {
        e.preventDefault();
    })

    for(let i=2; i<a.length-2; i++) {
        a[i].addEventListener('click', e => {
            a.forEach(item => {
                item.classList.remove('on');
            })
            a[i].classList.add("on");
            count = i;
        })
    }

    a[0].addEventListener('click', e => {
        count = 2;
        switchNum()
    })

    a[1].addEventListener('click', e => {
        count--;
        if(count < 2) { count = 2 } 
        switchNum()
    })

    a[a.length-2].addEventListener('click', e => {
        count++;
        if(count > a.length-3) { count = a.length-3 }
        switchNum()
    })
    a[a.length-1].addEventListener('click', e => {
        count = a.length-3;
        switchNum()
    })

    function switchNum() {
        a.forEach(item => {
            item.classList.remove('on');
        })
        a[count].classList.add('on');
    };
}

// 병원 소개
function intro() {

    let introLi = document.querySelectorAll('.intro .inner ul li');

    introLi.forEach(item => {
        item.addEventListener('mouseover', e => {
            e.currentTarget.classList.add('on');
        })
        item.addEventListener('mouseleave', e => {
            item.classList.remove("on");
        })
    })
}

// 병원 안내도
function guide() {
    let guidePic = document.querySelector('.guide .inner .img-box .bg img');
    let guideBtn = document.querySelectorAll('.guide .inner .img-box .btn-group button');
    let guideP = document.querySelectorAll('.guide .inner .check-box span p');
    let scale = 1 ;
    let oldLeft = [], oldTop = [];
    let timerId = null , isBlocked= false ;
    let upCount = 5, downCount = 0;

    guideBtn.forEach((item, idx) => {
        oldLeft[idx] = parseInt(getComputedStyle(item).left);
        oldTop[idx] = parseInt(getComputedStyle(item).top);
    })

    guidePic.addEventListener('wheel', function(e) {
        e.preventDefault();
        clearTimeout(timerId);
        timerId = null;
        timerId = setTimeout(function() {
            isBlocked = false;
        }, 150);
        if (isBlocked === true) return false;
        isBlocked = true;
        let delta = e.deltaY;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.125, scale), 4);
        if(scale < 0.49) { scale = 0.5 }
        else if (scale > 1) { scale = 1; }

        if (delta < 0 && upCount < 5) {
            zoomIn()
            upCount++;
            downCount--;
            if(downCount < 0) { downCount = 0}
            if(upCount > 5) { upCount = 5}
        } else if (delta > 0 && downCount < 5) {
            zoomOut()
            upCount--;
            downCount++;
            if(upCount < 0) { upCount = 0}
            if(downCount > 5) { downCount = 5}
        }
        
        for(let i=0; i<guideBtn.length; i++) {
            guideBtn[i].style.left = `${oldLeft[i]}px`;
            guideBtn[i].style.top = `${oldTop[i]}px`;
        }
        guidePic.style.transform = `scale(${scale})`;
    }, {passive: false});
    
function zoomIn() {
    for(let i=0; i<guideBtn.length; i++) {
        if(i==0){
            oldLeft[i] -= 18;
            oldTop[i] -= 18;
        } else if (i==1){
            oldLeft[i] -= 40;
            oldTop[i] += 10;
        } else if (i==2){
            oldLeft[i] += 34;
            oldTop[i] -= 30;
        } else if (i==3){
            oldLeft[i] += 34;
            oldTop[i] -= 12;
        } else if (i==4){
            oldLeft[i] += 33;
            oldTop[i] += 12;
        } else if (i==5){
            oldLeft[i] += 33;
            oldTop[i] += 30;
        } else if (i==6) {
            oldLeft[i] -= 10;
            oldTop[i] += 30;
        }
    }
}
function zoomOut() {
    for(let i=0; i<guideBtn.length; i++) {
        if(i==0) {
            oldLeft[i] += 18;
            oldTop[i] += 18;
        } else if (i==1) {
            oldLeft[i] += 40;
            oldTop[i] -= 10;
        } else if (i==2){
            oldLeft[i] -= 34;
            oldTop[i] += 30;
        } else if (i==3){
            oldLeft[i] -= 34;
            oldTop[i] += 12;
        } else if (i==4){
            oldLeft[i] -= 33;
            oldTop[i] -= 12;
        } else if (i==5){
            oldLeft[i] -= 33;
            oldTop[i] -= 30;
        } else if (i==6) {
            oldLeft[i] += 10;
            oldTop[i] -= 30;
        }
    }
}

    guideBtn.forEach((item, idx) => {
        item.addEventListener('mouseover', e => { 
            guideBtn.forEach(classItem => { 
                classItem.classList.remove('on')
            })
            item.classList.add('on');
        })
        item.addEventListener('mouseleave', e => { 
            guideBtn.forEach(classItem => { 
                classItem.classList.remove('on') 
            }) 
        })
        item.addEventListener('click', e => {
            guideP.forEach(item => { item.classList.remove('on'); })
            guideBtn.forEach(item => { item.classList.remove('clicked'); })
            guideP[idx].classList.add('on')
            guideBtn[idx].classList.add('clicked');
        })
    })

    guideP.forEach((item, idx) => {
        item.addEventListener('click', e => {
            guideP.forEach(item => { item.classList.remove('on'); })
            guideBtn.forEach(item => { item.classList.remove('clicked'); })
            guideP[idx].classList.add('on')
            guideBtn[idx].classList.add('clicked');
        })
    })
}

// 고객의 소리
function customerSound() {
    const create = target => document.createElement(target);
    const get = target => document.querySelector(target);
    const getAll = target => document.querySelectorAll(target);

    // 고객의 소리 
    let $bg = get('.praise-board .card-wrap + .bg');
    let $popup = get('.praise-board .card-popup');
    let $preview = get('.praise-board .card-preview .inner');
    let $layout = getAll('.praise-board .card-wrap .card-layout'); 
    let $paging = getAll('.praise-board .paging a');
    let ran , timerID, previewAll, count;

    // 고객의 소리 시작
    // 카드미리보기 내용 랜덤, 타이머 설정
    const make = () => {
        ran = Math.floor(Math.random()*$layout.length);
        $preview.innerHTML = $layout[ran].innerHTML
        previewAll = Array.from($preview.children); //$preview 자식요소 배열로 변경
        previewAll.forEach(item =>{
            item.animate([
                {opacity:0},
                {opacity:1}
            ],300)
        })
    }

    make();
    timerID = setInterval(make,5000);


    // 카드레이아웃 클릭 시 팝업, 오버 시 style 변경 
    const show = () => {
        $bg.classList.add('show');
        $popup.classList.add('show');
    }
    const hide = () => {
        $bg.classList.remove('show');
        $popup.classList.remove('show');
    }
    const createBtn = () => {
        let $closeBtn = create('button');
        let $closei = create('i');
        $closeBtn.classList.add('close');
        $closei.classList.add('xi-close');
        $popup.append($closeBtn);
        $closeBtn.append($closei);
        $closeBtn.addEventListener('click', hide);
    }

    $layout.forEach((layoutItem,idx)=>{
        layoutItem.addEventListener('click', e=>{
            $popup.innerHTML = e.currentTarget.innerHTML;
            e.preventDefault();
            show();
            createBtn();
        })
        layoutItem.addEventListener('mouseenter',e=>{
            e.currentTarget.children[0].style.color='#6D5B74';
            e.currentTarget.classList.add('on');
        })
        layoutItem.addEventListener('mouseleave',e=>{
            e.currentTarget.children[0].style.color='#3D3D3D';
            e.currentTarget.classList.remove('on');
        })
    })

    $bg.addEventListener('click', hide);



    // 페이징버튼
    const clickNum = (e, idx) => {
        e.preventDefault(); // 링크 해제
        $paging.forEach(item => item.classList.remove('on'));
        $paging[idx].classList.add('on');
        count = idx;
      }

      const switchNum = () => {
        $paging.forEach( item => item.classList.remove('on')); 
        $paging[count].classList.add('on');
      }
  
    $paging.forEach((item, idx) => {
      item.addEventListener('click', e => {
        if (idx === 0) {
          count = 2;
        } else if (idx === 1) {
          count--;
          if (count < 2) count = 2;
        } else if (idx === $paging.length - 2) {
          count++;
          if (count > 6) count = 6;
        } else if (idx === $paging.length - 1) {
          count = 6;
        } else {
            clickNum(e, idx);
        }
    
        switchNum();
        e.preventDefault(); 
      });
    });
}

//회원가입
function join(){
    const create = target => document.createElement(target);
    const get = target => document.querySelector(target);
    const getAll = target => document.querySelectorAll(target);

    let $userId = get('.join table .userId'); 
    let $idBtn = get('.join table .chk-btn'); 
    let $pwAll = getAll('.join table .pw-line input'); 
    let $pwTxt = get('.join table .pw-line em');
    let $domain = get('.join table .domain'); 
    let $domainList = get('.join table .domain-list'); 
    let $userDate = getAll('.join table .birth-line select');
    let $txtInp = getAll('.join table input[type="text"]');
    let $submitWrap = getAll('.join .submit-wrap button');
    let $option;
    let pw1, pw2;


    //아이디 중복확인 버튼
    const idReset = () => {
        $idBtn.classList.remove('on');
        $idBtn.textContent='중복확인'
    }

    //아이디 중복확인
    $idBtn.addEventListener('click', e =>{ 
        e.preventDefault();
        let idVal = $userId.value;
        let uniqueId = 'ezen0000';
        if(idVal.trim('')===""){
            alert('공백을 제외하여 입력해주세요.');
            idReset();
        }else if(idVal.length<6){
            alert('영문/숫자 6자리 이상으로 입력해주세요.');
            idReset();
        }else if(idVal===uniqueId){
            alert('중복된 아이디입니다. 다시 입력해주세요.');
            idReset();            
        }else{
            alert('사용할 수 있는 아이디입니다.')
            $idBtn.textContent='확인완료'
            $idBtn.classList.add('on');
        }
    })


    // 비밀번호 첫번째 입력란
    $pwAll[0].addEventListener('keyup',e=>{
        pw1 = $pwAll[0].value;
        if(pw1.trim()===""){
            $pwTxt.textContent = '공백을 제외하여 입력해주세요.';
            $pwTxt.style.color = 'red';
        }else if(pw1.length<8){
            $pwTxt.textContent='영문/숫자 8자리 이상으로 입력해주세요.';
            $pwTxt.style.color = 'red';
        }else {
            $pwTxt.textContent='비밀번호 확인란을 입력해주세요.';
            $pwTxt.style.color = 'blue';
        }
    })

    // 비밀번호 두번째 입력란
    $pwAll[1].addEventListener('keyup',e=>{
        pw1 = $pwAll[0].value;
        pw2 = $pwAll[1].value;
        if(pw1===pw2){
            $pwTxt.textContent = '비밀번호가 일치합니다.';
            $pwTxt.style.color = 'blue';
        }else{
            $pwTxt.textContent = '비밀번호를 동일하게 입력해주세요.';
            $pwTxt.style.color = 'red';
        }
    })


    //이메일 도메인 선택 시 해당 값 입력 
    $domainList.addEventListener('change',e=>{
        let domainTxt = e.currentTarget.value;
        $domain.value = domainTxt;
    })
    

    // 생년월일 함수 생성
    const birth = (num) => {
        $option = create('option'); 
        $userDate[num].append($option);
    }

    // 생년월일 초기값
    birth(0);
    $option.textContent = '년';
    birth(1);
    $option.textContent = '월';
    birth(2);
    $option.textContent = '일';

    //생년월일 옵션 태그 생성
    for(let i=2023 ; i>=1900 ; i--){ 
        birth(0);
        $option.textContent = i + '년';
    }
    for(let i=1 ; i<=12 ; i++){ 
        birth(1);
        $option.textContent = i + '월';
    }
    for(let i=1 ; i<=31 ; i++){ 
        birth(2);
        $option.textContent = i + '일';
    }

    // 이전버튼 - 로그인화면으로 이동
    $submitWrap[0].addEventListener('click',e=> window.location.href = 'login.html')

   // 다음버튼
   $submitWrap[1].addEventListener('click',e=>{
    e.preventDefault();
    if($idBtn.classList.contains('on') === false){
        alert('아이디 중복확인을 해주세요.')
    }else if(!$pwAll[0].value || !$pwAll[1].value){
        alert('필수입력항목을 확인해주세요.')
    }else if(!$txtInp[0].value || !$txtInp[1].value || !$txtInp[2].value || !$txtInp[3].value || !$txtInp[4].value){
        alert('필수입력항목을 확인해주세요.')
    }else if($domain.value.includes('.') === false){
        alert('이메일 형식이 아닙니다')
    }else{
        alert('회원가입이 완료되었습니다.');
        window.location.href = '../index.html'
    }
})    
}

// 로그인
function login(){
    const get = target => document.querySelector(target);
    const getAll = target => document.querySelectorAll(target);


    // login 시작
    let arrUrl = ['https://www.facebook.com/login.php?skip_api_login=1&api_key=659426698241332&kid_directed_site=0&app_id=659426698241332&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fresponse_type%3Dcode%26client_id%3D659426698241332%26redirect_uri%3Dhttps%253A%252F%252Fwww.gilhospital.com%252Fhtml%252Fportlet%252Flogin%252Fapi%252Ffacebook%252Fcallback.jsp%26state%3D611623691987524365940822897420826135471%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3D9e007e99-53c8-4785-801d-f2436a075e8b%26tp%3Dunspecified&cancel_url=https%3A%2F%2Fwww.gilhospital.com%2Fhtml%2Fportlet%2Flogin%2Fapi%2Ffacebook%2Fcallback.jsp%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D611623691987524365940822897420826135471%23_%3D_&display=page&locale=ko_KR&pl_dbl=0',
    '../login/images/login_naver.png'
    ,'https://accounts.kakao.com/login/?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fencode_state%3D1%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fwww.gilhospital.com%252Fhtml%252Fportlet%252Flogin%252Fapi%252Fkakao%252Fcallback.jsp%26state%3D1197019687017686501677660352905751730145%26through_account%3Dtrue%26client_id%3Dfe6634ac60d06514a632f2e9117a4244#login'];
    let $loginBtn = get('.login .login-wrap .login-input button');
    let $socialBtn = getAll('.login .login-wrap .login-social a');
    let $failBtn = getAll('.login .fail-login div a');
    let $inpId = get('.login .login-wrap .login-input ul li .userId');
    let $inpPw = get('.login .login-wrap .login-input ul li .userPw');

    // 로그인 버튼 클릭 시 
    $loginBtn.addEventListener('click', e=>{
        e.preventDefault();
        let userId = $inpId.value;
        let userPw = $inpPw.value;
        let id='shiningudonlikesilver';
        let pw='1234';
        if( userId.trim() === '' )
            alert('아이디를 입력하세요.')
         else if ( userPw.trim() === '' ){
            alert('비밀번호를 입력하세요.')
        } else if(userId===id && userPw===pw){
            alert('로그인되었습니다.');
            // 링크 index 연결하기
            window.location.href = '../index.html'
        } else {
            alert('로그인정보가 일치하지 않습니다.');
        }
    })

    // 소셜계정으로 로그인
    $socialBtn.forEach( (socItem, idx) => {
        socItem.addEventListener('click',e=>{
            e.preventDefault();
            // 클릭 시 점선, 0.5초 뒤 사라지기
            e.currentTarget.classList.add('on');
            setTimeout(()=>{
                socItem.classList.remove('on');
            },700)
            // 팝업창
            window.open( arrUrl[idx], 'socpopup', 'width=430 height=630');
        })
    })
    
    //하단박스 버튼 오버 시
    $failBtn.forEach( failItem => {
        failItem.addEventListener('mouseenter', e=> e.currentTarget.style.backgroundColor = '#F3F1FF');
        failItem.addEventListener('mouseleave', e=> e.currentTarget.style.backgroundColor = '#fff');
    })
}

//전문의 상담
function pro(){
    let box = document.querySelectorAll('.counseling .table')
    let btn = document.querySelectorAll('.counseling .professional_text button')
    let id = 0, old = 0;

    btn.forEach(item=>{
        item.addEventListener('click',e=>{
            id =e.currentTarget.dataset.id;

            box.forEach(boxList=>{
                boxList.style.display = 'none';
            })
            box[id].style.display = 'block';

            btn[old].classList.remove('on');
            e.currentTarget.classList.add('on');

            old = id;

        })
    })

    let proTitle = document.querySelector('.professional_text strong')
    let proTitle1 = document.querySelector('.professional_text strong')
    let $pro1 = get('.counseling .pro1');
    let $pro2 = get('.counseling .pro2');
    let $aModal = getAll('.answer-modal')
    let $cModal = get('.modal-close')

    $pro1.addEventListener('click', e => {
        make1();
    })
    $pro2.addEventListener('click', e => {
        make2();
    })
    $aModal.forEach(item => {
        item.addEventListener('click', e => {
            openModal();
    })
    })
    $cModal.addEventListener('click', e => {
        closeModal();
    })

    function make1(){ proTitle1.innerHTML = '전문의 상담' }
    function make2(){ proTitle.innerHTML = '영양제 상담' }

    function openModal() { document.getElementById("pwModal").style.display = "block"; }
    function closeModal() { document.getElementById("pwModal").style.display = "none"; }
}

//의료진 소개
function doctor(){
    let isListOpen = false;
    let btnAll = document.querySelectorAll('.btn-default');
    let data = ['대장내시경 1만례 이상 검사','미국 소화기 학회 정회원(AGA &ACG)','미국 소화기 내시경 학회 정회원','대한 소화기 학회 평생회원',
        '대한 소화관 운동학회 전산정보이사','대한 소화관 운동학회 학술위원','대한 장 연구학회 학술위원','대한 Helicobacter 및 상부위장학회 편집위원',
        '대한 장연구학회 전산 정보이사 ','대한소화기 기능성 질환 운동학회 소화불량증 위원회 위원장','삼남 소화기 연구회 회장 역임','대한소화기 학회 대전충청지회 회장',
        ' 소화기항암학회 기획윤리위원홍보위원(전)','소화기기능성질환.운동학회 정보.소통위원(전)','대한 Helicobacter 및 상부위장관 연구회 학술위원(전)','Cedars Sinai Medical Center 연수 (2013.1~2013.12)'];

    btnAll.forEach((item) => {
    item.addEventListener('click', (e) => {
        let list = document.querySelector('.list4 .career-txt');
        if (!isListOpen) {
        data.forEach((item) => {
            let li = document.createElement('li');
            li.textContent = item;
            li.style.marginBottom = '20px';
            list.appendChild(li);
        });
        e.currentTarget.textContent = '닫기';
        isListOpen = true;
        } else {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        e.currentTarget.textContent = '더보기';
        isListOpen = false;
        }
    });
    });
    //data 받아서 btn 더보기/닫기 


    let tp = document.querySelector('.top');
    let ty= 0;

    window.addEventListener('scroll',e=>{
        let t = window.scrollY;
        if(t>1000){
            tp.classList.add('on');
        }else{
            tp.classList.remove('on');
        }
    })
    tp.addEventListener('click',e=>{
        ty=0;
        window.scrollTo({top:ty,behavior:'smooth'});
    });
}

//진료과&의료진 찾기
function searchDoc() {
    function $(selector) {                         
        return document.querySelector(selector);
      }
      function $$(selector) {                        
        return document.querySelectorAll(selector);
      }
      // li진료 box
      const medicalList = $$('.medical_list_clinic > li');          
      medicalList.forEach(item => {
        item.addEventListener('mouseenter', e => {                 
          let id = e.currentTarget.dataset.id;                      
          const clinicBox1 = $$('.clinic-box1 > li');               
          clinicBox1.forEach((box, index) => {                     
            box.style.display = index == id ? 'block' : 'none';     
          });                                                      
        });
      });
}

function bmi(){
    let $testBtn = get('.menu2-sub1 .inner button');
    let $testName = get('.my-info #name');
    let $testHeight = get('.my-info #height');
    let $testWeight = get('.my-info #weight');
    let $testBefore = get('.menu2-sub1 .right .right1');
    let $testAfter = get('.menu2-sub1 .right .right2');
    let $avatar = get('.right .avatar img');
    let $bodyCheck = getAll('.body-type li .check');
    let $testTxt = get('.menu2-sub1 .right .test');
    let BMIlist = ['저체중', '정상', '과체중', '비만', '고도비만'];
    let BMI;

    $testBtn.addEventListener('click', e => {
    let testNameValue = $testName.value;
    let testHeightValue = $testHeight.value;
    let testWeightValue = $testWeight.value;
    let testResult = ((testWeightValue / (Math.pow(testHeightValue, 2))) * 10000).toFixed(3); // BMI 계산 값

    if (isNaN(testNameValue) && !isNaN(testHeightValue) && !isNaN(testWeightValue)) {
        // 이름 부분이 공백 아닌 문자, 키와 몸무게가 숫자일 때 실행
        $testBefore.style.opacity = '0';
        $testAfter.style.opacity = '1';

        if (testResult < 18.5) BMItest(0);
        else if (testResult < 23) BMItest(1);
        else if (testResult < 25) BMItest(2);
        else if (testResult < 30) BMItest(3);
        else if (testResult >= 30) BMItest(4);

        $testTxt.innerHTML = `<strong><span>${testNameValue}</span>님 신체 정보 : <span>${testHeightValue}cm / ${testWeightValue}kg </span></strong>
        <strong>BMI 지수는 <span>${testResult}</span>으로 <span>'${BMI}'</span>입니다.</strong>`;
    }
    });
    const BMItest = (bmidx) => {
    $avatar.setAttribute('src', '../../../images/menu2/sub1/test'+bmidx+'.png');
    $avatar.setAttribute('alt', BMIlist[bmidx]);
    $bodyCheck.forEach(bodyitem => {
        bodyitem.classList.remove('on');
    });
    $bodyCheck[bmidx].classList.add('on');
    BMI = BMIlist[bmidx];
    };
}