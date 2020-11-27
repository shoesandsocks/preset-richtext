import YAML from "yaml";

export const RichTextPreset = class {
  constructor() {
    this.id = "richtext";
    this.name = "RichText";
  }

  /**
   * Post types
   *
   * @returns {object} Post types config
   */
  get postTypes() {
    const path = "2020/{MM}/{dd}/{slug}.md";
    const url = "2020/{MM}/{dd}/{slug}";
    const post = { path, url };
    return ["article", "note", "photo"].map((t) => ({
      type: t,
      name: t,
      post,
    }));
  }

  /**
   * Post template
   *
   * @param {object} properties Post data variables
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
    let content;
    if (properties.content) {
      content = properties.content.html || properties.content;
      content = `${content}\n`;
    } else {
      content = "";
    }
    /** my terrible addition */
    if (properties.photo && properties.photo.url && properties.photo.alt) {
      content =
        `\n![${properties.photo.alt}](${properties.photo.url})\n\n` + content;
    }
    /** end my */
    properties = {
      date: properties.published,
      ...(properties.name && { title: properties.name }),
      ...(properties.summary && { excerpt: properties.summary }),
      ...(properties.category && { category: properties.category }),
      ...(properties.start && { start: properties.start }),
      ...(properties.end && { end: properties.end }),
      ...(properties.rsvp && { rsvp: properties.rsvp }),
      ...(properties.location && { location: properties.location }),
      ...(properties.checkin && { checkin: properties.checkin }),
      ...(properties.audio && { audio: properties.audio }),
      ...(properties.photo && { photo: properties.photo }),
      ...(properties.video && { video: properties.video }),
      ...(properties["bookmark-of"] && {
        "bookmark-of": properties["bookmark-of"],
      }),
      ...(properties["like-of"] && { "bookmark-of": properties["like-of"] }),
      ...(properties["repost-of"] && { "repost-of": properties["repost-of"] }),
      ...(properties["in-reply-to"] && {
        "in-reply-to": properties["in-reply-to"],
      }),
      ...(properties["post-status"] === "draft" && { draft: true }),
      ...(properties.visibility && { visibility: properties.visibility }),
      ...(properties.syndication && { syndication: properties.syndication }),
      ...(properties["mp-syndicate-to"] && {
        "mp-syndicate-to": properties["mp-syndicate-to"],
      }),
    };
    let frontmatter = YAML.stringify(properties);
    frontmatter = `---\n${frontmatter}---\n`;

    return frontmatter + content;
  }
};
