var defaultSettings = {
  currentPage: "Home",
  options: {
    Home: {
      preview: {
        label: "Preview on hover",
        classes: [
          "div.style-scope.ytd-video-preview",
          "#mouseover-overlay",
          "span.style-scope.ytd-thumbnail-overlay-loading-preview-renderer"
        ],
        show: true
      },
      communityPosts: {
        label: "Latest posts",
        classes: ["ytd-rich-shelf-renderer"],
        show: true,
        id: "communityPosts"
      },
      adThumbs: {
        label: "Ad Thumbnails",
        classes: [".ytd-display-ad-renderer", ".ytd-ad-slot-renderer"],
        show: true
      },
      chipBar: {
        show: true,
        label: "Feed Filter Chip Bar",
        classes: [".ytd-feed-filter-chip-bar-renderer"]
      },
      title: {
        show: true,
        label: "Video title",
        classes: ["yt-formatted-string.style-scope.ytd-rich-grid-media"]
      }
    },
    Video: {
      sidebar: {
        show: true,
        label: "Video Sidebar",
        classes: [".ytd-watch-next-secondary-results-renderer"]
      },
      nextvideos: {
        show: true,
        label: "End Recs (Default)",
        classes: [".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"]
      },
      endvideos: {
        show: true,
        label: "End Recs (Channel)",
        classes: [".ytp-endscreen-content"]
      },
      chat: {
        show: true,
        label: "Chat",
        classes: ["#chat"]
      },
      likes: {
        show: true,
        label: "Likes",
        classes: [
          "ytd-menu-renderer.style-scope.ytd-watch-metadata .yt-core-attributed-string"
        ]
      },
      comments: {
        show: true,
        label: "Comments",
        classes: [".ytd-comments"]
      },
      playlist: {
        show: true,
        label: "Playlist",
        classes: ["div.style-scope.ytd-playlist-panel-renderer"]
      },
      chapters: {
        show: true,
        label: "Chapters",
        classes: [
          "ytd-engagement-panel-section-list-renderer.style-scope.ytd-watch-flexy"
        ]
      },
      subscribe: {
        show: true,
        label: "Subscribe Button",
        classes: ["yt-button-shape.style-scope.ytd-subscribe-button-renderer"]
      },
      title: {
        show: true,
        label: "Video Title",
        classes: ["yt-formatted-string.style-scope.ytd-watch-metadata"]
      },
      sub_count: {
        show: true,
        label: "Subscriber count",
        classes: ["yt-formatted-string.style-scope.ytd-video-owner-renderer"]
      },
      description: {
        show: true,
        label: "Description Box",
        classes: ["ytd-text-inline-expander.style-scope.ytd-watch-metadata"]
      }
    },
    Everywhere: {
      metadata: {
        show: true,
        label: "Video Metadata",
        classes: [
          "span.inline-metadata-item.style-scope.ytd-video-meta-block",
          "yt-formatted-string.style-scope.ytd-channel-name",
          "yt-icon.style-scope.ytd-badge-supported-renderer",
          "div.badge.badge-style-type-live-now-alternate.style-scope.ytd-badge-supported-renderer",
          "#metadata-line",
          "#byline-container"
        ]
      },
      duration: {
        label: "Video Duration",
        classes: [
          "span.style-scope.ytd-thumbnail-overlay-time-status-renderer"
        ],
        show: true
      },
      thumbnails: {
        label: "Video Thumbnails",
        classes: [".yt-core-image--loaded"],
        show: true
      },
      resume: {
        show: true,
        label: "Resume bar",
        classes: [
          "div.style-scope.ytd-thumbnail-overlay-resume-playback-renderer"
        ]
      },
      logo: {
        show: true,
        label: "YouTube Logo",
        classes: ["#logo .ytd-topbar-logo-renderer"]
      },
      channelThumb: {
        show: true,
        label: "Channel Avatar",
        classes: [
          "#avatar .yt-img-shadow",
          "yt-img-shadow.style-scope.ytd-rich-grid-media.no-transition",
          "tp-yt-paper-item.style-scope.ytd-guide-entry-renderer img.style-scope.yt-img-shadow"
        ]
      }
    }
  }
};
