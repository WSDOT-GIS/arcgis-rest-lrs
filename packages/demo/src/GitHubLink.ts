/**
 * This module defines a Leaflet control which simply is a
 * link to the GitHub source code for the current page.
 */

import { Control, ControlOptions, Map as LMap } from "leaflet";

/**
 * GithubLink initialization options.
 */
export interface IGitHubLinkOptions extends ControlOptions {
  /** Explicitly specify the URL. */
  url?: string;
  /** Use along with "repository" */
  userOrOrg?: string;
  /** Use along with "userOrOrg" */
  repository?: string;
}

/**
 * Provides a link to the current page's source code.
 */
export default class GitHubLink extends Control {
  public readonly url: string;
  /**
   * Creates a new instance
   */
  constructor(options?: IGitHubLinkOptions) {
    super(options);
    // Initialize the url variable.
    let url: string | undefined;

    // If either "url" or "userOrOrg" + "repository" were provided,
    // use these as the URL instead of autodetecting.
    if (options) {
      if (options.url) {
        url = options.url;
      } else if (options.userOrOrg && options.repository) {
        url = `https://github.com/${options.userOrOrg}/${options.repository}`;
      }
    }

    // Autodetect the source code URL from the current page if not provide in constructor.
    if (!url) {
      const re = /^https?\:\/\/(\w+)\.github\.(?:(?:io)|(?:com))\/([^\/]+)/i;
      const match = window.location.href.match(re);
      if (match) {
        url = `https://github.com/${match[1]}/${match[2]}`;
      } else {
        throw Error(
          "Could not detect URL. Autodetection of URL is only possible when being hosted via Github Pages."
        );
      }
    }
    this.url = url;
  }
  /**
   * Constructs the control's HTML element.
   * @param map The Leaflet Map that the control is being added to.
   * @returns Returns a <p> containing an <a>.
   */
  public onAdd(map: LMap) {
    function createListItem(url: string, text: string) {
      const item = document.createElement("li");
      // Use the same styling as the attribution.
      const a = document.createElement("a");
      a.href = url;
      a.textContent = text;
      a.target = "_blank";

      a.addEventListener("click", e => {
        e.stopPropagation();
      });

      item.appendChild(a);
      return item;
    }
    const div = document.createElement("div");
    div.classList.add("leaflet-github-link", "leaflet-control-attribution");

    const ul = document.createElement("ul");
    let li = createListItem(this.url, "Source on GitHub");
    ul.appendChild(li);

    li = createListItem(`${this.url}/issues`, "🐛");
    li.title = "Report bugs here";
    ul.appendChild(li);

    div.appendChild(ul);
    return div;
  }
  public onRemove() {
    // Function required, but nothing to do.
  }
}
