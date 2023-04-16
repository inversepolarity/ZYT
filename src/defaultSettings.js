//TODO: explore > live
var defaultSettings = {
  currentPage: "Home",
  options: {
    Home: {
      preview: {
        label: "Preview-On-Hover",
        classes: [
          ".ytd-video-preview",
          "#mouseover-overlay",
          ".ytd-thumbnail-overlay-loading-preview-renderer"
        ],
        show: true
      },
      communityPosts: {
        label: "Latest Posts",
        classes: ["ytd-rich-shelf-renderer"],
        id: "communityPosts",
        show: true
      },
      adThumbs: {
        label: "Ad Thumbnails",
        classes: [".ytd-display-ad-renderer", ".ytd-ad-slot-renderer"],
        show: true
      },
      chipBar: {
        label: "Feed Filter Chip Bar",
        classes: [".ytd-feed-filter-chip-bar-renderer"],
        show: true
      },
      title: {
        label: "Video Title",
        classes: ["yt-formatted-string.style-scope.ytd-rich-grid-media"],
        show: true
      }
    },
    Video: {
      sidebar: {
        label: "Video Sidebar",
        classes: [".ytd-watch-next-secondary-results-renderer"],
        show: true
      },
      endvideos: {
        label: "Recommendations",
        classes: [
          ".ytp-endscreen-content",
          ".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"
        ],
        show: true
      },
      chat: {
        label: "Chat",
        classes: ["#chat"],
        show: true
      },
      likes: {
        label: "Likes",
        classes: [
          "ytd-menu-renderer.style-scope.ytd-watch-metadata .yt-core-attributed-string"
        ],
        show: true
      },
      comments: {
        label: "Comments",
        classes: [".ytd-comments"],
        show: true
      },
      playlist: {
        label: "Playlist",
        classes: [".ytd-playlist-panel-renderer"],
        show: true
      },
      chapters: {
        label: "Chapters",
        classes: [
          "ytd-engagement-panel-section-list-renderer.style-scope.ytd-watch-flexy"
        ],
        show: true
      },
      title: {
        label: "Video Title",
        classes: ["yt-formatted-string.style-scope.ytd-watch-metadata"],
        show: true
      },
      sub_count: {
        label: "Subscriber Count",
        classes: ["yt-formatted-string.style-scope.ytd-video-owner-renderer"],
        show: true
      },
      description: {
        label: "Description Box",
        classes: ["ytd-text-inline-expander.style-scope.ytd-watch-metadata"],
        show: true
      },
      merch: {
        label: "Merchandise Box",
        classes: ["ytd-merch-shelf-renderer.style-scope.ytd-watch-flexy"],
        show: true
      },
      subscribe: {
        label: "Subscribe Button",
        classes: ["yt-button-shape.style-scope.ytd-subscribe-button-renderer"],
        show: true
      }
    },
    Everywhere: {
      emoji: {
        label: "Emoji",
        classes: null,
        show: true
      },
      metadata: {
        label: "Video Metadata",
        classes: [
          "span.inline-metadata-item.style-scope.ytd-video-meta-block",
          "yt-formatted-string.style-scope.ytd-channel-name",
          "yt-icon.style-scope.ytd-badge-supported-renderer",
          "div.badge.badge-style-type-live-now-alternate.style-scope.ytd-badge-supported-renderer",
          "#metadata-line",
          "#byline-container"
        ],
        show: true
      },
      duration: {
        label: "Video Duration",
        classes: [
          ".ytd-thumbnail-overlay-time-status-renderer",
          "ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail"
        ],
        show: true
      },
      thumbnails: {
        label: "Video Thumbnails",
        classes: [
          ".ytd-macro-markers-list-item-renderer>img",
          ".thumbnail-container.style-scope.ytd-notification-renderer",
          ".yt-core-image--loaded"
        ],
        show: true
      },
      resume: {
        label: "Resume Bar",
        classes: [
          ".ytd-thumbnail-overlay-resume-playback-renderer",
          "ytd-thumbnail-overlay-resume-playback-renderer.style-scope.ytd-thumbnail "
        ],
        show: true
      },
      logo: {
        label: "YouTube Logo",
        classes: ["#logo .ytd-topbar-logo-renderer"],
        show: true
      },
      channelThumb: {
        label: "Channel Avatar",
        classes: [
          "#avatar",
          "#channel-thumbnail",
          "tp-yt-paper-item.style-scope.ytd-guide-entry-renderer > yt-img-shadow"
        ],
        show: true
      }
    }
  }
};
