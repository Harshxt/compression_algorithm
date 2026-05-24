import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg = null;

// simple throttling helper (500ms default used below)
function throttle(fn, wait) {
  let last = 0;
  let timer = null;
  const throttled = (...args) => {
    const now = Date.now();
    const invoke = () => {
      last = Date.now();
      fn(...args);
    };
    if (now - last >= wait) {
      if (timer) { clearTimeout(timer); timer = null; }
      invoke();
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(invoke, wait - (now - last));
    }
  };
  throttled.cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  return throttled;
}

export async function initFFmpeg() {
  if (ffmpeg && ffmpeg.isLoaded()) return ffmpeg;

  ffmpeg = createFFmpeg({ log: true });

  await ffmpeg.load();
  return ffmpeg;
}

export async function compressVideo(inputFile, preset = "medium", onProgress) {
  const ff = await initFFmpeg();
  const inputName = `in_${Date.now()}_${inputFile.name}`;
  const outputName = `out_${Date.now()}.mp4`;

  // prepare throttled progress handler (500ms)
  const throttledProgress = typeof onProgress === "function" ? throttle((pct) => onProgress(pct), 500) : null;
  if (throttledProgress) {
    ff.setProgress(({ ratio }) => {
      throttledProgress(Math.round((ratio || 0) * 100));
    });
  }

  try {
    // write file to ffmpeg FS
    ff.FS("writeFile", inputName, await fetchFile(inputFile));

    // run compression
    await ff.run(
      "-i", inputName,
      "-c:v", "libx264",
      "-crf", "28",
      "-preset", preset,
      "-c:a", "aac",
      "-b:a", "128k",
      outputName
    );

    // read output
    const data = ff.FS("readFile", outputName);
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    // cleanup
    try { ff.FS("unlink", inputName); } catch (e) {}
    try { ff.FS("unlink", outputName); } catch (e) {}

    return blob;
  } catch (err) {
    console.error("FFmpeg compression error:", err);
    throw err;
  } finally {
    // cleanup throttling and ffmpeg progress handler
    if (throttledProgress && typeof throttledProgress.cancel === 'function') throttledProgress.cancel();
    if (typeof onProgress === "function") ff.setProgress(() => {});
  }
}