//TODO: explore > live

var defaultSettings = {
  currentPage: "Home",
  options: {
    Home: {
      preview: {
        label: "Preview on hover",
        classes: [
          ".ytd-video-preview",
          "#mouseover-overlay",
          ".ytd-thumbnail-overlay-loading-preview-renderer"
        ],
        show: true
      },
      communityPosts: {
        label: "Latest posts",
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
        label: "Video title",
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
      nextvideos: {
        label: "End Recs (Default)",
        classes: [".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"],
        show: true
      },
      endvideos: {
        label: "End Recs (Channel)",
        classes: [".ytp-endscreen-content"],
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
        classes: ["div.style-scope.ytd-playlist-panel-renderer"],
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
        label: "Subscriber count",
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
      }
    },
    Everywhere: {
      emoji: {
        label: "Emoji",
        classes: [".zt-emoji"],
        show: true,
        pattern:
          /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu
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
        classes: [".ytd-thumbnail-overlay-time-status-renderer"],
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
        label: "Resume bar",
        classes: [
          "div.style-scope.ytd-thumbnail-overlay-resume-playback-renderer"
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
      },
      subscribe: {
        label: "Subscribe Button",
        classes: ["yt-button-shape.style-scope.ytd-subscribe-button-renderer"],
        show: true
      }
    }
  }
};
