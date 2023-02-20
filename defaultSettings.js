const defaultSettings = {
  options: {
    Home: {
      preview: {
        label: "Preview on hover",
        classes: ["div.style-scope.ytd-video-preview", "#mouseover-overlay"],
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
      }
    },
    Everywhere: {
      thumbnails: {
        label: "Video Thumbnails",
        classes: [".yt-core-image, .yt-core-image--loaded"],
        show: true
      },
      logo: {
        show: true,
        label: "YouTube Logo",
        classes: ["#logo .ytd-topbar-logo-renderer"]
      },
      channelThumb: {
        show: true,
        label: "Channel Avatar",
        classes: ["#avatar .yt-img-shadow"]
      }
    }
  }
};
