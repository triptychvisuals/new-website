#!/usr/bin/env bash
# Frame extraction + (optional) audio transcription for screen recordings.
#
# Usage:
#   extract.sh <video> [fps] [outdir]
#
#   video   path to the recording (mp4/mov/webm/gif...)
#   fps     frames per second to sample (default: 6)
#   outdir  output directory (default: .video-analysis/<video-basename>)
#
# Produces, under <outdir>/:
#   frames/frame_XXXX.jpg   individual sampled frames (downscaled for fast reads)
#   contact_XXX.jpg         contact-sheet grids (20 frames each) for an overview
#   transcript.txt          Whisper transcription, if the video has an audio track
#   summary.txt             metadata + frame->timestamp index
set -euo pipefail

VIDEO="${1:?Usage: extract.sh <video> [fps] [outdir]}"
FPS="${2:-6}"

if [[ ! -f "$VIDEO" ]]; then
  echo "ERROR: video not found: $VIDEO" >&2
  exit 1
fi

BASENAME="$(basename "${VIDEO%.*}")"
OUTDIR="${3:-.video-analysis/$BASENAME}"
FRAMES_DIR="$OUTDIR/frames"
mkdir -p "$FRAMES_DIR"

echo "==> Probing $VIDEO"
DURATION="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO" 2>/dev/null || echo '?')"
RES="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$VIDEO" 2>/dev/null || echo '?')"
SRC_FPS="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$VIDEO" 2>/dev/null || echo '?')"
HAS_AUDIO="$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$VIDEO" 2>/dev/null | head -1 || true)"

echo "    duration=${DURATION}s  resolution=${RES}  source_fps=${SRC_FPS}  audio=$([[ -n "$HAS_AUDIO" ]] && echo yes || echo no)"

echo "==> Extracting frames at ${FPS} fps -> $FRAMES_DIR"
# Downscale to max width 1280 (keep aspect, even dims) so frames stay light to read.
ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" \
  -vf "fps=${FPS},scale='min(1280,iw)':-2" -q:v 3 \
  "$FRAMES_DIR/frame_%04d.jpg"

FRAME_COUNT="$(find "$FRAMES_DIR" -name 'frame_*.jpg' | wc -l | tr -d ' ')"
echo "    extracted ${FRAME_COUNT} frames"

echo "==> Building contact sheets (20 frames/grid) -> $OUTDIR/contact_XXX.jpg"
ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" \
  -vf "fps=${FPS},scale=320:-2,tile=5x4" -q:v 3 \
  "$OUTDIR/contact_%03d.jpg" || echo "    (contact sheet step skipped)"

# Frame -> timestamp index (timestamp = (n-1)/fps).
{
  echo "video: $VIDEO"
  echo "duration_s: $DURATION"
  echo "resolution: $RES"
  echo "source_fps: $SRC_FPS"
  echo "sample_fps: $FPS"
  echo "frame_count: $FRAME_COUNT"
  echo ""
  echo "frame -> timestamp (s):"
  n=1
  for f in "$FRAMES_DIR"/frame_*.jpg; do
    ts="$(awk -v n="$n" -v fps="$FPS" 'BEGIN{printf "%.3f", (n-1)/fps}')"
    printf "  %s  %ss\n" "$(basename "$f")" "$ts"
    n=$((n+1))
  done
} > "$OUTDIR/summary.txt"

# Optional transcription.
if [[ -n "$HAS_AUDIO" ]] && command -v whisper >/dev/null 2>&1; then
  echo "==> Transcribing audio with Whisper (model=base)"
  whisper "$VIDEO" --model base --fp16 False \
    --output_format txt --output_dir "$OUTDIR" >/dev/null 2>&1 \
    && mv "$OUTDIR/$BASENAME.txt" "$OUTDIR/transcript.txt" 2>/dev/null || true
  [[ -f "$OUTDIR/transcript.txt" ]] && echo "    -> $OUTDIR/transcript.txt"
else
  echo "==> Skipping transcription ($([[ -z "$HAS_AUDIO" ]] && echo 'no audio track' || echo 'whisper not installed'))"
fi

echo ""
echo "DONE. Next steps for the agent:"
echo "  1. Read $OUTDIR/summary.txt for metadata + frame timestamps."
echo "  2. Read the contact sheets ($OUTDIR/contact_*.jpg) for an overview, then"
echo "     Read individual $FRAMES_DIR/frame_*.jpg around any fast transition."
[[ -f "$OUTDIR/transcript.txt" ]] && echo "  3. Read $OUTDIR/transcript.txt for any spoken notes."
