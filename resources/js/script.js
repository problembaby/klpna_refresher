// 문서 로딩 완료 시 KRDSFormUtil 초기화
document.addEventListener("DOMContentLoaded", function () {
    KRDSFormUtil.init();
});

/**
 * KRDSFormUtil
 * 공통 폼 인터랙션 유틸리티 객체
 */
const KRDSFormUtil = {
    init() {
        this.bindInputClear();
        this.bindPasswordToggle();
        this.bindQuickMenuToggle();
        this.bindGnbToggle(); // ✅ GNB 토글 기능
        this.bindFootSelectToggle(); // ✅ 추가된 footer 아코디언 셀렉트
    },

    bindInputClear() {
        document.querySelectorAll(".btn-delete-input").forEach(btn => {
            btn.addEventListener("click", function () {
                const input = this.closest(".btn-ico-wrap").querySelector("input");
                if (input) input.value = "";
            });
        });
    },

    bindPasswordToggle() {
        document.querySelectorAll(".btn-pw-visible").forEach(btn => {
            btn.addEventListener("click", function () {
                const icon = this.querySelector("i");
                const input = this.closest(".btn-ico-wrap").querySelector("input");

                if (!icon || !input) return;

                const isVisible = input.type === "text";
                input.type = isVisible ? "password" : "text";

                icon.classList.toggle("ico-pw-visible", isVisible);
                icon.classList.toggle("ico-pw-visible-on", !isVisible);
            });
        });
    },

    /**
     * [공통] 퀵메뉴 열기/닫기 토글 기능
     */
    bindQuickMenuToggle() {
        const toggleBtn = document.querySelector('.a_control');
        const quickWrap = document.querySelector('.quick-wrap-ul');
        const items = document.querySelectorAll('.quick-wrap-item');

        if (!toggleBtn || !quickWrap) return;

        let isOpen = false;

        toggleBtn.addEventListener('click', function () {
            isOpen = !isOpen;
            toggleBtn.classList.toggle('on', isOpen);
            quickWrap.classList.toggle('q-show', isOpen);

            if (isOpen) {
                [...items].reverse().forEach((item, i) => {
                    setTimeout(() => item.classList.add('q-show'), i * 100);
                });
            } else {
                items.forEach(item => item.classList.remove('q-show'));
            }
        });
    },

    /**
     * [공통] GNB 열기/닫기 토글 기능
     */
bindGnbToggle() {
    const gnb = document.querySelector('#gnb');
    const depth2Menus = document.querySelectorAll('.depth2');
    const gnbBg = document.querySelector('.gnb-bg');
    const gnbBackdrop = document.querySelector('.gnb-backdrop');
    const body = document.body;
    let closeTimer = null;
    const safeArea = [gnb, gnbBg];

    function openAllGnb() {
        depth2Menus.forEach(menu => menu.style.display = 'block');
        if (gnbBg) {
            gnbBg.style.display = 'block';
            gnbBg.classList.add('active');
        }
        if (gnbBackdrop) gnbBackdrop.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeAllGnb() {
        depth2Menus.forEach(menu => menu.style.display = 'none');
        if (gnbBg) {
            gnbBg.style.display = 'none';
            gnbBg.classList.remove('active');
        }
        if (gnbBackdrop) gnbBackdrop.classList.remove('active');
        body.style.overflow = '';
        document.querySelectorAll('.gnb-main-trigger').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    }

    function isDescendant(parent, child) {
        return parent && child && (parent === child || parent.contains(child));
    }

    gnb.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
        openAllGnb();
    });
    gnb.addEventListener('focusin', () => {
        clearTimeout(closeTimer);
        openAllGnb();
    });

    document.addEventListener('mousemove', (e) => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            const isInside = safeArea.some(el => el && el.contains(e.target));
            if (!isInside) closeAllGnb();
        }, 150);
    });

    document.addEventListener('focusout', () => {
        closeTimer = setTimeout(() => {
            const activeEl = document.activeElement;
            const isInside = safeArea.some(el => isDescendant(el, activeEl));
            if (!isInside) closeAllGnb();
        }, 150);
    });

    // trigger 및 depth2 모두에 대해 포커스 시 active 토글
    document.querySelectorAll('.gnb-main-trigger').forEach(trigger => {
        trigger.addEventListener('focus', () => {
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        });
        trigger.addEventListener('blur', () => {
            setTimeout(() => {
                if (!trigger.contains(document.activeElement)) {
                    trigger.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            }, 100);
        });
    });

    document.querySelectorAll('.depth2').forEach(menu => {
        const trigger = menu.previousElementSibling;
        if (!trigger || !trigger.classList.contains('gnb-main-trigger')) return;

        menu.addEventListener('mouseenter', () => {
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        });
        menu.addEventListener('mouseleave', () => {
            trigger.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
        });

        menu.addEventListener('focusin', () => {
            trigger.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        });

        menu.addEventListener('focusout', () => {
            setTimeout(() => {
                if (!menu.contains(document.activeElement)) {
                    trigger.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            }, 100);
        });
    });
},





    /**
     * [공통] Footer 셀렉트 드롭다운 아코디언 토글
     */
    bindFootSelectToggle() {
    const $buttons = $('.footSelect');

    $buttons.on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const $dropdown = $this.next('.drop-down');
        const isExpanded = $this.attr('aria-expanded') === 'true';

        // 모든 다른 드롭다운 닫기
        $buttons.not($this).removeClass('active').attr('aria-expanded', 'false')
            .next('.drop-down').removeClass('active');

        if (isExpanded) {
            $this.removeClass('active').attr('aria-expanded', 'false');
            $dropdown.removeClass('active');
        } else {
            $this.addClass('active').attr('aria-expanded', 'true');
            $dropdown.addClass('active');
        }
    });

    // 바깥 클릭 시 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.foot-link-item').length) {
            $buttons.removeClass('active').attr('aria-expanded', 'false');
            $('.drop-down').removeClass('active');
        }
    });
}


    
};



$(function () {
  // 한글 설정
  $.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월','2월','3월','4월','5월','6월',
      '7월','8월','9월','10월','11월','12월'],
    dayNamesMin: ['일','월','화','수','목','금','토'],
    showMonthAfterYear: true,
    yearSuffix: '년'
  });

  // 범위 입력기(채용기간 등)에 자동 datepicker 적용
  $('.input-group.range').each(function () {
    var $inputs = $(this).find('input[type="text"].datepicker');
    if ($inputs.length >= 2) {
      $inputs.eq(0).datepicker({
        beforeShowDay: highlightWeekend,
        onSelect: function (selectedDate) {
          $inputs.eq(1).datepicker("option", "minDate", selectedDate);
        }
      });
      $inputs.eq(1).datepicker({
        beforeShowDay: highlightWeekend,
        onSelect: function (selectedDate) {
          $inputs.eq(0).datepicker("option", "maxDate", selectedDate);
        }
      });
    }
  });

  // 단독 datepicker (input-group.range 바깥)
  $('input[type="text"].datepicker').each(function () {
    // 이미 위에서 처리된 경우(범위 내 input) skip
    if ($(this).closest('.input-group.range').length === 0) {
      $(this).datepicker({
        beforeShowDay: highlightWeekend
      });
    }
  });

  // 주말 색상 처리 함수
  function highlightWeekend(date) {
    var day = date.getDay();
    if (day === 0) return [true, "datepicker-sunday"];   // 일요일
    if (day === 6) return [true, "datepicker-saturday"]; // 토요일
    return [true, ""];
  }


  /*************************
   * 숫자만 입력 가능
   */

    // 숫자만 입력: only-number 클래스
  $(document).on('input', '.only-number', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // 스크롤(마우스휠)로 값 바뀌는 것 방지 (UX 통일)
  $(document).on('wheel', '.only-number', function (e) {
    this.blur();
  });

  // 붙여넣기 제한
  $(document).on('paste', '.only-number', function (e) {
    var clipboard = (e.originalEvent || e).clipboardData.getData('text');
    if (/[^0-9]/.test(clipboard)) e.preventDefault();
  });
});
