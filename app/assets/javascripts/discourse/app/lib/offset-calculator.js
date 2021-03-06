export function scrollTopFor(y) {
  return y - offsetCalculator();
}

export function minimumOffset() {
  const header = document.querySelector("header.d-header"),
    iPadNav = document.querySelector(".footer-nav-ipad .footer-nav"),
    iPadNavHeight = iPadNav ? iPadNav.offsetHeight : 0;

  // if the header has a positive offset from the top of the window, we need to include the offset
  // this covers cases where a site has a custom header above d-header (covers fixed and unfixed)
  const headerWrap = document.querySelector(".d-header-wrap");
  let headerWrapOffset = null;
  if (headerWrap === null) {
    headerWrapOffset = 0;
  } else {
    headerWrapOffset = headerWrap.getBoundingClientRect();
    headerWrapOffset = headerWrapOffset.top;
  }

  return header
    ? header.offsetHeight + headerWrapOffset.top + iPadNavHeight
    : 0;
}

export default function offsetCalculator() {
  const min = minimumOffset();

  // on mobile, just use the header
  if (document.querySelector("html").classList.contains("mobile-view")) {
    return min;
  }

  const windowHeight = window.innerHeight;
  const documentHeight = document.body.clientHeight;
  const topicBottomOffsetTop = document.getElementById("topic-bottom")
    .offsetTop;

  // the footer is bigger than the window, we can scroll down past the last post
  if (documentHeight - windowHeight > topicBottomOffsetTop) {
    return min;
  }

  const scrollTop = window.scrollY;
  const visibleBottomHeight = scrollTop + windowHeight - topicBottomOffsetTop;

  if (visibleBottomHeight > 0) {
    const bottomHeight = documentHeight - topicBottomOffsetTop;
    const offset =
      ((windowHeight - bottomHeight) * visibleBottomHeight) / bottomHeight;
    return Math.max(min, offset);
  }

  return min;
}
