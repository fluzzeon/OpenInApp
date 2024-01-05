import { Injector, Logger, webpack } from "replugged";

const inject = new Injector();
const logger = Logger.plugin("OpenInApp");

export async function start(): Promise<void> {
  function clickOrigin(e: MouseEvent): { tagType: string; clickedUrl: string } {
    const target = e.target as HTMLElement;
    const tagType = target.tagName.toLowerCase();
    const anchorElement = target.closest('a');
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
  const tagsToIdentify =  ["span", "img", "a"];

  document.body.onclick = function (e: MouseEvent): void {
    const origin = clickOrigin(e);
    
    for (let i = 0; i < tagsToIdentify.length; i++) {
      if (origin.tagType === tagsToIdentify[i]) {
        logger.log(`Tag type: ${origin.tagType}, Clicked URL: ${origin.clickedUrl}`);
        const matchedUrl = Object.entries(urls).find(([_, urls]) =>
          urls.some((url) => origin.clickedUrl.includes(url)),
        );

        if (matchedUrl) {
          const appProtocol = protocols[matchedUrl[0]];
          const appUrl = `${appProtocol}${origin.clickedUrl}`;
          logger.log(`New URL: ${appUrl}`);
          window.open(appUrl, "_blank", "noopener noreferrer");
          e.preventDefault();
        }
      }
    }
  };
}

export function stop(): void {
  inject.uninjectAll();
}
