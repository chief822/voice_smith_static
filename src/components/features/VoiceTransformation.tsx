import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VoiceType } from '@/types/voice';
import getFFmpeg from "@/lib/ffmpeg";
import femaleModule from '@/wasm/female/female.js';
import robotModule from '@/wasm/robot/robot.js'

function getFileExtension(filename: string): string {
  return filename.split(".").pop() ?? "dat";
}

function replaceExtension(filename: string, newExt: string): string {
  return filename.replace(/\.[^/.]+$/, `.${newExt}`);
}

export async function convertToWav(inputFile: File): Promise<File> {
  const ffmpeg = await getFFmpeg();

  const inputName = `input.${getFileExtension(inputFile.name)}`;
  const outputName = "output.wav";

  // Write input file to FFmpeg FS
  await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

  // Run conversion
  await ffmpeg.exec([
    "-loglevel",
    "warning",
    "-i",
    inputName,
    "-acodec",
    "pcm_s16le", // standard WAV codec
    "-ar",
    "44100",     // sample rate (change if needed)
    outputName,
  ]);

  // Read result
  const wavData: Uint8Array = await ffmpeg.readFile(outputName) as Uint8Array;

  // Cleanup (optional but recommended)
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  // Convert Uint8Array → File
  return new File([wavData as BlobPart], replaceExtension(inputFile.name, "wav"), {
    type: "audio/wav",
  });
}

export async function applyVoiceEffect(inputFile: File, selectedVoice: VoiceType): Promise<File> {
    const inputName = "input.wav";
  const outputName = "output.wav";
  
  if (selectedVoice == 'old-radio') {    
    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

    // Run conversion
    await ffmpeg.exec([
      "-loglevel",
       "warning",
      "-i",
      inputName,
      "-af",
      "highpass=f=300, lowpass=f=3000, compand=attacks=0:points=-90/-900|-40/-20|0/-10, aresample=8000, acrusher=bits=8:mode=log:mix=0.7, volume=4",
      outputName,
    ]);

    const outputData: Uint8Array = await ffmpeg.readFile(outputName) as Uint8Array;

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return new File([outputData as BlobPart], replaceExtension(inputFile.name, "wav"), {
      type: "audio/wav",
    });
  }
  else if (selectedVoice == 'female') {
    const female = await femaleModule();
    const inputData = new Uint8Array(await inputFile.arrayBuffer());
    female.FS.writeFile(inputName, inputData);

    female.callMain([
      inputName,
      outputName,
    ]);
    
    // Read output from MEMFS
    const outputData = female.FS.readFile(outputName);

    return new File([outputData as BlobPart], replaceExtension(inputFile.name, "wav"), {
      type: "audio/wav",
    });
  }
  else if (selectedVoice == 'robot') {
    const robot = await robotModule();
    const inputData = new Uint8Array(await inputFile.arrayBuffer());
    robot.FS.writeFile(inputName, inputData);

    robot.callMain([
      inputName,
      outputName,
    ]);
    
    // Read output from MEMFS
    const outputData = robot.FS.readFile(outputName);

    return new File([outputData as BlobPart], replaceExtension(inputFile.name, "wav"), {
      type: "audio/wav",
    });
  }
  else {
    // todo show error page this shouldnt happen if user doesnt hack into html
  }
}