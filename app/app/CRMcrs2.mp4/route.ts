import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), 'app', 'CRMcrs2.mp4');

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Video not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return new NextResponse('Requested range not satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${fileSize}` },
      });
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const stream = new ReadableStream({
      start(controller) {
        file.on('data', (chunk) => controller.enqueue(chunk));
        file.on('end', () => controller.close());
        file.on('error', (err) => controller.error(err));
      },
      cancel() {
        file.destroy();
      },
    });

    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  }

  const file = fs.createReadStream(filePath);
  const stream = new ReadableStream({
    start(controller) {
      file.on('data', (chunk) => controller.enqueue(chunk));
      file.on('end', () => controller.close());
      file.on('error', (err) => controller.error(err));
    },
    cancel() {
      file.destroy();
    },
  });

  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
    },
  });
}
