let clickHandler: (e: MouseEvent) => void;

export function start(): void {
  function clickOrigin(e: MouseEvent): { tagType: string; clickedUrl: string } {
    const target = e.target as HTMLElement;
    const tagType = target.tagName.toLowerCase();
    const anchorElement = target.closest("a");
    const clickedUrl = anchorElement ? anchorElement.href : "";
    return { tagType, clickedUrl };
  }

  const urls = {
    steam: ["steamcommunity.com", "help.steampowered.com", "store.steampowered.com", "s.team"],
    spotify: ["open.spotify.com", "play.spotify.com"],
    tidal: ["tidal.com", "listen.tidal.com"],
  };
  const protocols: Record<string, string> = {
    steam: "steam://openurl/",
    spotify: "spotify://",
    tidal: "tidal://",
  };

  clickHandler = function (e: MouseEvent): void {
    const origin = clickOrigin(e);

    if (origin.tagType === "span") {
      const matchedUrl = Object.entries(urls).find(([_, urls]) =>
        urls.some((url) => origin.clickedUrl.includes(url)),
      );

      if (matchedUrl) {
        const appProtocol = protocols[matchedUrl[0]];
        const appUrl = `${appProtocol}${origin.clickedUrl}`;
        window.open(appUrl, "_blank", "noopener noreferrer");
        e.preventDefault();
      }
    }
  };

  document.body.addEventListener("click", clickHandler);
}

export function stop(): void {
  if (clickHandler) {
    document.body.removeEventListener("click", clickHandler);
  }
}
