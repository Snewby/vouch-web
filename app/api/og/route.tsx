/**
 * OpenGraph Image Generator
 * Creates beautiful social preview images for request links
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Vouch - Get Trusted Recommendations';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 60px',
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
              }}
            >
              Get trusted recommendations from real people
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            vouch.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
