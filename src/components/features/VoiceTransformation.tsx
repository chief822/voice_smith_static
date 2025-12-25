import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VoiceType } from '@/types/voice';
import getFFmpeg from "./LoadFFmpeg";

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
    const ffmpeg = await getFFmpeg();

    if (selectedVoice == 'female') {

    }
}