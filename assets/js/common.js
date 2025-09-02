$(document).ready(function () {
  $('#header').load('./components/header.html');
  $('#footer').load('./components/footer.html');
});

$(document).ready(function () {
  // snb
  $('.kfsi-snb-item-sub > .kfsi-snb-item').each(function () {
    if (!$(this).find('.hidden').length) {
      $(this).append('<span class="hidden">하위메뉴 접힘</span>');
    }
  });

  // 로드 시 active 상태 체크
  $('.kfsi-snb-item-sub').each(function () {
    const $sub = $(this);
    const $item = $sub.children('.kfsi-snb-item');
    const $status = $item.find('.hidden');

    if ($sub.hasClass('active')) {
      $status.text('하위메뉴 펼쳐짐');
    } else {
      $status.text('하위메뉴 접힘');
    }
  });

  // 클릭 이벤트
  $('.kfsi-snb-item-sub > .kfsi-snb-item').on('click', function () {
    const $sub = $(this).parent('.kfsi-snb-item-sub');
    const $status = $(this).find('.hidden');

    $sub.toggleClass('active');

    if ($sub.hasClass('active')) {
      $status.text('하위메뉴 펼쳐짐');
    } else {
      $status.text('하위메뉴 접힘');
    }

    return false;
  });

  //약관동의 접근성
  // 초기 세팅: active li에 hidden span 삽입
  $('.kfsi-nav ol li.active').each(function () {
    if (!$(this).find('.hidden').length) {
      $(this).append('<span class="hidden">현재 진행중인 단계</span>');
    }
  });

  //아이콘 접근성
  $(function () {
    $('.ico-lock').each(function () {
      if (!$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">게시글 잠김</span>');
      }
    });

    $('.ico-lock-off').each(function () {
      if (!$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">게시글 열림</span>');
      }
    });

    $('span.text-danger').each(function () {
      // 안의 텍스트가 '*'만 있는 경우
      if ($(this).text().trim() === '*' && !$(this).find('.hidden').length) {
        $(this).append('<span class="hidden">필수입력 항목</span>');
      }
    });
  });

  //active 접근성
  $(function () {
    // 탭 트리거를 넓게 잡아준다 (data-API가 없더라도 .nav-link 클릭은 잡힘)
    const TRIGGER =
      '.nav-link, [data-bs-toggle="tab"], [data-bs-toggle="pill"]';

    function updateTitles() {
      const $tabs = $(TRIGGER);
      $tabs.removeAttr('title');
      // 활성 탭은 .active 또는 aria-selected="true" 로 판단
      $tabs.filter('.active, [aria-selected="true"]').attr('title', '선택됨');
    }

    // 초기 1회
    updateTitles();

    // 1) 부트스트랩 이벤트(있다면 여기서 1차로 갱신)
    $(document).on('shown.bs.tab', TRIGGER, function () {
      // console.log('shown.bs.tab', this);
      updateTitles();
    });

    // 2) 클릭 Fallback (data-bs-toggle이 없어도 동작)
    $(document).on('click', TRIGGER, function () {
      // console.log('click', this);
      // 부트스트랩이 활성화 클래스를 반영한 뒤에 실행되도록
      setTimeout(updateTitles, 0);
    });

    // 3) 동적 생성 Fallback: 탭 트리거가 나중에 붙는 경우도 대비
    const mo = new MutationObserver(() => {
      updateTitles();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });

  $(function () {
    // 모든 title 초기화
    $('.kfsi-snb-item, .kfsi-snb-item-sub-item').removeAttr('title');

    // 1뎁스 active에 title 추가
    $('.kfsi-snb-item-sub.active > .kfsi-snb-item').attr('title', '선택됨');

    // 2뎁스 active에 title 추가
    $('.kfsi-snb-item-sub-item.active').attr('title', '선택됨');

    // 단일 .kfsi-snb-item.active (ex. 로그인)에 title 추가
    $('.kfsi-snb-item.active').attr('title', '선택됨');

    // 모든 pagination에서 active 항목 처리
    $('.pagination .page-item.active .page-link')
      .attr('title', '현재 페이지')
      .parent('.page-item')
      .attr('aria-current', 'page');
  });
  $(function () {
    // 함수: target="_blank" 링크에 title 추가
    function addNewWindowTitle($scope) {
      $scope.find('a[target="_blank"]').each(function () {
        const $link = $(this);
        if (!$link.attr('title')) {
          $link.attr('title', '새창으로 열립니다.');
        }
      });
    }

    // 초기 실행 (페이지 로드 시)
    addNewWindowTitle($(document));

    // 동적 변경 감시
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes.length) {
          $(m.addedNodes).each(function () {
            const $node = $(this);
            if ($node.is('a[target="_blank"]')) {
              // 추가된 a 태그일 경우
              if (!$node.attr('title')) {
                $node.attr('title', '새창으로 열립니다.');
              }
            } else if ($node.find) {
              // 추가된 요소 내부에 a[target="_blank"]가 있는 경우
              addNewWindowTitle($node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  //탭 접근성
  // 모든 탭을 Tab 순서에 포함시키기: tabindex를 항상 0으로 유지
  $(function () {
    const $tabs = $('[data-bs-toggle="tab"][role="tab"]');

    // 초기화
    $tabs.attr('tabindex', '0');

    // 부트스트랩이 탭 변경 시 비활성 탭에 -1을 다시 넣는 것을 방지
    $tabs.on('shown.bs.tab hidden.bs.tab', function () {
      $tabs.attr('tabindex', '0');
    });

    // 접근성 보강(선택): Space/Enter로 활성화 보장
    $tabs.on('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        $(this).tab('show');
      }
    });
  });
  $(function () {
    $('.tab-pane[role="tabpanel"]').removeAttr('tabindex');
  });

  $(document).on('click', 'a[href="#kfsi-body"]', function (e) {
    const $container = $('.kfsi-contents').first();

    if ($container.length) {
      e.preventDefault();

      const focusable = $container
        .find(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        .filter(':visible');

      if (focusable.length) {
        focusable.first().focus();
      } else {
        if (!$container.attr('tabindex')) {
          $container.attr('tabindex', '-1');
        }
        $container.focus();
      }
    } else {
      // 기본 동작 유지 (#kfsi-body로 이동)
      // e.preventDefault() 호출 안 함
    }
  });

  // hover/포커스 → hide 제거, 빠져나가면 hide 추가 (위임)
  $(document)
    .on('mouseenter', '.wrap_controllers', function () {
      $(this).removeClass('hide');
    })
    .on('mouseleave', '.wrap_controllers', function () {
      const el = this;
      setTimeout(function () {
        if (!el.contains(document.activeElement)) $(el).addClass('hide');
      }, 0);
    })
    .on('focusin', '.wrap_controllers', function () {
      $(this).removeClass('hide');
    })
    .on('focusout', '.wrap_controllers', function () {
      const el = this;
      setTimeout(function () {
        if (!el.contains(document.activeElement)) $(el).addClass('hide');
      }, 0);
    })
    .on('keydown', '.wrap_controllers', function (e) {
      if (e.key === 'Escape') $(this).addClass('hide');
    });

  // 컨테이너 자체도 포커스 받을 수 있게(필요 시)
  $(document).on('mouseenter focusin', '.wrap_controllers', function () {
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0'); // 또는 -1
  });

  $(function () {
    // #dropzone 내부의 small을 button으로 교체
    $('#dropzone small').each(function () {
      const text = $(this).text().trim();
      $(this).replaceWith(
        $('<button>', {
          type: 'button',
          id: 'dz-open',
          'aria-describedby': 'dz-instruction',
          text: text,
        })
      );
    });
  });

  // $('.kfsi-datepicker').datepicker({
  //   language: 'ko',
  //   format: 'yyyy/mm/dd',
  //   autoclose: true,
  // });
  //main

  $('.kfsi-main-search-popular-mo').on('click', function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지
    $('.kfsi-main-search-popular-mo').toggleClass('active');
  });

  $(document).on('click', function (e) {
    if (
      !$('.kfsi-main-search-popular-mo').is(e.target) &&
      $('.kfsi-main-search-popular-mo').has(e.target).length === 0
    ) {
      $('.kfsi-main-search-popular-mo').removeClass('active');
    }
  });

  //select
  $('.dropdown-menu a').on('click', function () {
    $(this).parents('.dropdown').find('.dropdown-toggle').text($(this).text());
  });
});
// $('div.dropzone').dropzone({
//   url: 'https://httpbin.org/post',
//   method: 'post',
// });
