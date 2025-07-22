$(document).ready(function () {
    $('.btn-expand').on('click', function () {
        const $btn = $(this);
        const targetId = $btn.data('expand');
        const $target = $('#' + targetId);

        // open 클래스 토글
        $btn.toggleClass('open');

        // 슬라이드 토글
        $target.stop(true, true).slideToggle(300);
    });
});


/** 대면더보기 부드럽게 열리는 인터렉션 */
$(function () {
    $(".krds-btn.bot-close-btn").on("click", function () {
        const $btn = $(this);
        const $section = $btn.closest(".ea-section");

        if ($section.hasClass("open")) {
            // 닫기: 높이를 다시 고정값으로
            $section.css("max-height", "350px");
            $section.removeClass("open");

            // 버튼 텍스트 변경
            $btn.contents().filter(function () {
                return this.nodeType === 3; // 텍스트 노드만 변경
            }).first().replaceWith("더보기 ");
        } else {
            // 열기: 실제 높이 계산 후 적용
            const fullHeight = $section.prop("scrollHeight");
            $section.css("max-height", fullHeight + "px");
            $section.addClass("open");

            // 버튼 텍스트 변경
            $btn.contents().filter(function () {
                return this.nodeType === 3;
            }).first().replaceWith("닫기 ");
        }
    });
});