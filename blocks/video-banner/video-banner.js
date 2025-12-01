export default async function decorate(block) {
  // Extract data from the block structure
  const allDivs = [...block.querySelectorAll(':scope > div > div')];

  // Extract fields: breadcrumb, title, videoSrcDesktop, videoSrcMobile
  const [breadcrumbDiv, titleDiv, videoSrcDesktopDiv, videoSrcMobileDiv] = allDivs;

  const showBreadcrumb = breadcrumbDiv?.textContent?.trim().toLowerCase() === 'true';
  const title = titleDiv?.textContent?.trim() || '';
  const videoLinkDesktop = videoSrcDesktopDiv?.querySelector('a')?.href || videoSrcDesktopDiv?.textContent?.trim() || '';
  const videoLinkMobile = videoSrcMobileDiv?.querySelector('a')?.href || videoSrcMobileDiv?.textContent?.trim() || '';

  // Clear the block
  block.textContent = '';

  // Create the video banner container
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('video-banner-container');

  // Add breadcrumb if enabled
  if (showBreadcrumb) {
    const breadcrumb = document.createElement('div');
    breadcrumb.classList.add('video-banner-breadcrumb');

    // Get current URL path and split into segments
    const pathSegments = window.location.pathname
      .split('/')
      .filter((segment) => segment.length > 0);

    // Get page title from document or metadata
    const pageTitle = document.querySelector('title')?.textContent
                      || document.querySelector('meta[property="og:title"]')?.content
                      || title;

    // Build breadcrumb items
    let breadcrumbHTML = `
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <a href="/">Home</a>
          </li>`;

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (isLast) {
        breadcrumbHTML += `
          <li class="breadcrumb-item active" aria-current="page">
            <span>${pageTitle}</span>
          </li>`;
      } else {
        breadcrumbHTML += `
          <li class="breadcrumb-item">
            <a href="${currentPath}">${label}</a>
          </li>`;
      }
    });

    breadcrumbHTML += `
        </ol>
      </nav>`;

    breadcrumb.innerHTML = breadcrumbHTML;
    bannerContainer.appendChild(breadcrumb);
  }

  // Create the main banner wrapper
  const bannerWrapper = document.createElement('div');
  bannerWrapper.classList.add('video-banner-wrapper');

  // Create video background container
  const videoBackground = document.createElement('div');
  videoBackground.classList.add('video-banner-background');

  // Create and configure desktop video element
  const videoDesktop = document.createElement('video');
  videoDesktop.muted = true;
  videoDesktop.autoplay = true;
  videoDesktop.playsInline = true;
  videoDesktop.loop = true;
  videoDesktop.preload = 'auto';
  videoDesktop.classList.add('video-banner-video', 'video-banner-video-desktop');

  if (videoLinkDesktop) {
    const sourceMp4Desktop = document.createElement('source');
    sourceMp4Desktop.src = videoLinkDesktop;
    sourceMp4Desktop.type = 'video/mp4';
    videoDesktop.appendChild(sourceMp4Desktop);
  }

  videoDesktop.load();
  videoBackground.appendChild(videoDesktop);

  // Create and configure mobile video element
  const videoMobile = document.createElement('video');
  videoMobile.muted = true;
  videoMobile.autoplay = true;
  videoMobile.playsInline = true;
  videoMobile.loop = true;
  videoMobile.preload = 'auto';
  videoMobile.classList.add('video-banner-video', 'video-banner-video-mobile');

  if (videoLinkMobile) {
    const sourceMp4Mobile = document.createElement('source');
    sourceMp4Mobile.src = videoLinkMobile;
    sourceMp4Mobile.type = 'video/mp4';
    videoMobile.appendChild(sourceMp4Mobile);
  }

  videoMobile.load();
  videoBackground.appendChild(videoMobile);

  // Create content overlay
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('video-banner-content');

  // Add title
  if (title) {
    const titleElement = document.createElement('h1');
    titleElement.classList.add('video-banner-title');
    titleElement.textContent = title;
    contentContainer.appendChild(titleElement);
  }

  // Assemble the banner
  bannerWrapper.appendChild(videoBackground);
  bannerWrapper.appendChild(contentContainer);
  bannerContainer.appendChild(bannerWrapper);

  // Add to block
  block.appendChild(bannerContainer);

  // Ensure videos play consistently
  setTimeout(() => {
    if (videoDesktop.paused) {
      videoDesktop.play().catch(() => {
        // Auto-play blocked
      });
    }
    if (videoMobile.paused) {
      videoMobile.play().catch(() => {
        // Auto-play blocked
      });
    }
  }, 100);
}
