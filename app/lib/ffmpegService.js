import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// let ffmpeg = null;
// let currentFFmpeg = null;
// let currentReject = null;
// let isAborted = false;
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

const activeWorkers = new Set();
export const WorkerFactory = {
  createWorker: () => {
    let ff = null;
    let isAborted = false;
    let rejectPromise = null;

    const worker = {
      async compress(inputFile, preset = "medium", onProgress) {
        activeWorkers.add(worker);
        return new Promise(async (resolve, reject) => {
          rejectPromise = reject;
           ff = new FFmpeg();
          isAborted = false;


          const inputName = `in_${Date.now()}_${inputFile.name}`;
          const outputName = `out_${Date.now()}.mp4`;

          // prepare throttled progress handler (500ms)
          const throttledProgress = typeof onProgress === "function" ? throttle((pct) => onProgress(pct), 500) : null;
          let progressHandler = null;
          if (throttledProgress) {
            progressHandler = ({ progress }) => {
              // v0.12 emits progress in [0..1]
              const ratio = typeof progress === "number" ? progress : 0;
              throttledProgress(Math.round((ratio || 0) * 100));
            };
            ff.on("progress", progressHandler);
          }

          try {
            await ff.load();
            // write file to ffmpeg FS
            await ff.writeFile(inputName, await fetchFile(inputFile));
            if (isAborted) throw new Error("Canceled");

            // run compression
            await ff.exec([
              "-i", inputName,
              "-c:v", "libx264",
              "-crf", "28",
              "-preset", preset,
              "-c:a", "aac",
              "-b:a", "128k",
              outputName,
            ]);
            if (isAborted) throw new Error("Canceled");


            // read output
            const data = await ff.readFile(outputName);
            if (isAborted) throw new Error("Canceled");

            const blob = new Blob([data], { type: "video/mp4" });

            // cleanup
            try { await ff.deleteFile(inputName); } catch (e) { }
            try { await ff.deleteFile(outputName); } catch (e) { }

            resolve(blob);
          } catch (err) {
            console.log("Canceled or error during compression:", err);

            rejectPromise(err);
          } finally {
            try { await ff.deleteFile(inputName); } catch (e) { }
            try { await ff.deleteFile(outputName); } catch (e) { }
            if (throttledProgress && typeof throttledProgress.cancel === 'function') throttledProgress.cancel();
            if (progressHandler) ff.off("progress", progressHandler);
            try { ff.terminate(); } catch (e) { }
            ff = null;
            activeWorkers.delete(worker);
          }
        }

        )


      },
      abort() {
        isAborted = true;
        try { ff?.terminate(); } catch (e) { };
        if (rejectPromise) rejectPromise(new Error("Canceled"));
      }
    };
    return worker;
  }
};



export function abortCurrentRun() {
  activeWorkers.forEach(worker => { worker.abort() });
  activeWorkers.clear();

}