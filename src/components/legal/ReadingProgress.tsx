/**
 * A thin accent bar under the header that fills as you read — driven by a
 * CSS scroll timeline, so it costs no JavaScript at all (see .reading-bar
 * in globals.css). Browsers without scroll timelines just don't show it.
 */
export default function ReadingProgress() {
  return <div aria-hidden className="reading-bar" />;
}
